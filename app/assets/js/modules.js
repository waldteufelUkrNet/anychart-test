"use strict"; // aside module
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ закриття панельки ↓↓↓ */

document.getElementById('aside-close-btn').addEventListener('click', toggleAsidePanel);
/* ↑↑↑ /закриття панельки ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
"use strict"; // buy-sell-btns module
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ validation + increment/decrement inputs ↓↓↓ */

document.addEventListener('click', incrementDecrementInputs);
document.addEventListener('keydown', validateInputs);
document.addEventListener('keyup', validateInputs);
document.getElementById('lot').onblur = validateInputs;

function incrementDecrementInputs(event) {
  var button = event.target.closest('[data-behavior="increment"]') || event.target.closest('[data-behavior="decrement"]');
  if (!button) return;
  var input = button.parentElement.querySelector('input');
  var currentValue = +input.value,
      minValue = +input.dataset.minvalue,
      maxValue = +input.dataset.maxvalue,
      step = +input.dataset.step,
      behavior = button.dataset.behavior;
  if (behavior == 'decrement') step = 0 - step;
  var newValue = Math.round((currentValue + step) * 10000) / 10000;
  if (newValue > maxValue) newValue = maxValue;
  if (newValue < minValue) newValue = minValue;
  input.value = newValue;
}

function validateInputs(event) {
  var input = event.target.closest('input[data-validate="numeric"]');
  if (!input) return;

  if (event.type == 'keydown') {
    // фільтрація клавіш - тільки цифри, крапка та клавіші управління
    if (event.key >= '0' && event.key <= '9' || event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Backspace' || event.key == 'Delete' || event.key == '.') {} else {
      event.preventDefault();
    }
  } else if (event.type == 'keyup' && event.key != 'ArrowLeft' && event.key != 'ArrowRight' && event.key != 'Backspace' && event.key != 'Delete' || event.type == 'blur') {
    var currentValue = input.value,
        minValue = input.dataset.minvalue || 0,
        maxValue = input.dataset.maxvalue; //  . -> 0.

    if (currentValue.startsWith('.')) {
      var newValue = '0' + currentValue;
      input.value = newValue;
    } // 0 -> 0.


    currentValue = input.value;

    if (currentValue.startsWith('0') && currentValue.length > 1 && currentValue[1] != '.') {
      var _newValue = '0.' + currentValue.slice(1);

      input.value = _newValue;
    } // only one point


    currentValue = input.value;
    var count = 0,
        position = 0;

    while (true) {
      var found = currentValue.indexOf('.', position);
      if (found == -1) break;
      position = found + 1;
      count += 1;

      if (count >= 2) {
        input.value = minValue;
        return;
      }
    } // after point less then 6 symbols


    currentValue = input.value;

    if (currentValue.includes('.')) {
      var tempArr = currentValue.split('.');

      if (tempArr[1].length > 5) {
        input.value = tempArr[0] + '.' + tempArr[1].slice(0, 5);
      }
    } // minValue < currentValue < maxValue


    currentValue = input.value;
    if (+currentValue < +minValue) input.value = minValue;
    if (+currentValue > +maxValue) input.value = maxValue;
  }
}
/* ↑↑↑ /validation + increment/decrement inputs ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
"use strict";
"use strict"; // graphic-panel module
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ full screen mode on/off ↓↓↓ */

document.querySelector('.graphic-panel__btn[data-fullscreen]').addEventListener('click', toggleFullscreen);
var isFSOn = false;

function toggleFullscreen() {
  if (isFSOn) {
    // close
    document.querySelector('.graphic-panel__btn[data-fullscreen] img').setAttribute('src', 'assets/img/fullScreenModeOn.png');
    document.querySelector('.submenu-item_with-img[data-fullscreen]').classList.remove('submenu-item_with-img_active');
    document.exitFullscreen();
  } else {
    // open
    document.querySelector('.graphic-panel__btn[data-fullscreen] img').setAttribute('src', 'assets/img/fullScreenModeOff.png');
    document.querySelector('.submenu-item_with-img[data-fullscreen]').classList.add('submenu-item_with-img_active');
    document.documentElement.requestFullscreen();
  }

  isFSOn = !isFSOn;
}
/* ↑↑↑ /full screen mode on/off ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
"use strict"; // header module
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ timer ↓↓↓ */
// для правильного визначення часу звертаємося до сервера
// (у клієнта на компі може стояти неправильний час)

var t = {}; // newUTCTimeObj

var url = 'url'; // робимо запит на сервер
// формуємо об'єкт дати
// викликаємо функцію відліку часу

var timeXHTTP = new XMLHttpRequest();

timeXHTTP.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    // success
    t.yyyySTR = this.responseText.slice(0, 4);
    t.yyyyNUM = +this.responseText.slice(0, 4);
    t.yySTR = this.responseText.slice(2, 4);
    t.yyNUM = +this.responseText.slice(2, 4);
    t.mmSTR = this.responseText.slice(5, 7);
    t.mmNUM = +this.responseText.slice(5, 7);
    t.ddSTR = this.responseText.slice(8, 10);
    t.ddNUM = +this.responseText.slice(8, 10);
    t.hhSTR = this.responseText.slice(11, 13);
    t.hhNUM = +this.responseText.slice(11, 13);
    t.minSTR = this.responseText.slice(14, 16);
    t.minNUM = +this.responseText.slice(14, 16);
    t.ssSTR = this.responseText.slice(17, 19);
    t.ssNUM = +this.responseText.slice(17, 19);
    t.timeInMS = Date.parse(this.responseText);
    t.date = new Date(t.timeInMS);
    t.weekday = t.date.getDay();
    t.hh_mm = t.hhSTR + ':' + t.minSTR;
    t.yyyy_mm_dd = t.yyyySTR + '-' + t.mmSTR + '-' + t.ddSTR; // let dateString = this.responseText;

    timer(this.responseText);
  } else if (this.readyState == 4 && this.status != 200) {
    // error
    var date = new Date();
    t.yyyySTR = '' + date.getUTCFullYear();
    t.yyyyNUM = date.getUTCFullYear();
    t.yySTR = t.yyyySTR.slice(2, 4);
    t.yyNUM = +t.yyyySTR.slice(2, 4);
    t.mmNUM = date.getUTCMonth() + 1;

    if (t.mmNUM < 10) {
      t.mmSTR = '0' + t.mmNUM;
    } else {
      t.mmSTR = '' + t.mmNUM;
    }

    ;
    t.ddNUM = date.getUTCDate();

    if (t.ddNUM < 10) {
      t.ddSTR = '0' + t.ddNUM;
    } else {
      t.ddSTR = '' + t.ddNUM;
    }

    ;
    t.hhNUM = date.getUTCHours();

    if (t.hhNUM < 10) {
      t.hhSTR = '0' + t.hhNUM;
    } else {
      t.hhSTR = '' + t.hhNUM;
    }

    ;
    t.minNUM = date.getUTCMinutes();

    if (t.minNUM < 10) {
      t.minSTR = '0' + t.minNUM;
    } else {
      t.minSTR = '' + t.minNUM;
    }

    ;
    t.ssNUM = date.getUTCSeconds();

    if (t.ssNUM < 10) {
      t.ssSTR = '0' + t.ssNUM;
    } else {
      t.ssSTR = '' + t.ssNUM;
    }

    ;
    t.timeInMS = +date;
    t.date = date;
    t.weekday = date.getDay();
    t.hh_mm = t.hhSTR + ':' + t.minSTR;
    t.yyyy_mm_dd = t.yyyySTR + '-' + t.mmSTR + '-' + t.ddSTR;
    var dateString = t.yyyySTR + '-' + t.mmSTR + '-' + t.ddSTR + 'T' + t.hhSTR + ':' + t.minSTR + ':' + t.ssSTR + 'Z';
    timer(dateString);
  }
};

timeXHTTP.open('get', url, true);
timeXHTTP.send(); // перезапис даних в html

setInterval(function () {
  document.getElementById('hours').innerHTML = t.hhSTR;
  document.getElementById('minutes').innerHTML = t.minSTR;
  document.getElementById('secomds').innerHTML = t.ssSTR;
}, 1000);
/**
 * [timer запускає цикл, який оновлює об'єкт дати]
 * @param {[String]} dateString [значення, отримане із сервера, або
 * згенероване вручну, якщо сервер видає помилку]
 */

function timer(dateString) {
  var currentDate = new Date(Date.parse(dateString)); //  var currentDate = new Date(JSON.parse(dateString));

  setInterval(function () {
    currentDate.setSeconds(currentDate.getSeconds() + 1);
    t.yyyySTR = '' + currentDate.getUTCFullYear();
    t.yyyyNUM = currentDate.getUTCFullYear();
    t.yySTR = t.yyyySTR.slice(2, 4);
    t.yyNUM = +t.yyyySTR.slice(2, 4);
    t.mmNUM = currentDate.getUTCMonth() + 1;
    t.ddNUM = currentDate.getUTCDate();
    t.hhNUM = currentDate.getUTCHours();
    t.minNUM = currentDate.getUTCMinutes();
    t.ssNUM = currentDate.getUTCSeconds();

    if (t.mmNUM < 10) {
      t.mmSTR = '0' + t.mmNUM;
    } else {
      t.mmSTR = '' + t.mmNUM;
    }

    ;

    if (t.ddNUM < 10) {
      t.ddSTR = '0' + t.ddNUM;
    } else {
      t.ddSTR = '' + t.ddNUM;
    }

    ;

    if (t.hhNUM < 10) {
      t.hhSTR = '0' + t.hhNUM;
    } else {
      t.hhSTR = '' + t.hhNUM;
    }

    ;

    if (t.minNUM < 10) {
      t.minSTR = '0' + t.minNUM;
    } else {
      t.minSTR = '' + t.minNUM;
    }

    ;

    if (t.ssNUM < 10) {
      t.ssSTR = '0' + t.ssNUM;
    } else {
      t.ssSTR = '' + t.ssNUM;
    }

    ;
    t.timeInMS = +currentDate;
    t.date = currentDate;
    t.weekday = currentDate.getDay(); // день тижня 0 - неділя, 6 - субота

    t.hh_mm = t.hhSTR + ':' + t.minSTR;
    t.yyyy_mm_dd = t.yyyySTR + '-' + t.mmSTR + '-' + t.ddSTR;
  }, 1000);
}
/* ↑↑↑ /timer ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ language switcher ↓↓↓ */


document.getElementById('language-list').addEventListener('click', changeLanguage);

function changeLanguage(event) {
  var lang = event.target.closest('[data-lang]').dataset.lang;

  if (lang == 'ru') {
    document.querySelector('#language-active > img').setAttribute('src', 'assets/img/lang-ru.png');
    document.querySelector('#language-active > span').textContent = 'русский';
    document.querySelector('.submenu-item[data-lang="ru"]').classList.add('submenu-item_checked');
    document.querySelector('.submenu-item[data-lang="en"]').classList.remove('submenu-item_checked');
    document.getElementById('language-active').setAttribute('data-lang', 'ru');
  } else if (lang == 'en') {
    document.querySelector('#language-active > img').setAttribute('src', 'assets/img/lang-en.png');
    document.querySelector('#language-active > span').textContent = 'english';
    document.querySelector('.submenu-item[data-lang="ru"]').classList.remove('submenu-item_checked');
    document.querySelector('.submenu-item[data-lang="en"]').classList.add('submenu-item_checked');
    document.getElementById('language-active').setAttribute('data-lang', 'en');
  }
}
/* ↑↑↑ /language switcher ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
"use strict";
"use strict"; // info-tape module
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ зсув полоси разом із таблицею ↓↓↓

var activeTableBody = document.querySelector('#info-area .info-area-table-wrapper');
var tape = document.getElementById('info-tape');
activeTableBody.addEventListener('scroll', scrollTape);

function scrollTape(event) {
  tape.style.marginLeft = -activeTableBody.scrollLeft + 'px';
} // ↑↑↑ /зсув полоси разом із таблицею ↑↑↑
////////////////////////////////////////////////////////////////////////////////
"use strict"; // nav module
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ toggle menu items ↓↓↓ */

var menuItems = document.querySelectorAll('.navigation-list > .navigation-list__item');
addOnEventToObject('click', menuItems, toggleMenuItems);

function toggleMenuItems(e) {
  var item = e;
  var list = item.querySelector('.submenu-list');

  if (list.classList.contains('submenu-list_active')) {
    list.classList.remove('submenu-list_active');
  } else {
    var tempArr = document.querySelectorAll('.navigation-list__item > .submenu-list');

    for (var i = 0; i < tempArr.length; i++) {
      tempArr[i].classList.remove('submenu-list_active');
    }

    list.classList.add('submenu-list_active');
  }
}

document.addEventListener('click', function (event) {
  if (!event.target.classList.contains('navigation-list__item')) {
    var tempArr = document.querySelectorAll('.navigation-list__item > .submenu-list');

    for (var i = 0; i < tempArr.length; i++) {
      tempArr[i].classList.remove('submenu-list_active');
    }
  }
});
/* ↑↑↑ /toggle menu items ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ full screen mode on/off ↓↓↓ */

document.querySelector('.submenu-item_with-img[data-fullscreen]').addEventListener('click', toggleFullscreen);
/* ↑↑↑ /full screen mode on/off ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ aside&footer on/off ↓↓↓ */

document.querySelector('[data-toggle-aside]').addEventListener('click', toggleAsidePanel);
document.querySelector('[data-toggle-footer]').addEventListener('click', toggleFooterPanel);
var isAsidePanelOpen, isFooterPanelOpen;
var windowWidth = document.documentElement.clientWidth;

if (windowWidth > 930) {
  isAsidePanelOpen = true;
  isFooterPanelOpen = true;
  document.querySelector('.submenu-item[data-toggle-aside]').classList.add('submenu-item_with-img_active');
  document.querySelector('.submenu-item[data-toggle-footer]').classList.add('submenu-item_with-img_active');
  document.getElementById('main-area').style.maxHeight = 'calc(100% - 250px)';
  document.getElementById('aside-wrapper').style.display = 'block';
  document.getElementById('info-area-wrapper').style.display = 'block';
} else {
  isAsidePanelOpen = false;
  isFooterPanelOpen = false;
  document.querySelector('.submenu-item[data-toggle-aside]').classList.remove('submenu-item_with-img_active');
  document.querySelector('.submenu-item[data-toggle-footer]').classList.remove('submenu-item_with-img_active');
  document.getElementById('main-area').style.maxHeight = '100%';
  document.getElementById('aside-wrapper').style.display = 'none';
  document.getElementById('info-area-wrapper').style.display = 'none';
}

function toggleAsidePanel() {
  if (isAsidePanelOpen) {
    // close
    document.getElementById('aside-wrapper').style.display = 'none';
    document.querySelector('.submenu-item[data-toggle-aside]').classList.remove('submenu-item_with-img_active');
  } else {
    // open
    document.getElementById('aside-wrapper').style.display = 'block';
    document.querySelector('.submenu-item[data-toggle-aside]').classList.add('submenu-item_with-img_active');
  }

  isAsidePanelOpen = !isAsidePanelOpen;
}

function toggleFooterPanel() {
  if (isFooterPanelOpen) {
    // close
    document.getElementById('info-area-wrapper').style.display = 'none';
    document.getElementById('main-area').style.maxHeight = '100%';
    document.querySelector('.submenu-item[data-toggle-footer]').classList.remove('submenu-item_with-img_active');
  } else {
    // open
    document.getElementById('info-area-wrapper').style.display = 'block';
    document.getElementById('main-area').style.maxHeight = 'calc(100% - 250px)';
    document.querySelector('.submenu-item[data-toggle-footer]').classList.add('submenu-item_with-img_active');
  }

  isFooterPanelOpen = !isFooterPanelOpen;
}
/* ↑↑↑ /aside&footer on/off ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ language switcher ↓↓↓ */


document.querySelector('.submenu-item[data-lang="ru"]').addEventListener('click', changeLanguage);
document.querySelector('.submenu-item[data-lang="en"]').addEventListener('click', changeLanguage);
/* ↑↑↑ /language switcher ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
"use strict"; // popups module
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: info ↓↓↓ */

document.querySelector('.popup-info .popup__btn').addEventListener('click', simpleClose);
/* ↑↑↑ /popup: info ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: incoming message ↓↓↓ */

document.querySelector('.popup-incoming-message .popup__btn').addEventListener('click', simpleClose);
/* ↑↑↑ /popup: incoming message ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: deposit confirmation ↓↓↓ */

document.querySelector('.popup-deposit-confirmation .popup__btn').addEventListener('click', simpleClose);
/* ↑↑↑ /popup: deposit confirmation ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: bid confirmation ↓↓↓ */

document.querySelectorAll('.buy-sell-btns__btn')[0].onclick = function () {
  var pair = document.querySelector('#content .tab-header_active').dataset.tab;
  var amount = document.getElementById('lot').value;
  openPopup('.popup-bid-confirmation', 'sell', pair, amount);
};

document.querySelectorAll('.buy-sell-btns__btn')[1].onclick = function () {
  var pair = document.querySelector('#content .tab-header_active').dataset.tab;
  var amount = document.getElementById('lot').value;
  openPopup('.popup-bid-confirmation', 'buy', pair, amount);
};

document.querySelector('.popup-bid-confirmation .popup__btn').addEventListener('click', simpleClose);
/* ↑↑↑ /popup: bid confirmation ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: trading result ↓↓↓ */

document.querySelector('.popup-trading-result .popup__btn').addEventListener('click', simpleClose);
/* ↑↑↑ /popup: trading result ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: validation data ↓↓↓ */

var arrOfInputs = document.querySelectorAll('.popup-verification__input');

document.querySelector('.popup-verification .popup__btn').onclick = function () {
  simpleClose(this);
}; // обробка input'ів


addOnEventToObject('change', arrOfInputs, documentPreloading);

function documentPreloading() {
  var id = event.target.getAttribute('id');
  submitFile(id);
}

function submitFile(namefile) {
  var name = namefile;
  var id = $("#idUser").val();
  var files = document.getElementById(namefile).files;

  if (files.length > 0) {
    if (window.FormData !== undefined) {
      var data = new FormData();

      for (var x = 0; x < files.length; x++) {
        data.append("file" + x, files[x]);
      }

      $.ajax({
        type: "POST",
        url: "Home/Upload?name=" + name + "&id=" + id,
        contentType: false,
        processData: false,
        data: data,
        success: function success(result) {
          if (result == "1") {
            // загрузка прошла успешно
            $('#' + namefile).after('<p style="padding:6px; border: 1px solid grey">completed</p>');
            $('#' + namefile).remove();
          } else {
            $('#' + namefile).val("");
          }
        },
        error: function error() {
          $('#' + namefile).val("");
        }
      });
    } else {
      alert("Браузер не поддерживает загрузку файлов HTML5!");
    }
  }
}

;
/* ↑↑↑ /popup: validation data ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: write message ↓↓↓ */

document.querySelector('.popup-write-message .popup__btn').onclick = function () {
  var message = document.querySelector('.popup-write-message .popup__write-message-text').value;

  if (message.length < 6) {
    this.closest('.popup').querySelectorAll('.popup__validation-error')[0].classList.add('popup__validation-error_active');
    return;
  } // ajax


  ajaxPost('url', message, simpleClose, this); // тут місце для ajax-запиту
  // --//--//--//--//--//--//-
  // це навісити на ajax-success
  // simpleClose(this);
}; // валідація довжини повідомлення


document.querySelector('.popup-write-message .popup__write-message-text').onkeyup = function () {
  var message = document.querySelector('.popup-write-message .popup__write-message-text').value;

  if (message.length >= 6) {
    this.closest('.popup').querySelectorAll('.popup__validation-error')[0].classList.remove('popup__validation-error_active');
  }
};
/* ↑↑↑ /popup: write message ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: change password ↓↓↓ */
// показ/приховування паролю при кліку по оку


var eyesBtns = document.querySelectorAll('.popup__show-hide-pass');
addOnEventToObject('click', eyesBtns, hideShowPass);

function hideShowPass(elem) {
  var inputType = elem.closest('.popup__input-wrapper').querySelector('.popup__password').getAttribute('type');

  if (inputType == 'password') {
    elem.closest('.popup__input-wrapper').querySelector('.popup__password').setAttribute('type', 'text');
    elem.querySelector('.eye_show').style.display = 'block';
    elem.querySelector('.eye_hide').style.display = 'none';
  } else {
    elem.closest('.popup__input-wrapper').querySelector('.popup__password').setAttribute('type', 'password');
    elem.querySelector('.eye_show').style.display = 'none';
    elem.querySelector('.eye_hide').style.display = 'block';
  }
} // клік на кнопку: валідація паролів, ajax-запит на сервер, закриття попапа


document.querySelector('.popup-change-pass .popup__btn').onclick = function (event) {
  var password = document.getElementById('input-password').value;

  if (password.length < 6) {
    event.target.closest('.popup').querySelectorAll('.popup__validation-error')[0].classList.add('popup__validation-error_active');
    return;
  }

  var repeat = document.getElementById('input-confirm-pass').value;

  if (password != repeat) {
    event.target.closest('.popup').querySelectorAll('.popup__validation-error')[1].classList.add('popup__validation-error_active');
    return;
  }

  ajaxPost('url', password, simpleClose, this); // тут місце для ajax-запиту
  // --//--//--//--//--//--//-
  // це навісити на ajax-success
  // simpleClose(this);
}; // валідація довжини паролю


document.getElementById('input-password').onkeyup = function () {
  var password = this.value;

  if (password.length >= 6) {
    this.closest('.popup').querySelectorAll('.popup__validation-error')[0].classList.remove('popup__validation-error_active');
  }
}; // валідація на співпадіння паролів


document.getElementById('input-confirm-pass').onkeyup = function () {
  var password = document.getElementById('input-password').value;
  var repeat = this.value;

  if (password == repeat) {
    this.closest('.popup').querySelectorAll('.popup__validation-error')[1].classList.remove('popup__validation-error_active');
  }
};
/* ↑↑↑ /popup: change password ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: wihtdrawal confirmation ↓↓↓ */


document.querySelector('.popup-withdrawal-confirm .popup__btn').onclick = function (event) {
  var value = document.querySelector('.popup__withdrawal-input').value;

  if (+value <= 0) {
    this.closest('.popup').querySelectorAll('.popup__validation-error')[0].classList.add('popup__validation-error_active');
    return;
  }

  var currency = document.querySelector('.popup__withdrawal-select').value;
  var data = {
    value: value,
    currency: currency
  };
  ajaxPost('url', data, simpleClose, this); // тут місце для ajax-запиту
  // --//--//--//--//--//--//-
  // це навісити на ajax-success
  // simpleClose(this);
};
/* ↑↑↑ /popup: wihtdrawal confirmation ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: profile editor ↓↓↓ */


document.querySelector('.popup-profile-editor .popup__btn').onclick = function () {
  var fname = document.getElementById('input-profile-fname').value;

  if (fname.length < 2) {
    this.closest('.popup').querySelectorAll('.popup__validation-error')[0].classList.add('popup__validation-error_active');
    return;
  }

  var lname = document.getElementById('input-profile-lname').value;

  if (lname.length < 2) {
    this.closest('.popup').querySelectorAll('.popup__validation-error')[1].classList.add('popup__validation-error_active');
    return;
  }

  var gender = document.querySelector('.popup__profile-editor-radio-input:checked').value;
  var data = {
    fname: fname,
    lname: lname,
    gender: gender
  };
  ajaxPost('url', data, simpleClose, this); // тут місце для ajax-запиту
  // --//--//--//--//--//--//-
  // це навісити на ajax-success
  // simpleClose(this);
}; // валідація


document.getElementById('input-profile-fname').onkeyup = function () {
  var fname = this.value;

  if (fname.length >= 2) {
    this.closest('.popup').querySelectorAll('.popup__validation-error')[0].classList.remove('popup__validation-error_active');
  }
};

document.getElementById('input-profile-lname').onkeyup = function () {
  var lname = this.value;

  if (lname.length >= 2) {
    this.closest('.popup').querySelectorAll('.popup__validation-error')[1].classList.remove('popup__validation-error_active');
  }
};
/* ↑↑↑ /popup: profile editor ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ popup: make-deposit ↓↓↓ */
// toggle tabs with forms


var tabs = document.querySelectorAll('.popup__tab-header');
addOnEventToObject('click', tabs, toggleForms);

function toggleForms(elem) {
  // скидання вибраних опцій
  document.querySelector('#mdf1 .popup__make-deposit-amount-input').value = '';
  document.querySelector('#mdf2 .popup__make-deposit-amount-input').value = '';
  document.querySelector('#mdf1 input[type="checkbox"]').checked = false;
  document.querySelector('#mdf2 input[type="checkbox"]').checked = false;
  document.querySelectorAll('.popup-make-deposit .popup__validation-error')[0].classList.remove('popup__validation-error_active');
  document.querySelectorAll('.popup-make-deposit .popup__validation-error')[1].classList.remove('popup__validation-error_active');
  var formNumber = elem.dataset.terminal;
  var tabs = document.querySelectorAll('.popup__tab-header');
  var forms = document.querySelectorAll('.popup__make-deposit-form');
  var buttons = document.querySelectorAll('.popup__make-deposit-btn');

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('popup__tab-header_active');
    forms[i].classList.remove('popup__make-deposit-form_active');
    buttons[i].classList.remove('popup__make-deposit-btn_active');
  }

  elem.classList.add('popup__tab-header_active');
  document.querySelector('.popup__make-deposit-form[data-terminal="' + formNumber + '"]').classList.add('popup__make-deposit-form_active');
  document.querySelector('.popup__make-deposit-btn[data-terminal="' + formNumber + '"]').classList.add('popup__make-deposit-btn_active');
} // bankcards list toggle


var isBankCardsListOpen = false;

document.querySelector('.popup__make-deposit-card-pseudoselect').onclick = function () {
  if (!isBankCardsListOpen) {
    document.querySelector('.popup__make-deposit-cards-wrapper').style.display = 'block';
  } else {
    document.querySelector('.popup__make-deposit-cards-wrapper').style.display = 'none';
  }

  isBankCardsListOpen = !isBankCardsListOpen;
}; // bankcards selection


var bankCardsObj = document.querySelectorAll('.popup__make-deposit-cards-wrapper span.popup__make-deposit-card');
addOnEventToObject('click', bankCardsObj, selectBankCard);

function selectBankCard(elem) {
  document.querySelector('.popup__make-deposit-card-current span').innerHTML = elem.innerHTML;
  document.querySelector('.popup__make-deposit-card-current span').setAttribute('data-paySystem', elem.dataset.paysystem);
} // валідація та відправка форми


var formButtons = document.querySelectorAll('.popup__make-deposit-btn');
addOnEventToObject('click', formButtons, sendDepositForm);

function sendDepositForm(elem) {
  console.log("elem", elem);
  var formId = elem.getAttribute('form'); // перевірка на поставлену пташку

  if (document.getElementById(formId.slice(1)).querySelectorAll('input[type="checkbox"]:checked').length < 1) {
    elem.closest('.popup').querySelectorAll('.popup__validation-error')[0].classList.add('popup__validation-error_active');
    return;
  } // паревірка на непустий інпут


  if (+document.getElementById(formId.slice(1)).querySelector('.popup__make-deposit-amount-input').value < 1) {
    elem.closest('.popup').querySelectorAll('.popup__validation-error')[1].classList.add('popup__validation-error_active');
    return;
  }

  var terminal = document.querySelector('.popup__tab-header_active').dataset.terminal;
  var paySystem = 'none';

  if (document.getElementById(formId.slice(1)).querySelector('.popup__make-deposit-card-current .popup__make-deposit-card')) {
    paySystem = document.getElementById(formId.slice(1)).querySelector('.popup__make-deposit-card-current .popup__make-deposit-card').dataset.paysystem;
  }

  var amount = document.getElementById(formId.slice(1)).querySelector('.popup__make-deposit-amount-input').value;
  var currency = document.getElementById(formId.slice(1)).querySelector('select').value;
  var data = {
    terminal: terminal,
    paySystem: paySystem,
    amount: amount,
    currency: currency
  };
  ajaxPost('url', data, simpleClose, document.querySelector('.popup__make-deposit-btn')); // тут місце для ajax-запиту
  // --//--//--//--//--//--//-
  // це навісити на ajax-success
  // simpleClose(this);
} // валідація


var checkedArr = document.querySelectorAll('.popup__make-deposit-checkbox-wrapper input');
addOnEventToObject('change', checkedArr, checkValidate);

function checkValidate(elem) {
  if (elem.checked) {
    elem.closest('.popup').querySelectorAll('.popup__validation-error')[0].classList.remove('popup__validation-error_active');
  }
}

var depositInputs = document.querySelectorAll('.popup__make-deposit-amount-input');
addOnEventToObject('keyup', depositInputs, validateDepositInputs);

function validateDepositInputs(elem) {
  if (elem.value > 0) {
    elem.closest('.popup').querySelectorAll('.popup__validation-error')[1].classList.remove('popup__validation-error_active');
  }
}
/* ↑↑↑ /popup: make-deposit ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ SIMPLE CLOSE ↓↓↓


var closeBtns = document.querySelectorAll('.popup__close-btn');
addOnEventToObject('click', closeBtns, simpleClose); // ↑↑↑ SIMPLE CLOSE ↑↑↑
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ FUNCTIONS DECLARATION ↓↓↓

/**
 * [simpleClose закриває спливаюче вікно]
 * @param  {[event object or DOM object]} e [те, що вказує на потрібний попап]
 */

function simpleClose(e) {
  if (e.target) {
    e.target.closest('.popup').style.display = 'none';
  } else {
    e.closest('.popup').style.display = 'none';
  }

  document.getElementById('popups-wrapper').style.display = 'none';
}
/**
 * [openPopup відкриття попапів. У двох попапів є особливість - додаткові
 * передані параматри в псевдомасиві arguments]
 * @param  {[String]} elem [назва класу попапа]
 */


function openPopup(elem, context) {
  document.getElementById('popups-wrapper').style.display = 'block';
  document.querySelector(elem).style.display = 'block';

  if (elem == '.popup-trading-result') {
    var lang = document.getElementById('language-active').dataset.lang;

    if (lang == 'ru') {
      if (arguments[1] == 'buy') {
        document.getElementById('popup-result-direction').textContent = 'покупку';
      } else if (arguments[1] == 'sell') {
        document.getElementById('popup-result-direction').textContent = 'продажу';
      }
    } else if (lang == 'en') {
      if (arguments[1] == 'buy') {
        document.getElementById('popup-result-direction').textContent = 'buy';
      } else if (arguments[1] == 'sell') {
        document.getElementById('popup-result-direction').textContent = 'sell';
      }
    }

    document.getElementById('popup-result-pair').textContent = arguments[2];
    document.getElementById('popup-result-amount').textContent = arguments[3];
    document.getElementById('popup-result-profit').textContent = arguments[4];
  }

  if (elem == '.popup-bid-confirmation') {
    var _lang = document.getElementById('language-active').dataset.lang;

    if (_lang == 'ru') {
      if (arguments[1] == 'buy') {
        document.getElementById('popup-bid-direction').textContent = 'покупку';
      } else if (arguments[1] == 'sell') {
        document.getElementById('popup-bid-direction').textContent = 'продажу';
      }
    } else if (_lang == 'en') {
      if (arguments[1] == 'buy') {
        document.getElementById('popup-bid-direction').textContent = 'buy';
      } else if (arguments[1] == 'sell') {
        document.getElementById('popup-bid-direction').textContent = 'sell';
      }
    }

    document.getElementById('popup-bid-pair').textContent = arguments[2];
    document.getElementById('popup-bid-amount').textContent = arguments[3];
  }

  if (elem == '.popup-set-SL-TP') {
    var sl = context.dataset.sl;
    var tp = context.dataset.tp;
    var id = context.dataset.id;

    if (sl == 0) {
      document.getElementById('input-SL').style.display = 'block';
      document.getElementById('pseudo-input-SL').style.display = 'none';
    } else {
      document.getElementById('input-SL').style.display = 'none';
      document.getElementById('pseudo-input-SL').style.display = 'block';
      document.getElementById('pseudo-input-SL').innerHTML = sl;
    }

    if (tp == 0) {
      document.getElementById('input-TP').style.display = 'block';
      document.getElementById('pseudo-input-TP').style.display = 'none';
    } else {
      document.getElementById('input-TP').style.display = 'none';
      document.getElementById('pseudo-input-TP').style.display = 'block';
      document.getElementById('pseudo-input-TP').innerHTML = sl;
    }

    document.querySelector('.popup-set-SL-TP').setAttribute('data-id', id);
  }
} // ↑↑↑ FUNCTIONS DECLARATION ↑↑↑
////////////////////////////////////////////////////////////////////////////////


document.querySelector('.popup-set-SL-TP .popup__btn').onclick = function () {
  var popup = event.target.closest('.popup.popup-set-SL-TP');
  var id = popup.dataset.id;
  var sl = popup.querySelector('#input-SL').value || popup.querySelector('#pseudo-input-SL').innerHTML;
  var tp = popup.querySelector('#input-TP').value || popup.querySelector('#pseudo-input-TP').innerHTML;
  console.log('click', sl, tp, id); //////////
};
"use strict"; // scrollTable-fixHeader module
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ прокрутка таблиці при фіксованому положенні шапки в info-area ↓↓↓ */

var scrollTables = document.querySelectorAll('.js-scroll-table-wrapper'); // навішування обробника через цикл, з передачею контексту

for (var i = 0; i < scrollTables.length; i++) {
  (function (n, domobj) {
    scrollTables[n].onscroll = function () {
      scrollTableHandler(domobj);
    };
  })(i, scrollTables[i]);
}
/**
 * [scrollTableHandler встановлює зміщення шапки таблиці
 *                     відповідно до прокрутки талиці]
 * @param  {[DOM-object]} eventTarget [прокручувана обгортка таблиці]
 */


function scrollTableHandler(eventTarget) {
  var scrollTop = eventTarget.scrollTop;
  eventTarget.querySelector('thead').style.transform = 'translateY(' + (scrollTop - 1) + 'px)';
}
/* ↑↑↑ /прокрутка таблиці при фіксованому положенні шапки в info-area */
////////////////////////////////////////////////////////////////////////////////
"use strict"; // tab module
////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ переключення вкладок ↓↓↓ */

document.addEventListener('click', switchTab);
/**
 * [switchTab переключає вкладки]
 * @param  {[object]} event [об'єкт події]
 */

function switchTab(event) {
  if (!event.target.classList.contains('tab-header') || event.target.classList.contains('tab-header_active')) return;
  var tab = event.target.closest('.tab-header');
  var dataAttr = tab.dataset.tab;
  var grandParent = tab.closest('.tab-area');
  grandParent.querySelector('.tab-body_active').classList.remove('tab-body_active');
  grandParent.querySelector('.tab-header_active').classList.remove('tab-header_active');
  event.target.classList.add('tab-header_active');
  grandParent.querySelector('.tab-body[data-tab="' + dataAttr + '"]').classList.add('tab-body_active');
}
/* ↑↑↑ /переключення вкладок ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////