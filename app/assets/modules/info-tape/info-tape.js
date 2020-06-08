"use strict";
// info-tape module

////////////////////////////////////////////////////////////////////////////////
  // ↓↓↓ зсув полоси разом із таблицею ↓↓↓
  let activeTableBody = document.querySelector('#info-area .info-area-table-wrapper');
  let tape = document.getElementById('info-tape');

  activeTableBody.addEventListener('scroll', scrollTape);
  function scrollTape(event) {
    tape.style.marginLeft = -activeTableBody.scrollLeft + 'px';
  }
  // ↑↑↑ /зсув полоси разом із таблицею ↑↑↑
////////////////////////////////////////////////////////////////////////////////