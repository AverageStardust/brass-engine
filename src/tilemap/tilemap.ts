import { getTilemaps } from "./tilemapAbstract";

export function update() {
	for (const tilemap of getTilemaps()) {
		tilemap.maintain();
	}
}