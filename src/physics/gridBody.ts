import { getSpaceScale, InternalMatterBody, createRectBodyFast } from "./physics";
import { MaterialBodyAbstract } from "./materialBodyAbstract";



export class GridBody extends MaterialBodyAbstract {
	private readonly x: number;
	private readonly y: number;
	private readonly width: number;
	private readonly height: number;
	private readonly gridScale: number;
	private readonly options: Matter.IBodyDefinition;

	constructor(width: number, height: number, grid: ArrayLike<any>,
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

	buildBody(grid: ArrayLike<any>, minX = 0, minY = 0, maxX = Infinity, maxY = Infinity) {
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

	private buildParts(grid: ArrayLike<any>, minX: number, minY: number, maxX: number, maxY: number) {
		const
			startX = Math.max(0, minX), startY = Math.max(0, minY), endX = Math.min(this.width, maxX), endY = Math.min(this.height, maxY);

		const stripMap: Map<number, { width: number; height: number; }> = new Map();

		// build grid into strips
		for (let y = startY; y < endY; y++) {
			let runStart: number | undefined = undefined;
			for (let x = startX; x < endX; x++) {
				if (!!grid[x + y * this.width]) {
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

		// combine strips width matching ends on adjacent rows 
		for (const [key, strip] of stripMap.entries()) {
			let combineStripKey = key;

			while (true) {
				combineStripKey += this.width;

				const combineStrip = stripMap.get(combineStripKey);
				if (combineStrip === undefined || combineStrip.width !== strip.width)
					break;

				strip.height += combineStrip.height;
				stripMap.delete(combineStripKey);
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
