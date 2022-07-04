import { Vertex2 } from "../vector/vector2";
import { MaterialBodyAbstract } from "./materialBodyAbstract";
import { getSpaceScale } from "./physics";


export class PolyBody extends MaterialBodyAbstract {
	constructor(x: number, y: number, verts: Vertex2[][], options?: Matter.IBodyDefinition) {
		const spaceScale = getSpaceScale();

		const matterVerts = verts.map(
			(subVerts) => subVerts.map(
				(vert) => Matter.Vector.create(vert.x * spaceScale, vert.y * spaceScale)));

		const body = Matter.Bodies.fromVertices(x * spaceScale, y * spaceScale, matterVerts, options);
		super(body);
	}
}
