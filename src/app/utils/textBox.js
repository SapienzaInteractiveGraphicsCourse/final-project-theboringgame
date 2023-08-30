import { KeyHandlerUtil } from "../utils/keyhandler.js"



export async function showTextBox(text, speed = 50) {
	let div = document.getElementById("dialog-container");

	KeyHandlerUtil.isEnabled = false;

	div.style.display = "flex";
	for (let i = 0; i < text.length; i++) {
		await new Promise(resolve => setTimeout(resolve, speed));
		div.innerHTML += text[i]
	}

	KeyHandlerUtil.isEnabled = true;

}

export async function showTextBoxNoHandler(text, speed = 50) {
	let div = document.getElementById("dialog-container");

	div.style.display = "flex";
	for (let i = 0; i < text.length; i++) {
		await new Promise(resolve => setTimeout(resolve, speed));
		div.innerHTML += text[i]
	}

}

export async function showHint(text, speed = 100) {
	let div = document.getElementById("tips-container");

	const prevOpacity = div.style.opacity;

	div.innerHTML = text;
	div.style.opacity = 0.5;

	if (prevOpacity != 0)
		return;

	var interval = setInterval(function () {
		div.style.opacity -= 0.01;
		if (div.style.opacity == 0)
			clearInterval(interval);
	}, speed);
}