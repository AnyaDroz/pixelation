import { useState, useEffect, useRef } from "react";

// "offscreen rendering"
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas

// If you need types, you probably need:

// const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

// Broad design for you:
//
// 1. useEffect [] to create the image, set the src and add an onload handler
//    the onload handler does setOriginalImage(image)
// 2. useEffect [originalImage], this renders the loaded image into an offscreen buffer/canvas and sets another state, maybe "buffer"
// 3. useEffect [buffer, pixelsize], this executes your pixelate function and renders into the onscreen canvas
const pixelate = (context: any, pixelsize: any) => {
	let w = 500;
	let h = 500;
	const imageData = context.getImageData(0, 0, w, h);
	let pixelArr = imageData.data;
	let sample_size = pixelsize;
	for (let y = 0; y < h; y += sample_size) {
		for (let x = 0; x < w; x += sample_size) {
			let p = (x + y * w) * 4;
			context.fillStyle =
				"rgba(" +
				pixelArr[p] + // red
				"," +
				pixelArr[p + 1] + // green
				"," +
				pixelArr[p + 2] + // blue
				"," +
				pixelArr[p + 3] + // alpha (255 => solid, 0 => transparent)
				")";
			context.fillRect(x, y, sample_size, sample_size);
		}
	}
};
const App = () => {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const [loaded, setLoaded] = useState<HTMLImageElement | null>(null);
	const [buffer, setBuffer] = useState<boolean | null>(false);

	useEffect(() => {
		const offscreenCanvas: any = new OffscreenCanvas(1000, 1000);
		const offScreenContext = offscreenCanvas.getContext("2d");
		const image = new Image();
		image.src = "/images/avatar.png";
		image.onload = () => {
			offScreenContext.drawImage(image, 0, 0);
			console.log("loaded");
			setLoaded(image);
		};
	}, []);

	useEffect(() => {
		if (loaded) {
			const context = canvas.current?.getContext("2d");
			console.log(loaded);
			context?.drawImage(loaded, 0, 0);
			pixelate(context, 20);
		}
	}, [loaded]);

	return (
		<div>
			<canvas ref={canvas} height={1000} width={1000} />;
		</div>
	);
};

export default App;

// 	const [value, setValue] = useState(50);
// 	const handleSlider = (event: any) => {
// 		setValue(event.target.value);
// 		console.log(value);
// 	};
// 	const pixelate = (context: any, pixelsize: any) => {
// 		const image = new Image();
// 		image.src = "/images/avatar.png";
// 		context.drawImage(image, 0, 0);
// 		let w = 500;
// 		let h = 500;
// 		const imageData = context.getImageData(0, 0, w, h);
// 		let pixelArr = imageData.data;
// 		let sample_size = pixelsize;
// 		for (let y = 0; y < h; y += sample_size) {
// 			for (let x = 0; x < w; x += sample_size) {
// 				let p = (x + y * w) * 4;
// 				context.fillStyle =
// 					"rgba(" +
// 					pixelArr[p] + // red
// 					"," +
// 					pixelArr[p + 1] + // green
// 					"," +
// 					pixelArr[p + 2] + // blue
// 					"," +
// 					pixelArr[p + 3] + // alpha (255 => solid, 0 => transparent)
// 					")";
// 				context.fillRect(x, y, sample_size, sample_size);
// 			}
// 		}
// 	};
// 	return (
// 		<div>
// 			<input onChange={handleSlider} type="range" min="10" max="40" />
// 			<Canvas pixelsize={value} pixelate={pixelate} height={500} width={500} />
// 		</div>
// 	);

// export default App;
