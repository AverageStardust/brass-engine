import { InternalMatterBody, MaterialBodyAbstract } from "./materialBodyAbstract";
import { getSpaceScale } from "./bodyAbstract";



export class GridBody extends MaterialBodyAbstract {
	private readonly x: number;
	private readonly y: number;
	private readonly width: number;
	private readonly height: number;
	private readonly gridScale: number;
	private readonly options: Matter.IBodyDefinition;

	constructor(width: number, height: number, grid: ArrayLike<unknown>,
		options: Matter.IBodyDefinition = {}, gridScale = 1) {

		super(Matter.Body.create({}));
		options.isStatic ??= true;

		let bodyOffset = { x: 0, y: 0 };
		if (options.position) {
			bodyOffset = options.position;
			options.position = { x: 0, y: 0 };
		}

		this.x = bodyOffset.x;
		this.y = bodyOffset.y;
		this.width = width;
		this.height = height;
		this.gridScale = gridScale;
		this.options = options;

		this.buildBody(grid);
	}

	buildBody(grid: ArrayLike<unknown>, minX = 0, minY = 0, maxX = Infinity, maxY = Infinity) {
		const spaceScale = getSpaceScale();
		if (this.static) {
			this.buildParts(grid, minX, minY, maxX, maxY);

			Matter.Body.translate(this.body, {
				x: (this.body.bounds.min.x + (this.x - minX * this.gridScale) * spaceScale),
				y: (this.body.bounds.min.y + (this.y - minY * this.gridScale) * spaceScale)
			});
		} else {
			let angle = this.options.angle ?? 0;
			if (this.body !== undefined) {
				angle = this.body.angle;
				Matter.Body.setAngle(this.body, 0);
			}
			this.buildParts(grid, minX, minY, maxX, maxY);
			Matter.Body.setAngle(this.body, angle);
			Matter.Body.setPosition(this.body, { x: this.x * spaceScale, y: this.y * spaceScale });
		}
	}

	get static() {
		if (this.body === undefined) {
			return this.options.isStatic as boolean;
		}
		return this.body.isStatic;
	}

	private buildParts(grid: ArrayLike<unknown>, minX: number, minY: number, maxX: number, maxY: number) {
		const
			startX = Math.max(0, minX), startY = Math.max(0, minY), endX = Math.min(this.width, maxX), endY = Math.min(this.height, maxY);

		const stripMap: Map<number, { width: number; height: number; }> = new Map();

		// build grid into strips
		for (let y = startY; y < endY; y++) {
			let runStart: number | undefined = undefined;
			for (let x = startX; x < endX; x++) {
				if (grid[x + y * this.width]) {
					if (runStart === undefined) {
						runStart = x;
					}
				} else {
					if (runStart !== undefined) {
						stripMap.set(runStart + y * this.width,
							{ width: x - runStart, height: 1 });
						runStart = undefined;
					}
				}
			}
			if (runStart !== undefined) {
				stripMap.set(runStart + y * this.width,
					{ width: endX - runStart, height: 1 });
			}
		}

		const row = this.width;
		const length = this.width * this.height;
		// combine strips with matching width on rows below
		for (const [key, strip] of stripMap.entries()) {
			for (let otherKey = key + row;
				otherKey < length;
				otherKey += row) {
				const otherStrip = stripMap.get(otherKey);
				if (otherStrip === undefined ||
					otherStrip.width !== strip.width) break;

				strip.height += otherStrip.height;
				stripMap.delete(otherKey);
			}
		}

		const parts: InternalMatterBody[] = [];

		const scaleProduct = this.gridScale * getSpaceScale();
		for (const [key, strip] of stripMap.entries()) {
			const
				x = key % this.width, y = Math.floor(key / this.width);

			const part = createRectBodyFast(x * scaleProduct, y * scaleProduct,
				strip.width * scaleProduct, strip.height * scaleProduct) as InternalMatterBody;
			part.__brassBody__ = this;
			parts.push(part);
		}

		const cornerPart = createRectBodyFast(minX * scaleProduct, minY * scaleProduct, 0.01, 0.01) as InternalMatterBody;
		cornerPart.__brassBody__ = this;
		parts.push(cornerPart);

		this.options.parts = parts;
		const body = Matter.Body.create(this.options);
		this.setBody(body);
	}
}

export function createRectBodyFast(x: number, y: number, width: number, height: number) {
	const body = {
		id: Matter.Common.nextId(),
		type: "body",
		label: "rectBody",
		plugin: {},
		parts: [],
		angle: 0,
		vertices: [
			{ x: -width * 0.5, y: -height * 0.5, index: 0, isInternal: false },
			{ x: width * 0.5, y: -height * 0.5, index: 1, isInternal: false },
			{ x: width * 0.5, y: height * 0.5, index: 2, isInternal: false },
			{ x: -width * 0.5, y: height * 0.5, index: 3, isInternal: false }
		],
		position: { x: x + width * 0.5, y: y + height * 0.5 },
		force: { x: 0, y: 0 },
		torque: 0,
		positionImpulse: { x: 0, y: 0 },
		constraintImpulse: { x: 0, y: 0, angle: 0 },
		totalContacts: 0,
		speed: 0,
		angularSpeed: 0,
		velocity: { x: 0, y: 0 },
		angularVelocity: 0,
		isSensor: false,
		isStatic: false,
		isSleeping: false,
		motion: 0,
		sleepThreshold: 60,
		density: 0.001,
		restitution: 0,
		friction: 0.1,
		frictionStatic: 0.5,
		frictionAir: 0.01,
		collisionFilter: {
			category: 0x0001,
			mask: 0xFFFFFFFF,
			group: 0
		},
		slop: 0.05,
		timeScale: 1,
		circleRadius: 0,
		positionPrev: { x: x + width * 0.5, y: y + height * 0.5 },
		anglePrev: 0,
		area: 0,
		mass: 0,
		inertia: 0,
		_original: null
	} as unknown as Matter.Body;

	body.parts = [body];
	body.parent = body;

	Matter.Body.set(body, {
		bounds: Matter.Bounds.create(body.vertices),
		vertices: body.vertices,
	});

	Matter.Bounds.update(body.bounds, body.vertices, body.velocity);

	return body;
}