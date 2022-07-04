import { MaterialBodyAbstract } from "./materialBodyAbstract";
import { getSpaceScale } from "./physics";


export class RectBody extends MaterialBodyAbstract {
	constructor(x: number, y: number, width: number, height: number, options?: Matter.IBodyDefinition) {
		const spaceScale = getSpaceScale();
		const body = Matter.Bodies.rectangle(x * spaceScale, y * spaceScale, width * spaceScale, height * spaceScale, options);
		super(body);
	}
}
