"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var a = navigator.userAgent.toLowerCase(); // windows/firefox : windows firefox
  // windows/chrome  : windows chrome safari
  // android/firefox : android mobile firefox
  // android/chrome  : linux android chrome mobile safari
  // iPad            : macintosh safari, ' mac '
  // iPhone          : iphone mobile safari, ' mac '

  var temp = ''; // iPad

  if (a.includes('macintosh') && a.includes('safari')) {
    /*бокова панель, вкладка "Все пары" схлопувалася. Довелося робити затичку.
    Затичка не повноцінна: при вкл/викл нижньої панелі потрібно перераховувати висоту.
    Це якщо дійдуть руки.*/
    document.querySelector(".tab-header[data-tab='all']").addEventListener('click', function () {
      var height = document.querySelector('#aside').offsetHeight;
      document.querySelectorAll('#aside .tab-bodies-wrapper .tab-body')[1].style.height = height - 120 + 'px';
    });
    /* яблотехніка не повністю і коряво підтримує FullScreen Api*/

    document.querySelector('li.graphic-panel__btn[data-fullscreen]').style.display = 'none';
    document.querySelector('.submenu-item_with-img[data-fullscreen]').style.display = 'none';
  } // iPhone


  if (a.includes('iphone') && a.includes('safari')) {
    /*бокова панель, вкладка "Все пары" схлопувалася. Довелося робити затичку.
    Затичка не повноцінна: при вкл/викл нижньої панелі потрібно перераховувати висоту.
    Це якщо дійдуть руки.*/
    document.querySelector(".tab-header[data-tab='all']").addEventListener('click', function () {
      var height = document.querySelector('#aside').offsetHeight;
      document.querySelectorAll('#aside .tab-bodies-wrapper .tab-body')[1].style.height = height - 180 + 'px';
    });
    /* яблотехніка не повністю і коряво підтримує FullScreen Api*/

    document.querySelector('li.graphic-panel__btn[data-fullscreen]').style.display = 'none';
    document.querySelector('.submenu-item_with-img[data-fullscreen]').style.display = 'none';
  }
});