const x = document.getElementById("demo");

function changeState() {
    if (x.className.indexOf("show") === -1) {
        x.className += " show";
    } else {
        x.className = x.className.replace(" show", "");
    }
}