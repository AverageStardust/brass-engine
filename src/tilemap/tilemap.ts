import { TilemapAbstract } from "./tilemapAbstract";



export const tilemaps: TilemapAbstract[] = [];



export function update() {
	for (const tilemap of tilemaps) {
		tilemap.maintain();
	}
}

export function registerTilemap(tilemap: TilemapAbstract) {
	tilemaps.push(tilemap);
}