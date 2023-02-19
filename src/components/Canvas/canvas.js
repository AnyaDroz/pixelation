import React from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";

const pixelateX = (context, pixelsize) => {
	const image = new Image();
	image.src = "/images/avatar.png";
	image.onload = () => {
		console.log("image loaded");
		context.drawImage(image, 0, 0);
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
					pixelArr[p] +
					"," +
					pixelArr[p + 1] +
					"," +
					pixelArr[p + 2] +
					"," +
					pixelArr[p + 3] +
					")";
				context.fillRect(x, y, sample_size, sample_size);
			}
		}
	};
};

const Canvas = ({ height, width, pixelate, pixelsize }) => {
	const canvas = React.useRef();

	useEffect(() => {
		console.log("PIXEL SIZE " + pixelsize);
		const context = canvas.current.getContext("2d");
		pixelateX(context, pixelsize);
	}, [pixelsize]);

	return <canvas ref={canvas} height={height} width={width} />;
};

Canvas.propTypes = {
	pixelsize: PropTypes.any.isRequired,
	pixelate: PropTypes.func.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default Canvas;
