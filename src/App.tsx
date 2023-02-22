import { useState, useEffect, useRef } from "react";

const App = () => {
	const offScreenCanvasRef = useRef<HTMLCanvasElement>(
		document.createElement("canvas")
	);

	const canvas = useRef<HTMLCanvasElement | null>(null);
	const [loaded, setLoaded] = useState<boolean>(false);
	const [pixelsize, setPixelsize] = useState<number>(40);

	useEffect(() => {
		const image = new Image();
		image.onload = () => {
			const offScreenCanvas = offScreenCanvasRef.current;
			offScreenCanvas.width = image.width;
			offScreenCanvas.height = image.height;
			const offScreenContext = offScreenCanvas.getContext("2d");
			if (!offScreenContext) throw "Unable to get offscreen canvas";
			offScreenContext.drawImage(image, 0, 0);
			console.log("loaded");
			setLoaded(true);
		};
		image.src = "/images/avatar.png";
	}, []);

	useEffect(() => {
		if (loaded) {
			pixelate2();
		}
	}, [loaded]);

	const pixelate2 = () => {
		if (canvas.current === null) return;
		const offScreenCanvas = offScreenCanvasRef.current;
		const offScreenContext = offScreenCanvas.getContext("2d");
		if (!offScreenContext) throw "Unable to get offscreen canvas";
		const offScreenImageData = offScreenContext.getImageData(
			0,
			0,
			offScreenCanvas.width,
			offScreenCanvas.height
		);
		const onScreenCanvas = canvas.current;
		const onScreenContext = onScreenCanvas.getContext("2d");
		if (!onScreenContext) throw "Unable to get onscreen canvas";
		let sample_size = pixelsize;
		let pixelArr = offScreenImageData.data;
		for (let y = 0; y < offScreenCanvas.height; y += sample_size) {
			for (let x = 0; x < offScreenCanvas.width; x += sample_size) {
				let p = (x + y * offScreenCanvas.width) * 4;
				onScreenContext.fillStyle =
					"rgba(" +
					pixelArr[p] +
					"," +
					pixelArr[p + 1] +
					"," +
					pixelArr[p + 2] +
					"," +
					pixelArr[p + 3] +
					")";
				onScreenContext.fillRect(x, y, sample_size, sample_size);
			}
		}
	};

	const handleSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (loaded) {
			setPixelsize(parseInt(event.target.value));
		}
	};

	useEffect(() => {
		pixelate2();
	}, [pixelsize]);

	return (
		<div>
			<canvas ref={canvas} height={400} width={400} />
			<input
				onChange={handleSlider}
				type="range"
				min={1}
				max={100}
				step={1}
			></input>
		</div>
	);
};

export default App;
