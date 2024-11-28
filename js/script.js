
var sun = document.getElementById("sun-icon");
var moon = document.getElementById("moon-icon");
var body = document.getElementsByTagName("body")[0];
var notiOn = document.getElementById("notifyOn-icon");
var notiOff = document.getElementById("notifyOff-icon");
var schedule = document.getElementsByClassName("schedule-icon")[0];
// Dark and Light mode
function darkMode(){
    sun.style.display = "none";
    moon.style.display = "block";
    body.classList.toggle("body-dark");
    body.style.transitionDuration="2s";
    schedule.style.color = black;
}

function lightMode(){
    sun.style.display = "block";
    moon.style.display = "none";
    body.classList.toggle("body-dark");
    body.style.transitionDuration="2s";
    schedule.style.color = black;
    
}

// Notification on and off
function notifyOn(){
    notiOn.style.display = "none";
    notiOff.style.display = "block";
    alert("Turning on notification");
}

function notifyOff(){
    notiOn.style.display = "block";
    notiOff.style.display = "none";
    alert("Turning off notification");

}