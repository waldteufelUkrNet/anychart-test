"use strict";
// nav module

////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ toggle menu items ↓↓↓ */
  let menuItems = document.querySelectorAll('.navigation-list > .navigation-list__item');
  addOnEventToObject('click', menuItems, toggleMenuItems);
  function toggleMenuItems(e) {
    let item = e;
    let list = item.querySelector('.submenu-list');

    if ( list.classList.contains('submenu-list_active') ) {
      list.classList.remove('submenu-list_active');
    } else {
      let tempArr = document.querySelectorAll('.navigation-list__item > .submenu-list');
      for(let i=0; i<tempArr.length; i++) {
        tempArr[i].classList.remove('submenu-list_active');
      }
      list.classList.add('submenu-list_active');
    }
  }
  document.addEventListener('click', function(event){
    if ( !event.target.classList.contains('navigation-list__item') ) {
      let tempArr = document.querySelectorAll('.navigation-list__item > .submenu-list');
      for(let i=0; i<tempArr.length; i++) {
        tempArr[i].classList.remove('submenu-list_active');
      }
    }
  });
/* ↑↑↑ /toggle menu items ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ full screen mode on/off ↓↓↓ */
  document.querySelector('.submenu-item_with-img[data-fullscreen]')
          .addEventListener('click', toggleFullscreen);
/* ↑↑↑ /full screen mode on/off ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ aside&footer on/off ↓↓↓ */
  document.querySelector('[data-toggle-aside]')
          .addEventListener('click', toggleAsidePanel);
  document.querySelector('[data-toggle-footer]')
          .addEventListener('click', toggleFooterPanel);

  let isAsidePanelOpen,
      isFooterPanelOpen;

  let windowWidth = document.documentElement.clientWidth;
  if (windowWidth > 930) {
    isAsidePanelOpen  = true;
    isFooterPanelOpen = true;

    document.querySelector('.submenu-item[data-toggle-aside]')
            .classList.add('submenu-item_with-img_active')
    document.querySelector('.submenu-item[data-toggle-footer]')
            .classList.add('submenu-item_with-img_active');

    document.getElementById('main-area').style.maxHeight = 'calc(100% - 250px)';

    document.getElementById('aside-wrapper').style.display = 'block';
    document.getElementById('info-area-wrapper').style.display = 'block';
  } else {
    isAsidePanelOpen  = false;
    isFooterPanelOpen = false;

    document.querySelector('.submenu-item[data-toggle-aside]')
            .classList.remove('submenu-item_with-img_active')
    document.querySelector('.submenu-item[data-toggle-footer]')
            .classList.remove('submenu-item_with-img_active');

    document.getElementById('main-area').style.maxHeight = '100%';

    document.getElementById('aside-wrapper').style.display = 'none';
    document.getElementById('info-area-wrapper').style.display = 'none';
  }

  function toggleAsidePanel() {
    if (isAsidePanelOpen) {
      // close
      document.getElementById('aside-wrapper').style.display = 'none';
      document.querySelector('.submenu-item[data-toggle-aside]')
              .classList.remove('submenu-item_with-img_active');
    } else {
      // open
      document.getElementById('aside-wrapper').style.display = 'block';
      document.querySelector('.submenu-item[data-toggle-aside]')
              .classList.add('submenu-item_with-img_active');
    }
    isAsidePanelOpen = !isAsidePanelOpen;
  }

  function toggleFooterPanel() {
    if (isFooterPanelOpen) {
      // close
      document.getElementById('info-area-wrapper').style.display = 'none';
      document.getElementById('main-area').style.maxHeight = '100%';
      document.querySelector('.submenu-item[data-toggle-footer]')
              .classList.remove('submenu-item_with-img_active');
    } else {
      // open
      document.getElementById('info-area-wrapper').style.display = 'block';
      document.getElementById('main-area').style.maxHeight = 'calc(100% - 250px)';
      document.querySelector('.submenu-item[data-toggle-footer]')
              .classList.add('submenu-item_with-img_active');
    }
    isFooterPanelOpen = !isFooterPanelOpen;
  }
/* ↑↑↑ /aside&footer on/off ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ language switcher ↓↓↓ */
  document.querySelector('.submenu-item[data-lang="ru"]')
          .addEventListener('click', changeLanguage);
  document.querySelector('.submenu-item[data-lang="en"]')
          .addEventListener('click', changeLanguage);
/* ↑↑↑ /language switcher ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////