import React from "react";
import { useEffect } from "react";

import Canvas from "./components/Canvas/canvas"; // Change the path according to the directory structure of your project

const draw = (context: any) => {
	const image = new Image();
	// image.crossOrigin = "Anonymous";
	image.src = "/images/avatar.png";
	context.drawImage(image, 0, 0);
	const imageData = context.getImageData(0, 0, 1000, 1000);
	const data = imageData.data;
	for (let i = 0; i < data.length; i += 4) {
		data[i] = 255 - data[i]; // red
		data[i + 1] = 255 - data[i + 1]; // green
		data[i + 2] = 255 - data[i + 2]; // blue
	}
	context.putImageData(imageData, 0, 0);
};

function App() {
	return <Canvas draw={draw} height={1000} width={1000} />;
}

export default App;
