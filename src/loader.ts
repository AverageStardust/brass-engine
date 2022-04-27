import p5 from "p5";
import { assertCompileTime, createFastGraphics } from "./common";
import { FieldDeclaration, TilemapWorld } from "./tilemap";



type Asset = p5.Image | p5.Graphics | p5.SoundFile | TilemapWorld;
type AssetDefinitionArgs = [string] | [string, string] | [string, string, string];
type AssetDefinition = { title: string, path: string, extension: string };
type P5LoaderFuction = (path: string, successCallback: (data: Asset) => void, failureCallback: (event: Event) => any) => Asset;

interface QueuedAsset {
    type: "image" | "sound" | "world";
    path: string;
    title: string;
    late: boolean;
    children: QueuedAsset[];

    fields?: FieldDeclaration;
    resolve?: (asset: Asset) => void;
    reject?: (error: Error) => void;
}



const assets: { [key: string]: Asset } = {};
const loadQueue: QueuedAsset[] = [];
let useSound = false;
let inited = false;

let totalLateAssets = 0;
let loadedLateAssets = 0;

let errorImage: p5.Graphics;
const imageQualityNames = ["_FULL", "_HALF", "_QUARTER", "_EIGHTH"];

let errorSound: p5.SoundFile;
const allowedSoundFormats = ["mp3", "wav", "ogg"];
let soundFormatsSet = false;

let unsafeWorld = false;



export function init(_useSound: boolean) {
    useSound = _useSound;

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

    loadQueuedAssets();

    inited = true;
}

function enforceInit(action: string) {
    if (inited) return;
    throw Error(`Brass loader must be initialized before ${action}; Run Brass.init()`);
}

function enforceP5SoundPresent(action: string) {
    if (useSound === true) return;
    throw Error(`Sound must enabled in Brass.init() before ${action}`);
}

function loadQueuedAssets() {
    const assetEntry = loadQueue.shift();

    // check when late loading is done
    if (loaded() && totalLateAssets > 0) {
        totalLateAssets = 0;
        loadedLateAssets = 0;

        if ("postload" in globalThis) {
            // @ts-ignore because this is outside of the Brass engine and its type-checking
            globalThis.postload();
        }
    }

    if (assetEntry === undefined) return;

    switch (assetEntry.type) {
        default:
            throw Error(`Unknown asset type (${assetEntry.type})`);

        case "image":
            loadImage(assetEntry.path,
                handleAsset.bind(globalThis, assetEntry),
                handleAssetFail.bind(globalThis, assetEntry));
            break;

        case "sound":
            loadSound(assetEntry.path,
                handleAsset.bind(globalThis, assetEntry),
                handleAssetFail.bind(globalThis, assetEntry));
            break;


        case "world":
            loadJSON(assetEntry.path,
                handleAsset.bind(globalThis, assetEntry),
                handleAssetFail.bind(globalThis, assetEntry));
            break;
    }
}

function handleAsset(assetEntry: QueuedAsset, data: any) {
    if (assetEntry.late) {
        loadedLateAssets++;
    }

    if (assetEntry.type === "world") {
        assertCompileTime(assetEntry.fields !== undefined);
        data = parseWorldJson(assetEntry.fields, data);
    }

    assets[assetEntry.title] = data as Asset;

    if (assetEntry.resolve) {
        assetEntry.resolve(data as Asset);
    }

    if ("children" in assetEntry) {
        loadQueue.push(...assetEntry.children);
    }

    loadQueuedAssets();
}

function handleAssetFail(assetEntry: QueuedAsset) {
    if (assetEntry.late) {
        loadedLateAssets++;
    }

    const error = Error(`Failed to load asset (${assetEntry.title}) at path (${assetEntry.path})`);

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
    const { title, path, extension } = parseAssetDefinition("png", args);

    return queueEarlyAssetWithPromise(path + extension, title, loadImage);
}

export function loadImageLate(...args: AssetDefinitionArgs) {
    const { title, path, extension } = parseAssetDefinition("png", args);

    return queueLastAssetWithPromise({
        type: "image",
        path: path + extension,
        title: title,
        late: true,
        children: []
    });
}

export function loadImageDynamic(qualitySteps: number, ...args: AssetDefinitionArgs) {
    const assetDefinition = parseAssetDefinition("png", args);

    if (qualitySteps < 1 || qualitySteps > 4) {
        throw Error(`expected 1 to 4 dynamic image quality steps, found (${qualitySteps})`);
    }

    const resolves: ((asset: Asset) => void)[] = [];
    const rejects: ((error: Error) => void)[] = [];
    const promiseArray: Promise<Asset>[] = Array(qualitySteps).fill(null).map((_, index) => {
        return new Promise((resolve, reject) => {
            resolves.push(resolve);
            rejects.push(reject);
        });
    });

    loadQueue.push(
        buildDynamicImageAssetEntry(qualitySteps, assetDefinition, true, resolves, rejects));
    totalLateAssets++;

    return promiseArray;
}

export function getImage(title: string): p5.Image | p5.Graphics {
    enforceInit("getting images");

    const image = assets[title];
    if (image) return image as p5.Image | p5.Graphics;

    for (const quality of imageQualityNames) {
        const qualifiedImage = assets[title + quality];
        if (qualifiedImage) return qualifiedImage as p5.Image | p5.Graphics;
    }

    return errorImage;
}

function buildDynamicImageAssetEntry(
    qualityStep: number, assetDefinition: AssetDefinition, isRoot: boolean,
    resolves: ((asset: Asset) => void)[], rejects: ((error: Error) => void)[]): QueuedAsset {

    qualityStep--;

    const children: QueuedAsset[] = [];
    if (qualityStep > 0) {
        children[0] =
            buildDynamicImageAssetEntry(qualityStep, assetDefinition, false, resolves, rejects);
    }

    const { path, title, extension } = assetDefinition;
    return {
        type: "image",
        path: path + imageQualityNames[qualityStep] + extension,
        title: title + imageQualityNames[qualityStep],
        late: isRoot,
        children,
        resolve: resolves.pop(),
        reject: rejects.pop()
    };
}



export function loadSoundEarly(...args: AssetDefinitionArgs) {
    const { title, path, extension } = parseAssetDefinition("mp3", args);
    insureSoundFormatsSet();

    return queueEarlyAssetWithPromise(path + extension, title, loadSound);
}

export function loadSoundLate(...args: AssetDefinitionArgs) {
    const { title, path, extension } = parseAssetDefinition("mp3", args);
    insureSoundFormatsSet();

    return queueLastAssetWithPromise({
        type: "sound",
        path: path + extension,
        title: title,
        late: true,
        children: []
    });
}

export function getSound(title: string): p5.SoundFile {
    enforceInit("getting sounds");
    enforceP5SoundPresent("getting sounds");

    const sound = assets[title] as p5.SoundFile;
    return sound ?? errorSound;
}

function insureSoundFormatsSet() {
    if (soundFormatsSet) return;

    try {
        soundFormats(...allowedSoundFormats);
        soundFormatsSet = true;
    } catch (err) { }
}



export function enableUnsafeWorldLoading() {
    unsafeWorld = true;
}

export function loadWorldEarly(fields: FieldDeclaration, ...args: AssetDefinitionArgs) {
    const { title, path, extension } = parseAssetDefinition("json", args);

    return new Promise((resolve, reject) => {
        loadJSON(path + extension, (data: any) => {
            const world = parseWorldJson(fields, data);
            assets[title] = world;
            resolve(world);
        }, reject);
    });
}

export function loadWorldLate(fields: FieldDeclaration, ...args: AssetDefinitionArgs) {
    const { title, path, extension } = parseAssetDefinition("json", args);

    return queueLastAssetWithPromise({
        type: "world",
        path: path + extension,
        title: title,
        late: true,
        children: [],
        fields
    });
}

export function getWorld(title: string): TilemapWorld | null {
    enforceInit("getting worlds");

    const world = assets[title] as TilemapWorld;
    return world ?? null;
}

function parseWorldJson(fields: FieldDeclaration, json: any): TilemapWorld {
    if (json.type !== "map") {
        throw Error("World file was not of type \"map\"");
    }
    if (!unsafeWorld) {
        if (json.version < 1.4) {
            throw Error("World file version was not 1.4; Run enableUnsafeWorldLoading() to ignore this");
        }
        if (json.infinite !== false) {
            throw Error("World file may be infinite; Run enableUnsafeWorldLoading() to ignore this");
        }
        if (json.orientation !== "orthogonal") {
            throw Error("World file was not orthogonal; Run enableUnsafeWorldLoading() to ignore this");
        }
        if (json.renderorder !== "right-down") {
            throw Error("World file was not rendered right down; Run enableUnsafeWorldLoading() to ignore this");
        }
    }

    const [tileLayers, objectLayers] = searchTiledObj(json);
    const world: TilemapWorld = {
        width: json.width,
        height: json.height,
        objects: [],
        fields: {},
        tilesets: {}
    };

    for (const fieldName in fields) {
        const fieldType = fields[fieldName];
        if (fieldType === "sparse") {
            throw Error("World file had sparse type in field decleration; This is not supported");
        }

        const layerIndex = tileLayers.findIndex((layer) => layer.name === fieldName);
        if (layerIndex === -1) {
            throw Error(`World file did not have layer named (${fieldName}) like in the field decleration`);
        }

        const layer = tileLayers[layerIndex];

        if (!unsafeWorld) {
            if (layer.compression !== "" && layer.compression !== undefined) {
                throw Error("World file has compression; Run enableUnsafeWorldLoading() to ignore this");
            }
            if (layer.encoding !== "base64" && layer.encoding !== undefined) {
                throw Error(`World file has unknown encoding (${layer.encoding}); Run enableUnsafeWorldLoading() to ignore this`);
            }
        }
        if (layer.encoding === "base64") {
            world.fields[fieldName] = {
                type: fieldType,
                data: layer.data,
                encoding: "uint32"
            }
        } else {
            world.fields[fieldName] = {
                type: fieldType,
                data: layer.data
            }
        }
    }

    if (objectLayers.length > 0) {
        if (objectLayers.length > 1 && !unsafeWorld) {
            throw Error("World file had multible object layers; Run enableUnsafeWorldLoading() to combine them");
        }
        for (const layer of objectLayers) {
            for (const object of layer) {
                world.objects.push(object);
            }
        }
    }

    for (const tileset of json.tilesets) {
        const tilesetName = tileset.name as string;
        world.tilesets[tilesetName] = {
            firstId: tileset.firstgid,
            tiles: {}
        };
        if (!Array.isArray(tileset.tiles)) continue;

        for (const tile of tileset.tiles) {
            const tileId = tile.id as number;
            world.tilesets[tilesetName].tiles[tileId] = {};
            if (!Array.isArray(tile.properties)) continue;

            for (const property of tile.properties) {
                world.tilesets[tilesetName].tiles[tileId][property.name] = property.value;
            }
        }
    }

    return world;
}

function searchTiledObj(obj: any): [any[], any[]] {
    const tileLayers = [], objectLayers = [];

    if (obj.type === "map" || obj.type === "group") {
        for (const subObj of obj.layers) {
            const [newTileLayers, newObjectLayers] = searchTiledObj(subObj);
            tileLayers.push(...newTileLayers);
            tileLayers.push(...newObjectLayers);
        }
    } else if (obj.type === "tilelayer") {
        tileLayers.push(obj);
    } else if (obj.type === "objectgroup") {
        objectLayers.push(obj);
    } else if (!unsafeWorld) {
        throw Error(`World file has unknown layer type (${obj.type}); Run enableUnsafeWorldLoading() to ignore this`);
    }

    return [tileLayers, objectLayers];
}



function queueEarlyAssetWithPromise(path: string, title: string, loader: P5LoaderFuction) {
    return new Promise((resolve, reject) => {
        loader(path, (data) => {
            assets[title] = data;
            resolve(data);
        }, reject);
    });
}

function queueLastAssetWithPromise(assetEntry: QueuedAsset) {
    totalLateAssets++;
    return new Promise((resolve, reject) => {
        assetEntry.resolve = resolve;
        assetEntry.reject = reject;
        loadQueue.push(assetEntry);
    });
}

function parseAssetDefinition(defaultExtension: string, args: AssetDefinitionArgs): AssetDefinition {
    let [title, path, extension] = args;

    if (title === undefined) throw Error("Can't load asset without an asset title");
    if (path === undefined) path = title;
    if (extension === undefined) extension = defaultExtension;

    if (extension !== "") extension = "." + extension;

    return { title, path, extension };
}