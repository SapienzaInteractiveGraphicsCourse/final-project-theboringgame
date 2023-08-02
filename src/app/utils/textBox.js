import {KeyHandlerUtil} from "../utils/keyhandler.js"



export async function showTextBox(text, speed=50){
    let div = document.getElementById("dialog-container");
	
	KeyHandlerUtil.isEnabled = false;

	div.style.display = "flex";
	for(let i = 0; i < text.length; i++) {
		await new Promise(resolve => setTimeout(resolve, speed));
		div.innerHTML += text[i]
	}

	KeyHandlerUtil.isEnabled = true;
}