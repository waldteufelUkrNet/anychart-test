"use strict";
// header module

////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ timer ↓↓↓ */
  // для правильного визначення часу звертаємося до сервера
  // (у клієнта на компі може стояти неправильний час)

  let t   = {}; // newUTCTimeObj
  let url = 'url';

  // робимо запит на сервер
  // формуємо об'єкт дати
  // викликаємо функцію відліку часу
  let timeXHTTP = new XMLHttpRequest;
  timeXHTTP.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // success
      t.yyyySTR    = this.responseText.slice(0,4);
      t.yyyyNUM    = +this.responseText.slice(0,4);
      t.yySTR      = this.responseText.slice(2,4);
      t.yyNUM      = +this.responseText.slice(2,4);
      t.mmSTR      = this.responseText.slice(5,7);
      t.mmNUM      = +this.responseText.slice(5,7);
      t.ddSTR      = this.responseText.slice(8,10);
      t.ddNUM      = +this.responseText.slice(8,10);
      t.hhSTR      = this.responseText.slice(11,13);
      t.hhNUM      = +this.responseText.slice(11,13);
      t.minSTR     = this.responseText.slice(14,16);
      t.minNUM     = +this.responseText.slice(14,16);
      t.ssSTR      = this.responseText.slice(17,19);
      t.ssNUM      = +this.responseText.slice(17,19);
      t.timeInMS   = Date.parse(this.responseText);
      t.date       = new Date(t.timeInMS);
      t.weekday    = t.date.getDay();
      t.hh_mm      = t.hhSTR + ':' + t.minSTR;
      t.yyyy_mm_dd = t.yyyySTR + '-' + t.mmSTR + '-' + t.ddSTR;

      // let dateString = this.responseText;
      timer (this.responseText);
    } else if (this.readyState == 4 && this.status != 200) {
      // error
      let date = new Date();
      t.yyyySTR   = '' +date.getUTCFullYear();
      t.yyyyNUM   = date.getUTCFullYear();
      t.yySTR     = t.yyyySTR.slice(2,4);
      t.yyNUM     = +t.yyyySTR.slice(2,4);
      t.mmNUM     = date.getUTCMonth() + 1;
      if (t.mmNUM < 10) {t.mmSTR = '0' + t.mmNUM } else {t.mmSTR = '' + t.mmNUM};
      t.ddNUM     = date.getUTCDate();
      if (t.ddNUM < 10) {t.ddSTR = '0' + t.ddNUM } else {t.ddSTR = '' + t.ddNUM};
      t.hhNUM     = date.getUTCHours();
      if (t.hhNUM < 10) {t.hhSTR = '0' + t.hhNUM } else {t.hhSTR = '' + t.hhNUM};
      t.minNUM    = date.getUTCMinutes();
      if (t.minNUM < 10) {t.minSTR = '0' + t.minNUM } else {t.minSTR = '' + t.minNUM};
      t.ssNUM     = date.getUTCSeconds();
      if (t.ssNUM < 10) {t.ssSTR = '0' + t.ssNUM } else {t.ssSTR = '' + t.ssNUM};

      t.timeInMS   = +date;
      t.date       = date;
      t.weekday    = date.getDay();
      t.hh_mm      = t.hhSTR + ':' + t.minSTR;
      t.yyyy_mm_dd = t.yyyySTR + '-' + t.mmSTR + '-' + t.ddSTR;

      let dateString = t.yyyySTR + '-' + t.mmSTR + '-' + t.ddSTR +'T' + t.hhSTR + ':' + t.minSTR + ':' + t.ssSTR + 'Z';
      timer (dateString);
    }
  }
  timeXHTTP.open('get', url, true);
  timeXHTTP.send();

  // перезапис даних в html
  setInterval(function () {
    document.getElementById('hours').innerHTML   = t.hhSTR;
    document.getElementById('minutes').innerHTML = t.minSTR;
    document.getElementById('secomds').innerHTML = t.ssSTR;
  }, 1000);

  /**
   * [timer запускає цикл, який оновлює об'єкт дати]
   * @param {[String]} dateString [значення, отримане із сервера, або
   * згенероване вручну, якщо сервер видає помилку]
   */
  function timer (dateString) {
    let currentDate = new Date( Date.parse(dateString) );//  var currentDate = new Date(JSON.parse(dateString));

    setInterval(function() {
      currentDate.setSeconds(currentDate.getSeconds() + 1);

      t.yyyySTR    = '' +currentDate.getUTCFullYear();
      t.yyyyNUM    = currentDate.getUTCFullYear();
      t.yySTR      = t.yyyySTR.slice(2,4);
      t.yyNUM      = +t.yyyySTR.slice(2,4);
      t.mmNUM      = currentDate.getUTCMonth() + 1;
      t.ddNUM      = currentDate.getUTCDate();
      t.hhNUM      = currentDate.getUTCHours();
      t.minNUM     = currentDate.getUTCMinutes();
      t.ssNUM      = currentDate.getUTCSeconds();

      if (t.mmNUM < 10) {t.mmSTR = '0' + t.mmNUM } else {t.mmSTR = '' + t.mmNUM};
      if (t.ddNUM < 10) {t.ddSTR = '0' + t.ddNUM } else {t.ddSTR = '' + t.ddNUM};
      if (t.hhNUM < 10) {t.hhSTR = '0' + t.hhNUM } else {t.hhSTR = '' + t.hhNUM};
      if (t.minNUM < 10) {t.minSTR = '0' + t.minNUM } else {t.minSTR = '' + t.minNUM};
      if (t.ssNUM < 10) {t.ssSTR = '0' + t.ssNUM } else {t.ssSTR = '' + t.ssNUM};

      t.timeInMS   = +currentDate;
      t.date       = currentDate;
      t.weekday    = currentDate.getDay(); // день тижня 0 - неділя, 6 - субота
      t.hh_mm      = t.hhSTR + ':' + t.minSTR;
      t.yyyy_mm_dd = t.yyyySTR + '-' + t.mmSTR + '-' + t.ddSTR;
    },1000);
  }
/* ↑↑↑ /timer ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ language switcher ↓↓↓ */
  document.getElementById('language-list').addEventListener('click', changeLanguage);

  function changeLanguage(event) {
    let lang = event.target.closest('[data-lang]').dataset.lang;

    if (lang == 'ru') {
      document.querySelector('#language-active > img')
              .setAttribute('src', 'assets/img/lang-ru.png');
      document.querySelector('#language-active > span')
              .textContent = 'русский';
      document.querySelector('.submenu-item[data-lang="ru"]')
              .classList.add('submenu-item_checked');
      document.querySelector('.submenu-item[data-lang="en"]')
              .classList.remove('submenu-item_checked');
      document.getElementById('language-active')
              .setAttribute('data-lang', 'ru');
    } else if (lang == 'en') {
      document.querySelector('#language-active > img')
              .setAttribute('src', 'assets/img/lang-en.png');
      document.querySelector('#language-active > span')
              .textContent = 'english';
      document.querySelector('.submenu-item[data-lang="ru"]')
              .classList.remove('submenu-item_checked');
      document.querySelector('.submenu-item[data-lang="en"]')
              .classList.add('submenu-item_checked');
      document.getElementById('language-active')
              .setAttribute('data-lang', 'en');
    }

  }
/* ↑↑↑ /language switcher ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////