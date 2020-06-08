"use strict";
// tab module

////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ переключення вкладок ↓↓↓ */

document.addEventListener('click', switchTab);

/**
 * [switchTab переключає вкладки]
 * @param  {[object]} event [об'єкт події]
 */
function switchTab(event) {
  if ( !event.target.classList.contains('tab-header') ||
        event.target.classList.contains('tab-header_active') ) return;

  let tab         = event.target.closest('.tab-header');
  let dataAttr    = tab.dataset.tab;
  let grandParent = tab.closest('.tab-area');

  grandParent.querySelector('.tab-body_active')
             .classList.remove('tab-body_active');
  grandParent.querySelector('.tab-header_active')
             .classList.remove('tab-header_active');

  event.target.classList.add('tab-header_active');
  grandParent.querySelector('.tab-body[data-tab="' + dataAttr + '"]')
             .classList.add('tab-body_active');
}

/* ↑↑↑ /переключення вкладок ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////