import MousePosition from "./MousePosition";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const mousePosition = new MousePosition(canvas);

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
});

const context = canvas.getContext("2d");
if (context === null)
    throw new Error("Failure obtaining context");

class GameState {

}

class Grid {

}

class CandiesFalling extends GameState {

}

class CandiesIdle extends GameState {

}

requestAnimationFrame(function animate() {
	requestAnimationFrame(animate);
	
	context.clearRect(0, 0, width, height);
	
	const centerX = width / 2;
	const centerY = height / 2;
	
	const cellWidth = 64;
	const cellHeight = 64;
	const rowCount = 3;
	const columnCount = 10;
	
	const shapeSize = 48;
	
	const drawCircle = (centerX: number, centerY: number) => {
		context.lineWidth = 1;
		context.strokeStyle = "black";
		context.beginPath();
		context.arc(centerX, centerY, shapeSize / 2, 0, 2 * Math.PI, false);
		context.stroke();
	};
	
	const drawSquare = (centerX: number, centerY: number) => {
		context.lineWidth = 1;
		context.strokeStyle = "black";
		const x = centerX - shapeSize / 2;
		const y = centerY - shapeSize / 2;
		context.beginPath();
		context.strokeRect(x, y, shapeSize, shapeSize);
		context.stroke();
	};
	
	const drawDiamond = (centerX: number, centerY: number) => {
		context.lineWidth = 1;
		context.strokeStyle = "black";
		context.beginPath();
		context.moveTo(centerX, centerY - shapeSize / 2);
		context.lineTo(centerX + shapeSize / 2, centerY);
		context.lineTo(centerX, centerY + shapeSize / 2);
		context.lineTo(centerX - shapeSize / 2, centerY);
		context.lineTo(centerX, centerY - shapeSize / 2);
		context.stroke();
	};
	
	const drawColorBomb = (centerX: number, centerY: number) => {
		context.lineWidth = 1;
		context.strokeStyle = "black";
		context.translate(centerX, centerY);
		context.beginPath();
		
		const rayCount = 10;
		for (let i = 0; i < rayCount; i++) {
			const radius = shapeSize / 2;
		
			context.moveTo(0, 2 * radius / 3);
			context.lineTo(0, radius);
			context.moveTo(0, 0);
			context.rotate(2 * Math.PI / rayCount);
		}

		context.stroke();
		context.translate(-centerX, -centerY);
	};
	
	const drawVerticalStripes = (centerX: number, centerY: number) => {
		context.lineWidth = 3;
		context.strokeStyle = "black";
		context.translate(centerX, centerY);
		context.beginPath();
		
		const radius = shapeSize / 2 - 10;
		
		context.moveTo(0, -radius);
		context.lineTo(0, radius);
		context.moveTo(10, -radius);
		context.lineTo(10, radius);
		context.moveTo(-10, -radius);
		context.lineTo(-10, radius);
		
		context.stroke();
		context.translate(-centerX, -centerY);
	};
	
	const drawHorizontalStripes = (centerX: number, centerY: number) => {
		context.lineWidth = 3;
		context.strokeStyle = "black";
		context.translate(centerX, centerY);
		context.beginPath();
		
		const radius = shapeSize / 2 - 10;
		
		context.moveTo(-radius, 0);
		context.lineTo(radius, 0);
		context.moveTo(-radius, 10);
		context.lineTo(radius, 10);
		context.moveTo(-radius, -10);
		context.lineTo(radius, -10);
		
		context.stroke();
		context.translate(-centerX, -centerY);
	};
	
	for (let row = 0; row < rowCount; row++)
		for (let column = 0; column < columnCount; column++) {
			context.lineWidth = 1;
			context.strokeStyle = "black";
			const x = centerX - ((cellWidth * columnCount) / 2) + (column * cellWidth);
			const y = centerY - ((cellWidth * rowCount) / 2) + (row * cellWidth);
			context.strokeRect(x, y, cellWidth, cellHeight);
			
			const remainder = (row + column) % 4;
			if (remainder === 0) {
				drawCircle(x + cellWidth / 2, y + cellWidth / 2);
				drawVerticalStripes(x + cellWidth / 2, y + cellWidth / 2);
			}
			else if (remainder === 1) {
				drawSquare(x + cellWidth / 2, y + cellWidth / 2);
				drawHorizontalStripes(x + cellWidth / 2, y + cellWidth / 2);
			}
			else if (remainder === 2)
				drawDiamond(x + cellWidth / 2, y + cellWidth / 2);
			else if (remainder === 3)
				drawColorBomb(x + cellWidth / 2, y + cellWidth / 2);
		}
});

export {};
