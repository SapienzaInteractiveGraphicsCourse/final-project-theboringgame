let diff = 1;
let volume = true;

document.getElementById("settings").onclick = function () {
    document.getElementById("title-tab").style.display = "none";
    document.getElementById("option-container").style.display = "none";
    document.getElementById("settings-container").style.display = "block";
}

document.getElementById("rules").onclick = function () {
    document.getElementById("title-tab").style.display = "none";
    document.getElementById("option-container").style.display = "none";
    document.getElementById("rules-container").style.display = "block";
}

var radios = document.querySelectorAll('input[type=radio][name="diffRadio"]');
radios.forEach(radio => radio.addEventListener('change', () => diff = radio.value));

document.getElementById("play").onclick = function () {
    window.location.href = `game.html?d=${diff}&v=${volume}`;
}

document.getElementById("volumeToggle").onclick = function () {
    volume = !volume;
    document.getElementById("volumeNo").style.display = volume ? "none" : "block";
    document.getElementById("volumeYes").style.display = volume ? "block" : "none";
}

document.getElementById("back").onclick = function () {
    document.getElementById("title-tab").style.display = "";
    document.getElementById("option-container").style.display = "block";
    document.getElementById("settings-container").style.display = "none";
}

document.getElementById("backR").onclick = function () {
    document.getElementById("title-tab").style.display = "";
    document.getElementById("option-container").style.display = "block";
    document.getElementById("rules-container").style.display = "none";
}