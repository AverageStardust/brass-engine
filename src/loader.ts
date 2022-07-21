/**
 * Loads and handles assets.
 * Enables loading screens for Brass games.
 * @module
 */

import p5 from "p5";
import { expect } from "./common/runtimeChecking";
import { createFastGraphics } from "./common/fastGraphics";
import { FieldDeclaration, Level } from "./tilemap/tilemapAbstract";



type Asset = p5.Image | p5.Graphics | p5.SoundFile | Level;
type AssetDefinitionArgs = [string] | [string, string];
// like loadImage() or loadSound()
type P5LoaderFuction = (path: string, successCallback: (data: Asset) => void, failureCallback: (event: Event) => unknown) => Asset;

enum AssetType {
	Image = "image",
	Sound = "sound",
	Level = "level"
}

interface AssetDefinition {
	name: string;
	fullPath: string;
	basePath: string;
	extension: string;
}

interface QueuedAsset {
	type: AssetType;
	path: string;
	names: string[];
	late: boolean;
	children: QueuedAsset[]; // what to load afterward

	fields?: FieldDeclaration;
	resolve?: (asset: Asset) => void;
	reject?: (error: Error) => void;
}

const assetTypeExtensions: { [key in AssetType]: Set<string> } = {
	[AssetType.Image]: new Set([".png", ".jpg", ".jpeg", ".gif", ".tif", ".tiff"]),
	[AssetType.Sound]: new Set([".mp3", ".wav", ".ogg"]),
	[AssetType.Level]: new Set([".json"]),
};



const assets: { [key: string]: Asset } = {};
const loadQueue: QueuedAsset[] = [];
let useSound = false;
let inited = false;
let soundFormatsConfigured = false;
let unsafeLevelLoading = false;

let totalLateAssets = 0;
let loadingAssets = 0;
let loadedLateAssets = 0;

let errorImage: p5.Graphics;
let errorSound: p5.SoundFile;



export function init(_useSound: boolean) {
	useSound = _useSound;
	if (useSound && typeof p5.SoundFile !== "function") {
		throw Error("p5.Sound was not found; Can't initialize Brass loader sound without p5.Sound loaded first");
	}

	errorImage = createFastGraphics(64, 64);

	errorImage.background(0);
	errorImage.fill(255, 0, 255);
	errorImage.noStroke();
	errorImage.rect(0, 0, 32, 32);
	errorImage.rect(32, 32, 32, 32);

	// check for p5.sound and create error sound

	if (useSound) {
		// @ts-ignore because hacks are needed to generate sound in code
		errorSound = new p5.SoundFile();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const audioCtx: any = getAudioContext();

		// 2.5 kHz sin wave for 0.25 seconds
		const bufferData = new Array(11025).fill(0).map((_, i) => Math.sin(i * 0.356));
		const audioBuffer = audioCtx.createBuffer(1, bufferData.length, 44100);

		audioBuffer.getChannelData(0).set(bufferData);

		// @ts-ignore because hacks are needed to generate sound in code
		errorSound.buffer = audioBuffer;
		// @ts-ignore because hacks are needed to generate sound in code
		errorSound.panner.inputChannels(audioBuffer.numberOfChannels);
	}

	inited = true;
	loadQueuedAssets();
}

function enforceInit(action: string) {
	if (inited) return;
	throw Error(`Brass loader must be initialized before ${action}; Run Brass.init()`);
}

function enforceP5SoundPresent(action: string) {
	if (useSound === true) return;
	throw Error(`Sound must enabled in Brass.init() before ${action}`);
}

function loadAssetLate(...assets: QueuedAsset[]) {
	loadQueue.push(...assets);
	queueMicrotask(loadQueuedAssets);
}

function loadQueuedAssets() {
	if (!inited) return; // loading will restart after Brass.init()
	if (loadingAssets >= 2) return;
	const assetEntry = loadQueue.shift();

	// check when late loading is done, reset counts
	if (loaded()) {
		totalLateAssets = 0;
		loadedLateAssets = 0;
	}

	if (assetEntry === undefined) return;

	loadingAssets++;

	switch (assetEntry.type) {
		default:
			throw Error(`Unknown asset type (${assetEntry.type})`);

		case AssetType.Image:
			loadImage(assetEntry.path,
				handleAsset.bind(globalThis, assetEntry),
				handleAssetFail.bind(globalThis, assetEntry));
			break;

		case AssetType.Sound:
			loadSound(assetEntry.path,
				handleAsset.bind(globalThis, assetEntry),
				handleAssetFail.bind(globalThis, assetEntry));
			break;


		case AssetType.Level:
			loadJSON(assetEntry.path,
				handleAsset.bind(globalThis, assetEntry),
				handleAssetFail.bind(globalThis, assetEntry));
			break;
	}

	queueMicrotask(loadQueuedAssets);
}

function handleAsset(assetEntry: QueuedAsset, data: unknown) {
	if (assetEntry.late) {
		loadedLateAssets++;
	}
	loadingAssets--;

	if (assetEntry.type === AssetType.Level) {
		expect(assetEntry.fields !== undefined);
		data = parseLevelJson(assetEntry.fields, data);
	}

	for (const name of assetEntry.names) {
		assets[name] = data as Asset;
	}

	if (assetEntry.resolve) {
		assetEntry.resolve(data as Asset);
	}

	if ("children" in assetEntry && assetEntry.children.length > 0) {
		loadAssetLate(...assetEntry.children);
	} else {
		queueMicrotask(loadQueuedAssets);
	}
}

function handleAssetFail(assetEntry: QueuedAsset) {
	if (assetEntry.late) {
		loadedLateAssets++;
	}
	loadingAssets--;

	const error = Error(`Failed to load asset (${assetEntry.names[0]}) at path (${assetEntry.path})`);

	if (assetEntry.reject) {
		assetEntry.reject(error);
	} else {
		throw error;
	}
}



export function loaded() {
	return loadProgress() >= 1;
}

export function loadFraction() {
	return `${loadedLateAssets} / ${totalLateAssets}`;
}

export function loadProgress() {
	if (totalLateAssets === 0) return 1;
	return loadedLateAssets / totalLateAssets;
}



export function loadImageEarly(...args: AssetDefinitionArgs) {
	const { name, fullPath } = parseAssetDefinition(AssetType.Image, args);

	return queueEarlyAssetWithPromise(fullPath, name, loadImage);
}

export function loadImageLate(...args: AssetDefinitionArgs) {
	const { name, fullPath } = parseAssetDefinition(AssetType.Image, args);

	return queueLateAssetWithPromise({
		type: AssetType.Image,
		path: fullPath,
		names: [name],
		late: true,
		children: []
	});
}

export function loadImageDynamic(qualitySteps: number | string[], ...args: AssetDefinitionArgs) {
	const assetDefinition = parseAssetDefinition(AssetType.Image, args);

	if (typeof qualitySteps === "number") {
		if (qualitySteps < 2 || qualitySteps > 5) {
			throw Error(`expected 2 to 5 dynamic image quality steps, found (${qualitySteps})`);
		}
		qualitySteps = ["_FULL", "_HALF", "_QUARTER", "_EIGHTH", "_SIXTEENTH"].slice(0, qualitySteps);
	}

	const { promises } = loadImageDynamicStep(qualitySteps, assetDefinition);

	return promises;
}

function loadImageDynamicStep(qualitySteps: string[], assetDefinition: AssetDefinition, isRoot = true): {
	asset?: QueuedAsset,
	promises: Promise<Asset>[]
} {

	const stepPostfix = qualitySteps.pop();
	if (stepPostfix === undefined) return {
		promises: []
	};

	const { asset: childAsset, promises } = loadImageDynamicStep(qualitySteps, assetDefinition, false);
	const { name, basePath, extension } = assetDefinition;

	const asset: QueuedAsset = {
		type: AssetType.Image,
		path: basePath + stepPostfix + extension,
		names: [
			name,
			name + stepPostfix
		],
		late: isRoot,
		children: []
	};

	if (isRoot) totalLateAssets++;

	if (childAsset !== undefined) {
		asset.children = [childAsset];
	}

	promises.push(new Promise((resolve, reject) => {
		asset.resolve = resolve;
		asset.reject = reject;
		if (isRoot) {
			loadAssetLate(asset);
		}
	}));

	return {
		asset,
		promises
	};
}

export function getImage(name: string): p5.Image | p5.Graphics {
	enforceInit("getting images");

	const image = assets[name];
	if (image) return image as p5.Image | p5.Graphics;

	return errorImage;
}



export function loadSoundEarly(...args: AssetDefinitionArgs) {
	const { name, fullPath } = parseAssetDefinition(AssetType.Sound, args);
	insureSoundFormatsConfigured();

	return queueEarlyAssetWithPromise(fullPath, name, loadSound);
}

export function loadSoundLate(...args: AssetDefinitionArgs) {
	const { name, fullPath } = parseAssetDefinition(AssetType.Sound, args);
	insureSoundFormatsConfigured();

	return queueLateAssetWithPromise({
		type: AssetType.Sound,
		path: fullPath,
		names: [name],
		late: true,
		children: []
	});
}

export function getSound(name: string): p5.SoundFile {
	enforceInit("getting sounds");
	enforceP5SoundPresent("getting sounds");

	const sound = assets[name] as p5.SoundFile;
	return sound ?? errorSound;
}

function insureSoundFormatsConfigured() {
	if (soundFormatsConfigured) return;

	try {
		const soundExtensions =
			Array.from(assetTypeExtensions[AssetType.Sound])
				.map((extension) => extension.replace(".", ""));
		soundFormats(...soundExtensions);
		soundFormatsConfigured = true;
	} catch (err) {
		console.error(err);
	}
}



export function setUnsafeLevelLoading(value = true) {
	unsafeLevelLoading = value;
}

export function loadLevelEarly(fields: FieldDeclaration, ...args: AssetDefinitionArgs) {
	const { name, fullPath } = parseAssetDefinition(AssetType.Level, args);

	return new Promise((resolve, reject) => {
		loadJSON(fullPath, (data: unknown) => {
			const level = parseLevelJson(fields, data);
			assets[name] = level;
			resolve(level);
		}, reject);
	});
}

export function loadLevelLate(fields: FieldDeclaration, ...args: AssetDefinitionArgs) {
	const { name, fullPath } = parseAssetDefinition(AssetType.Level, args);

	return queueLateAssetWithPromise({
		type: AssetType.Level,
		path: fullPath,
		names: [name],
		late: true,
		children: [],
		fields
	});
}

export function getLevel(name: string): Level | null {
	enforceInit("getting levels");

	return assets[name] as Level ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseLevelJson(fields: FieldDeclaration, json: any): Level {
	if (json.type !== "map") {
		throw Error("Level file was not of type \"map\"");
	}
	if (!unsafeLevelLoading) {
		if (json.version < 1.4) {
			throw Error("Level file version was not 1.4; Run setUnsafeLevelLoading() to ignore this");
		}
		if (json.infinite !== false) {
			throw Error("Level file may be infinite; Run setUnsafeLevelLoading() to ignore this");
		}
		if (json.orientation !== "orthogonal") {
			throw Error("Level file was not orthogonal; Run setUnsafeLevelLoading() to ignore this");
		}
		if (json.renderorder !== "right-down") {
			throw Error("Level file was not rendered right down; Run setUnsafeLevelLoading() to ignore this");
		}
	}

	const [tileLayers, objectLayers] = searchTiledObj(json);
	const level: Level = {
		width: json.width,
		height: json.height,
		objects: [],
		fields: {},
		tilesets: {}
	};

	for (const fieldName in fields) {
		const fieldType = fields[fieldName];
		if (fieldType === "sparse") {
			throw Error("Level file had sparse type in field declaration; This is not supported");
		}

		const layerIndex = tileLayers.findIndex((layer) => layer.name === fieldName);
		if (layerIndex === -1) {
			throw Error(`Level file did not have layer named (${fieldName}) like in the field decleration`);
		}

		const layer = tileLayers[layerIndex];

		if (!unsafeLevelLoading) {
			if (layer.compression !== "" && layer.compression !== undefined) {
				throw Error("Level file has compression; Run setUnsafeLevelLoading() to ignore this");
			}
			if (layer.encoding !== "base64" && layer.encoding !== undefined) {
				throw Error(`Level file has unknown encoding (${layer.encoding}); Run setUnsafeLevelLoading() to ignore this`);
			}
		}
		if (layer.encoding === "base64") {
			level.fields[fieldName] = {
				type: fieldType,
				data: layer.data,
				encoding: "uint32"
			};
		} else {
			level.fields[fieldName] = {
				type: fieldType,
				data: layer.data
			};
		}
	}

	if (objectLayers.length > 0) {
		if (objectLayers.length > 1 && !unsafeLevelLoading) {
			throw Error("Level file had multiple object layers; Run setUnsafeLevelLoading() to combine them");
		}
		for (const layer of objectLayers) {
			for (const object of layer.objects) {
				level.objects.push(object);
			}
		}
	}

	for (const tileset of json.tilesets) {
		const tilesetName = tileset.name as string;
		level.tilesets[tilesetName] = {
			firstId: tileset.firstgid,
			tiles: {}
		};
		if (!Array.isArray(tileset.tiles)) continue;

		for (const tile of tileset.tiles) {
			const tileId = tile.id as number;
			level.tilesets[tilesetName].tiles[tileId] = {};
			if (!Array.isArray(tile.properties)) continue;

			for (const property of tile.properties) {
				level.tilesets[tilesetName].tiles[tileId][property.name] = property.value;
			}
		}
	}

	return level;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function searchTiledObj(obj: any): [any[], any[]] {
	const tileLayers = [], objectLayers = [];

	if (obj.type === "map" || obj.type === "group") {
		for (const subObj of obj.layers) {
			const [newTileLayers, newObjectLayers] = searchTiledObj(subObj);
			tileLayers.push(...newTileLayers);
			objectLayers.push(...newObjectLayers);
		}
	} else if (obj.type === "tilelayer") {
		tileLayers.push(obj);
	} else if (obj.type === "objectgroup") {
		objectLayers.push(obj);
	} else if (!unsafeLevelLoading) {
		throw Error(`Level file has unknown layer type (${obj.type}); Run setUnsafeLevelLoading() to ignore this`);
	}

	return [tileLayers, objectLayers];
}



function queueEarlyAssetWithPromise(path: string, name: string, loader: P5LoaderFuction) {
	return new Promise((resolve, reject) => {
		loader(path, (data) => {
			assets[name] = data;
			resolve(data);
		}, reject);
	});
}

function queueLateAssetWithPromise(assetEntry: QueuedAsset): Promise<Asset> {
	totalLateAssets++;
	return new Promise((resolve, reject) => {
		assetEntry.resolve = resolve;
		assetEntry.reject = reject;
		loadAssetLate(assetEntry);
	});
}

function parseAssetDefinition(type: AssetType, args: AssetDefinitionArgs): AssetDefinition {
	const [fullPath, _name] = args;
	let name = _name;

	if (fullPath === undefined) throw Error("Can't load asset without an path");
	if (name === undefined) name = fullPath;

	const pathParts = fullPath.split(".");

	let extension = "";
	if (pathParts.length > 1) {
		extension = "." + pathParts.pop();
	}
	const basePath = pathParts.join(".");

	const validExtensions = assetTypeExtensions[type];
	if (!validExtensions.has(extension)) {
		throw Error(`Can't load (${extension}) file as a ${type} file, try ${Array.from(validExtensions).join(" ")}`);
	}

	return { name, basePath, fullPath, extension };
}