let diff = 1;

document.getElementById("settings").onclick = function(){
        document.getElementById("option-container").style.display = "none";
        document.getElementById("settings-container").style.display = "block";
}

var radios = document.querySelectorAll('input[type=radio][name="diffRadio"]');
radios.forEach(radio => radio.addEventListener('change', () => diff = radio.value));

document.getElementById("play").onclick = function(){
    window.location.href = `game.html?d=${diff}`;
}

document.getElementById("back").onclick = function(){
    document.getElementById("option-container").style.display = "block";
    document.getElementById("settings-container").style.display = "none";
}