var state = 0;

function openMenu() {
    if (state == 0) {
        document.getElementById("menu_button").classList.toggle("change");
        document.getElementById("nav_menu").style.width = "100%";
        state = 1;
    } else {
        document.getElementById("menu_button").classList.toggle("change");
        document.getElementById("nav_menu").style.width = "0%";
        state = 0;
    }

}
