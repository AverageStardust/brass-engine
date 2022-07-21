/**
 * Used to add lighting effects to games.
 * Only simple p5.js effects as of now.
 * @module
 */

import { ViewpointAbstract } from "../camera/viewpointAbstract";
import { LayerAbstract } from "../layers/LayerAbstract";




export interface LighterAbstractOptions {
	resolution?: number;
}




	// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class LighterAbstract {
	protected resolution: number;

	constructor(options: LighterAbstractOptions) {
		this.resolution = options.resolution ?? 0.5;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	abstract begin(v: ViewpointAbstract, d: LayerAbstract<any>): this;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	abstract end(d: LayerAbstract<any>): this;
}



