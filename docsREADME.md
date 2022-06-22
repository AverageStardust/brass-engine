# Getting Started
Load your scripts inside the HTML head tag. p5.js *must* be loaded before Brass.
If your game uses matter.js or REGL you can also load them before Brass.
```html
<!--dependencies of Brass-->
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.js"></script>
<!--Brass-->
<script defer src="brass.js"></script>
<!--your code-->
<script defer src="main.js"></script>
```
___
First of all lets use {@link init | Brass.init()} to start Brass in setup.
```js
function setup() {
	Brass.init({/* settings here */});
}
```
___
We are going to make a chess board, for this we will use a {@link P5Tilemap}.
Pass in drawTile, Brass will use this to draw each space on the board.
In drawTile we use ```g.fill()``` and not just ```fill()``` so Brass can speed things up in the background.
```js
tilemap = new Brass.P5Tilemap(8, 8, {
	// make the checkerboard pattern at x and y on g
	drawTile: function (_, x, y, g) {
		if (x % 2 === y % 2) {
			g.fill("black");
		} else {
			g.fill("white");
		}
		g.noStroke();
		g.rect(x, y, 1, 1);
	}
});
```
___
Next lets draw the chess board.
```js
function draw() {
	translate(mouseX, mouseY);
	// zoom in to see the tilemap, by default each tile is 1 pixel wide
	scale(64);
	tilemap.draw();
}
```
___
Now we can put it all together. 
```js
let tilemap;

function setup() {
	Brass.init();

	tilemap = new Brass.P5Tilemap(8, 8, {
		drawTile: function (_, x, y, g) {
			if (x % 2 === y % 2) {
				g.fill("black");
			} else {
				g.fill("white");
			}
			noStroke();
			g.rect(x, y, 1, 1);
		}
	});
}

function draw() {
	translate(mouseX, mouseY);
	// zoom in to see the tilemap, by default each tile is 1 pixel wide
	scale(64);
	tilemap.draw();
}
```
___
We can also spice it up a bit, lets make a massive green and red chess board.
This board has 4096 spaces, normally this would slow down p5.js.
With Brass we can just change a few values in the {@link P5TilemapOptions | options}.
```js
let tilemap;

function setup() {
	Brass.init();

	tilemap = new Brass.P5Tilemap(64, 64, {
		// save chunks of the board onto p5.Graphics objects to decrease draw calls
		drawCacheMode: "always"
		drawTile: function (_, x, y, g) {
			if (x % 2 === y % 2) {
				g.fill("green");
			} else {
				g.fill("red");
			}
			g.noStroke();
			g.rect(x, y, 1, 1);
		}
	});
}

function draw() {
	translate(mouseX, mouseY);
	// zoom in to see the tilemap, by default each tile is 1 pixel wide
	scale(12);
	tilemap.draw();
}
```