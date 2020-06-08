"use strict";
// scrollTable-fixHeader module

////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ прокрутка таблиці при фіксованому положенні шапки в info-area ↓↓↓ */
let scrollTables = document.querySelectorAll('.js-scroll-table-wrapper');

// навішування обробника через цикл, з передачею контексту
for (let i = 0; i < scrollTables.length; i++) {
  (function(n, domobj){
    scrollTables[n].onscroll = function() {
      scrollTableHandler(domobj);
    };
  }(i, scrollTables[i]));
}

/**
 * [scrollTableHandler встановлює зміщення шапки таблиці
 *                     відповідно до прокрутки талиці]
 * @param  {[DOM-object]} eventTarget [прокручувана обгортка таблиці]
 */
function scrollTableHandler(eventTarget) {
  let scrollTop = eventTarget.scrollTop;
  eventTarget.querySelector('thead').style.transform = 'translateY('    +
                                                        (scrollTop - 1) +
                                                        'px)';
}
/* ↑↑↑ /прокрутка таблиці при фіксованому положенні шапки в info-area */
////////////////////////////////////////////////////////////////////////////////