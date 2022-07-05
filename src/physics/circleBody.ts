import { getSpaceScale } from "./bodyAbstract";
import { MaterialBodyAbstract } from "./materialBodyAbstract";


export class CircleBody extends MaterialBodyAbstract {
	constructor(x: number, y: number, radius: number, options?: Matter.IBodyDefinition) {
		const spaceScale = getSpaceScale();
		const body = Matter.Bodies.circle(x * spaceScale, y * spaceScale, radius * spaceScale, options);
		super(body);
	}
}
