"use strict";
// graphic-panel module

////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ full screen mode on/off ↓↓↓ */
document.querySelector('.graphic-panel__btn[data-fullscreen]')
        .addEventListener('click', toggleFullscreen);

let isFSOn = false;
function toggleFullscreen() {
  if (isFSOn) {
    // close
    document.querySelector('.graphic-panel__btn[data-fullscreen] img')
            .setAttribute('src','assets/img/fullScreenModeOn.png');
    document.querySelector('.submenu-item_with-img[data-fullscreen]')
            .classList.remove('submenu-item_with-img_active');

    document.exitFullscreen();
  } else {
    // open
    document.querySelector('.graphic-panel__btn[data-fullscreen] img')
            .setAttribute('src','assets/img/fullScreenModeOff.png');
    document.querySelector('.submenu-item_with-img[data-fullscreen]')
            .classList.add('submenu-item_with-img_active');

    document.documentElement.requestFullscreen();
  }
  isFSOn = !isFSOn;
}
/* ↑↑↑ /full screen mode on/off ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////