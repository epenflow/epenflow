interface BaseButton {
	x: number;
	y: number;
	radians: number;
	radius: number;
	stroke: number;
}
interface DrawButton extends BaseButton {
	colors: {
		background: string;
		border: string;
	};
}

interface Button extends BaseButton {
	colors: {
		background: string;
		border: string;
		hover: string;
	};
	onClick: () => void;
}

export class WindowModule {
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private fontSize: number;
	private initialWidth: number;
	private initialHeight: number;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
		this.fontSize = 16;
		this.initialWidth = 800;
		this.initialHeight = 600;
		this.setup();
	}

	private setup() {
		const dpr = window.devicePixelRatio || 1;
		this.canvas.width = this.initialWidth * dpr;
		this.canvas.height = this.initialHeight * dpr;

		this.context.scale(dpr, dpr);
		this.canvas.style.width = `${this.initialWidth}px`;
		this.canvas.style.height = `${this.initialHeight}px`;
		this.header();
	}

	private header() {
		this.context.fillStyle = "#cccccc";
		this.context.fillRect(0, 0, this.canvas.width, 30);
		const radians = 2;
		const radius = 7;
		const posX = 15;
		const buttonColors = {
			close: {
				background: `#fd5754`,
				border: `#df494a`,
				hover: `#b42e2e`,
			},
			minimize: {
				background: `#febb40`,
				border: `#e1a034`,
				hover: `#b4791a`,
			},
			maximize: {
				background: `#34c848`,
				border: `#30ab3b`,
				hover: `#1b8c24`,
			},
		};
		this.button({
			colors: buttonColors.close,
			onClick: () => console.log("console.log"),
			radians,
			radius,
			x: posX,
			y: 15,
			stroke: 2,
		});
		this.button({
			colors: buttonColors.minimize,
			onClick: () => console.log("console.log"),
			radians,
			radius,
			x: posX * 2 + 5,
			y: 15,
			stroke: 2,
		});
		this.button({
			colors: buttonColors.maximize,
			onClick: () => console.log("console.log"),
			radians,
			radius,
			x: posX * 3 + 10,
			y: 15,
			stroke: 2,
		});

		this.context.fillStyle = "#000000";
		this.context.font = "16px Arial";
		this.context.fillText("Terminal", 70, 20);
	}

	private button({ colors, onClick, x, y, radians, radius, stroke }: Button) {
		this.drawButton({
			x,
			y,
			colors: {
				background: colors.background,
				border: colors.border,
			},
			radians,
			radius,
			stroke,
		});

		function isHovered(mouseX: number, mouseY: number) {
			return Math.sqrt((mouseX - x) ** 2 - (mouseY - y) ** 2) < radius;
		}

		this.canvas.addEventListener("mousemove", (event) => {
			const react = this.canvas.getBoundingClientRect();
			const mouseX = event.x - react.left;
			const mouseY = event.y - react.top;

			if (isHovered(mouseX, mouseY)) {
				this.drawButton({
					x,
					y,
					colors: {
						background: colors.background,
						border: colors.hover,
					},
					radians,
					radius,
					stroke,
				});
			} else {
				this.drawButton({
					x,
					y,
					colors: {
						background: colors.background,
						border: colors.border,
					},
					radians,
					radius,
					stroke,
				});
			}
		});

		this.canvas.addEventListener("click", (event) => {
			const react = this.canvas.getBoundingClientRect();
			const mouseX = event.x - react.left;
			const mouseY = event.y - react.top;

			if (isHovered(mouseX, mouseY)) {
				onClick();
			}
		});
	}

	private close() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private drawButton({ x, y, colors, radians, radius, stroke }: DrawButton) {
		this.context.fillStyle = colors.background;
		this.context.beginPath();
		this.context.arc(x, y, radius, 0, Math.PI * radians);
		this.context.fill();
		this.context.strokeStyle = colors.border;
		this.context.lineWidth = stroke;
		this.context.stroke();
	}
}
