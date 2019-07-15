'use strict';

var lang = $('.language-switcher:eq(0)').attr('data-lang');
var dictionaryPopups = {
  infoPopupHeader: {
    en: 'Аttention!',
    ru: 'Внимание!'
  },
  incomingMessageHeader: {
    en: 'New message',
    ru: 'Новое сообщение'
  },
  depositConfirmationHeader: {
    en: 'Deposit confirmation',
    ru: 'Подтверждение депозита'
  },
  bitConfirmationHeader: {
    en: 'Bit confirmation',
    ru: 'Подтверждение ставки'
  },
  tradingResultHeaderWin: {
    en: 'You win!',
    ru: 'Выигрыш!'
  },
  tradingResultHeaderLose: {
    en: 'You lose...',
    ru: 'Проигрыш...'
  },
  writeMessageHeader: {
    en: 'Write message',
    ru: 'Написать сообщение'
  },
  changePasswordHeader: {
    en: 'Change password',
    ru: 'Сменить пароль'
  },
  withdrawalConfirmationHeader: {
    en: 'Withdrawal confirmation',
    ru: 'Подтверждение вывода'
  },
  profileEditorHeader: {
    en: 'Profile editor',
    ru: 'Редактор профиля'
  },
  makeDepositHeader: {
    en: 'make deposit`',
    ru: 'Сделать депозит'
  },
  depositConfirmationText: {
    en: 'Do you really want to make a deposit of ',
    ru: 'Вы точно хотите сделать депозит на '
  },
  closeWarning: {
    en: 'If you change your mind, just click on the cross in the upper right corner.',
    ru: 'Если передумали, просто нажмите на крестик в правом верхнем углу.'
  },
  bitConfirmationText1: {
    en: 'You definitely want to make a bet of ',
    ru: 'Вы точно хотите сделать ставку в размере '
  },
  bitConfirmationText2: {
    en: ' for ',
    ru: ' на '
  },
  bitConfirmationText3: {
    en: ' for a pair of ',
    ru: ' для пары '
  },
  closeBtn: {
    en: 'close',
    ru: 'закрыть'
  },
  up: {
    en: 'up',
    ru: 'вверх'
  },
  up1: {
    en: 'appreciation',
    ru: 'повышение'
  },
  down: {
    en: 'down',
    ru: 'вниз'
  },
  down1: {
    en: 'drop',
    ru: 'падение'
  },
  depositConfirmationBtn: {
    en: 'make a deposit',
    ru: 'сделать депозит'
  },
  bidConfirmationPopupBtn: {
    en: 'place a bet',
    ru: 'сделать ставку'
  },
  sendBtn: {
    en: 'send a message',
    ru: 'отправить'
  },
  saveBtn: {
    en: 'save',
    ru: 'сохранить'
  },
  writeMessageText1: {
    en: 'subject',
    ru: 'тема'
  },
  writeMessageText2: {
    en: 'message',
    ru: 'сообщение'
  },
  changePasswordText1: {
    en: 'Password:',
    ru: 'Пароль:'
  },
  changePasswordText2: {
    en: 'enter password',
    ru: 'введите пароль'
  },
  changePasswordText3: {
    en: 'Repeat password:',
    ru: 'Повтор пароля:'
  },
  changePasswordText4: {
    en: 'repeat password',
    ru: 'повторите пароль'
  },
  withdrawalConfirmationText: {
    en: 'enter amount',
    ru: 'введите сумму'
  },
  createBtn: {
    en: 'create',
    ru: 'создать'
  },
  profileEditorText1: {
    en: 'first name: ',
    ru: 'имя: '
  },
  profileEditorText2: {
    en: 'enter first name',
    ru: 'введите имя'
  },
  profileEditorText3: {
    en: 'last name',
    ru: 'фамилия:'
  },
  profileEditorText4: {
    en: 'enter last name',
    ru: 'введите фамилию'
  },
  profileEditorText5: {
    en: 'gender:',
    ru: 'пол:'
  },
  profileEditorText6: {
    en: 'male',
    ru: 'мужской'
  },
  profileEditorText7: {
    en: 'female',
    ru: 'женский'
  },
  profileEditorText8: {
    en: 'not specified',
    ru: 'не указан'
  },
  terminal: {
    en: 'terminal',
    ru: 'терминал'
  },
  makeDepositText1: {
    en: 'I turned 18 years old. I am familiar with the risks and accept',
    ru: 'Мне исполнилось 18 лет. Я ознакомлен с рисками и принимаю'
  },
  makeDepositText2: {
    en: 'Terms and Conditions',
    ru: 'Условия и Соглашения'
  },
  makeDepositText3: {
    en: 'of the company',
    ru: 'компании'
  },
  payBtn: {
    en: 'pay',
    ru: 'оплатить'
  },
  valpass1: {
    en: 'Password must contain at least 8 characters. Must have at least one number and letter.',
    ru: 'Пароль должен содержать не менее 8 символов. Обязательно наличие минимум одной цифры и одной буквы.'
  },
  valpass2: {
    en: 'Passwords do not match.',
    ru: 'Пароли не совпадают.'
  }
};

function showInfoPopup(text) {
  $('#popups-wrapper').append('<div class="popup showInfoPopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + dictionaryPopups.infoPopupHeader[lang] + '</h5>\
                                    <p class="popup__text">' + text + '</p>\
                                  </div>\
                                  <div class="popup__footer">\
                                    <button class="popup__btn" onclick="closePopup(this)">' + dictionaryPopups.closeBtn[lang] + '</button>\
                                  </div>\
                                </div>');
  showPopup($('.showInfoPopup')[0]);
}

function showIncomingMessagePopup(text, author) {
  $('#popups-wrapper').append('<div class="popup showIncomingMessagePopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + dictionaryPopups.incomingMessageHeader[lang] + '</h5>\
                                    <p class="popup__text">' + text + '</p>\
                                    <p class="popup__author">' + author + '</p>\
                                  </div>\
                                  <div class="popup__footer">\
                                    <button class="popup__btn" onclick="closePopup(this)">' + dictionaryPopups.closeBtn[lang] + '</button>\
                                  </div>\
                                </div>');
  showPopup($('.showIncomingMessagePopup')[0]);
}

function showDepositConfirmationPopup(text) {
  $('#popups-wrapper').append('<div class="popup showDepositConfirmationPopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + dictionaryPopups.depositConfirmationHeader[lang] + '</h5>\
                                    <p class="popup__text">' + dictionaryPopups.depositConfirmationText[lang] + text + '?</p>\
                                    <p class="popup__text">' + dictionaryPopups.closeWarning[lang] + '</p>\
                                  </div>\
                                  <div class="popup__footer">\
                                    <button class="popup__btn" onclick="">' + dictionaryPopups.depositConfirmationBtn[lang] + '</button>\
                                  </div>\
                                </div>');
  showPopup($('.showDepositConfirmationPopup')[0]);
}

function showBidConfirmationPopup(amount, direction, time, pair) {
  var dir;

  if (direction == 'up') {
    dir = dictionaryPopups.up[lang];
  } else if (direction == 'down') {
    dir = dictionaryPopups.down[lang];
  }

  $('#popups-wrapper').append('<div class="popup showBidConfirmationPopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + dictionaryPopups.bitConfirmationHeader[lang] + '</h5>\
                                    <p class="popup__text">' + dictionaryPopups.bitConfirmationText1[lang] + amount + ' ' + dir + dictionaryPopups.bitConfirmationText2[lang] + time + dictionaryPopups.bitConfirmationText3[lang] + pair + '?</p>\
                                    <p class="popup__text">' + dictionaryPopups.closeWarning[lang] + '</p>\
                                  </div>\
                                  <div class="popup__footer">\
                                    <button class="popup__btn" onclick="">' + dictionaryPopups.bidConfirmationPopupBtn[lang] + '</button>\
                                  </div>\
                                </div>');
  showPopup($('.showBidConfirmationPopup')[0]);
}

function showTradingResultPopup(amount, direction, time, pair, result, resultAmount) {
  var res;

  if (result == 'win') {
    res = dictionaryPopups.tradingResultHeaderWin[lang];
  } else if (result == 'lose') {
    res = dictionaryPopups.tradingResultHeaderLose[lang];
  }

  var dir;

  if (direction == 'up') {
    dir = dictionaryPopups.up1[lang];
  } else if (direction == 'down') {
    dir = dictionaryPopups.down1[lang];
  }

  var text;

  if (lang == 'ru') {
    text = "\u0421\u0434\u0435\u043B\u0430\u043D\u043D\u0430\u044F \u0412\u0430\u043C\u0438 \u0441\u0442\u0430\u0432\u043A\u0430 \u043D\u0430 ".concat(dir, " \u043A\u0443\u0440\u0441\u0430 \u043F\u0430\u0440\u044B ").concat(pair, " \u043D\u0430 \u0432\u0440\u0435\u043C\u044F ").concat(time, " \u0432 \u0440\u0430\u0437\u043C\u0435\u0440\u0435 ").concat(amount, " \u0437\u0430\u043A\u0440\u044B\u043B\u0430\u0441\u044C. \u0412\u0430\u0448 \u0432\u044B\u0438\u0433\u0440\u044B\u0448 \u0441\u043E\u0441\u0442\u0430\u0432\u0438\u043B ").concat(resultAmount, ".");
  } else {
    text = "Your bet on the ".concat(pair, " pair ").concat(dir, " for ").concat(time, " in size ").concat(amount, " closed. Your winnings are ").concat(resultAmount, ".");
  }

  $('#popups-wrapper').append('<div class="popup showTradingResultPopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + res + '</h5>\
                                    <p class="popup__text">' + text + '</p>\
                                  </div>\
                                  <div class="popup__footer">\
                                    <button class="popup__btn" onclick="closePopup(this)">' + dictionaryPopups.closeBtn[lang] + '</button>\
                                  </div>\
                                </div>');
  showPopup($('.showTradingResultPopup')[0]);
}

function showWriteMessagePopup() {
  $('#popups-wrapper').append('<div class="popup showWriteMessagePopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + dictionaryPopups.writeMessageHeader[lang] + '</h5>\
                                    <form class="popup__write-message" id="f1" action="#" method="#" name="message-to-mentor">\
                                      <input class="popup__write-message-subject" type="text" placeholder="' + dictionaryPopups.writeMessageText1[lang] + '">\
                                      <textarea class="popup__write-message-text" placeholder="' + dictionaryPopups.writeMessageText2[lang] + '"></textarea>\
                                    </form>\
                                  </div>\
                                  <div class="popup__footer">\
                                    <button class="popup__btn" form="f1" onclick="">' + dictionaryPopups.sendBtn[lang] + '</button>\
                                  </div>\
                                </div>');
  showPopup($('.showWriteMessagePopup')[0]);
}

function showChangePasswordPopup() {
  $('#popups-wrapper').append('<div class="popup showChangePasswordPopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + dictionaryPopups.changePasswordHeader[lang] + '</h5>\
                                    <form class="popup__change-password" id="f2" action="#" method="#" name="change-pass")\
                                      <label class="popup__label" for="input-password">' + dictionaryPopups.changePasswordText1[lang] + '</label>\
                                      <div class="popup__input-wrapper">\
                                        <input class="popup__password" id="input-password" type="password" name="input-password" placeholder="' + dictionaryPopups.changePasswordText2[lang] + '" onkeyup="validationChangePasswordLive(this)">\
                                        <span class="popup__show-hide-pass" onclick="showHidePass(this)">\
                                          <i class="fas fa-eye-slash"></i>\
                                        </span>\
                                      </div>\
                                      <label class="popup__label" for="input-confirm-pass")>' + dictionaryPopups.changePasswordText3[lang] + '</label>\
                                      <div class="popup__input-wrapper">\
                                        <input class="popup__password" id="input-confirm-pass" type="password" name="input-confirm-pass" placeholder="' + dictionaryPopups.changePasswordText4[lang] + '" onkeyup="validationChangePasswordLive(this)">\
                                        <span class="popup__show-hide-pass" onclick="showHidePass(this)">\
                                          <i class="fas fa-eye-slash"></i>\
                                        </span>\
                                      </div>\
                                    </form>\
                                  </div>\
                                  <div class="popup__footer">\
                                    <button class="popup__btn" form="f2" type="button" onclick="validationChangePasswordOnBtnClick(this)">' + dictionaryPopups.saveBtn[lang] + '</button>\
                                  </div>\
                                </div>');
  showPopup($('.showChangePasswordPopup')[0]);
}

function showWithdrawalConfirmationPopup() {
  $('#popups-wrapper').append('<div class="popup showWithdrawalConfirmationPopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + dictionaryPopups.withdrawalConfirmationHeader[lang] + '</h5>\
                                    <form class="popup__withdrawal-form" id="f3" action="#" method="#" name="withdrawal-form">\
                                      <input class="popup__withdrawal-input" type="text" name="currencyValue" placeholder="' + dictionaryPopups.withdrawalConfirmationText[lang] + '">\
                                      <select class="popup__withdrawal-select" name="currency">\
                                        <option value="USD">USD</option>\
                                        <option value="EUR">EUR</option>\
                                        <option value="RUB">RUB</option>\
                                      </select>\
                                    </form>\
                                  </div>\
                                  <div class="popup__footer">\
                                    <button class="popup__btn" form="f3" onclick="">' + dictionaryPopups.createBtn[lang] + '</button>\
                                  </div>\
                                </div>');
  showPopup($('.showWithdrawalConfirmationPopup')[0]);
}

function showProfileEditorPopup() {
  $('#popups-wrapper').append('<div class="popup showProfileEditorPopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + dictionaryPopups.profileEditorHeader[lang] + '</h5>\
                                    <form class="popup__profile-editor-form" id="f4" action="#" method="#" name="profile-editor-form">\
                                      <label class="popup__label" for="input-profile-аname">' + dictionaryPopups.profileEditorText1[lang] + '</label>\
                                      <input class="popup__profile-editor-input" id="input-profile-fname" type="text" name="input-lname" placeholder="' + dictionaryPopups.profileEditorText2[lang] + '">\
                                      <label class="popup__label" for="input-profile-lname">' + dictionaryPopups.profileEditorText3[lang] + '</label>\
                                      <input class="popup__profile-editor-input" id="input-profile-lname" type="text" name="input-lname" placeholder="' + dictionaryPopups.profileEditorText4[lang] + '">\
                                      <label class="popup__label">' + dictionaryPopups.profileEditorText5[lang] + '</label>\
                                      <div class="popup__profile-editor-gender">\
                                        <input class="popup__profile-editor-radio-input" type="radio" name="gender" value="male">' + dictionaryPopups.profileEditorText6[lang] + '\
                                        <input class="popup__profile-editor-radio-input" type="radio" name="gender" value="female">' + dictionaryPopups.profileEditorText7[lang] + '\
                                        <input class="popup__profile-editor-radio-input" type="radio" name="gender" value="none" checked="">' + dictionaryPopups.profileEditorText8[lang] + '\
                                      </div>\
                                    </form>\
                                  </div>\
                                  <div class="popup__footer">\
                                    <button class="popup__btn" form="f4" onclick="">' + dictionaryPopups.saveBtn[lang] + '</button>\
                                  </div>\
                                </div>');
  showPopup($('.showProfileEditorPopup')[0]);
}

function showMakeDepositPopup() {
  $('#popups-wrapper').append('<div class="popup showMakeDepositPopup">\
                                  <div class="popup__head">\
                                    <img src="assets/img/trends.png", alt="trends.png">\
                                    <img class="popup__close-img" src="assets/img/cancel.png", alt="cancel.png" onclick="closePopup(this)">\
                                  </div>\
                                  <div class="popup__body">\
                                    <h5 class="popup__header">' + dictionaryPopups.makeDepositHeader[lang] + '</h5>\
                                    <form class="popup__make-deposit-form" action="#" method="#" name="make-deposit-form">\
                                      <div class="popup__terminals-wrapper">\
                                        <label>\
                                          <input class="popup__make-deposit-radio-input" type="radio" name="terminal" value="1" checked="">\
                                          <span>' + dictionaryPopups.terminal[lang] + ' 1</span>\
                                        </label>\
                                        <label>\
                                          <input class="popup__make-deposit-radio-input" type="radio" name="terminal" value="2">\
                                          <span>' + dictionaryPopups.terminal[lang] + ' 2</span>\
                                        </label>\
                                        <label>\
                                          <input class="popup__make-deposit-radio-input" type="radio" name="terminal" value="3">\
                                          <span>' + dictionaryPopups.terminal[lang] + ' 3</span>\
                                        </label>\
                                      </div>\
                                      <label class="popup__checkbox-wrapper">\
                                      <input type="checkbox" name="age18+" value="true">\
                                      <span>' + dictionaryPopups.makeDepositText1[lang] + '\
                                        <a href="#">' + dictionaryPopups.makeDepositText2[lang] + '</a>\
                                        ' + dictionaryPopups.makeDepositText3[lang] + '.\
                                      </span>\
                                      </label>\
                                      <div class="popup__make-deposit-amount-wrapper">\
                                        <input class="popup__make-deposit-amount-input" type="text" placeholder="' + dictionaryPopups.withdrawalConfirmationText[lang] + '" name="currencyValue">\
                                        <select class="popup__make-deposit-select" name="currency">\
                                          <option value="USD">USD</option>\
                                          <option value="EUR">EUR</option\
                                          <option value="RUB">RUB</option>\
                                        </select>\
                                        <button class="popup__make-deposit-btn">' + dictionaryPopups.payBtn[lang] + '</button>\
                                      </div>\
                                    </form>\
                                  </div>\
                                  <div class="popup__footer">\
                                  </div>\
                                </div>');
  showPopup($('.showMakeDepositPopup')[0]);
}

function closePopup(THIS) {
  // визначаємо, чи відкриті ще інші попапи, якщо так - зсуваємо ті, що нижче
  var popups = $('.popup');

  if (popups.length <= 1) {
    $(THIS).parents('.popup').remove();
    $('#popups-wrapper').css('display', 'none');
  } else {
    for (var i = 0; i < popups.length; i++) {
      if (popups[i] == $(THIS).parents('.popup')[0]) {
        var elemHeight = $($(THIS).parents('.popup')[0]).outerHeight();

        for (var j = 0; j < i; j++) {
          var temptop = getCoords(popups[j]).top - elemHeight - 30 + 'px';
          $(popups[j]).css('top', temptop);
        }

        $(THIS).parents('.popup').remove();
        return;
      }
    }
  }
}

;

function showPopup(elem) {
  // робимо видимою область попапів
  $('#popups-wrapper').css('display', 'block'); // піднімаємо сторінку на самий верх

  document.documentElement.scrollTop = 0; // припасовуємо елемент до верхнього краю за областю видимості

  var elemHeight = $(elem).outerHeight();
  $(elem).css('top', '-' + elemHeight + 'px'); // перевіряємо, чи є уже показувані попапи, якщо є - посуваїмо їх

  var popups = $('.popup');

  if (popups.length <= 1) {
    $(elem).css({
      'top': '10px',
      'transition': 'top .5s'
    });
  } else {
    for (var i = 0; i < popups.length; i++) {
      if (getCoords(popups[i]).top >= 0) {
        var temptop = getCoords(popups[i]).top + elemHeight + 30 + 'px';
        $(popups[i]).css('top', temptop);
      }
    }
  }

  $(elem).css({
    'top': '20px',
    'transition': 'top .5s'
  });
}

function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    bottom: box.bottom + pageYOffset,
    left: box.left + pageXOffset,
    right: box.right + pageXOffset,
    height: box.bottom - box.top,
    width: box.right - box.left
  };
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function validationChangePasswordOnBtnClick(elem) {
  // валідація паролів при кліку на кнопку форми
  var firstInputValue = $(elem).parents('.popup').find('.popup__password:eq(0)').val(); // валідація паролю на довжину, наявність букв і цифр

  var tempPassArr = firstInputValue.split('');
  var tempCount = 0;

  for (var i = 0; i < tempPassArr.length; i++) {
    if (isNumeric(tempPassArr[i])) {
      tempCount++;
    }
  } // якщо символів менше 8, якщо лише цифри, якщо лише букви


  if (firstInputValue.length < 8 || firstInputValue.length == tempCount || tempCount == 0) {
    // якщо на помилку уже вказано - вийти
    if ($(elem).parents('.popup').attr('data-error') == 'true') return; // підсвітка input'а та фокус

    $(elem).parents('.popup').find('.popup__password:eq(0)').parent().css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    }).focus(); // показати повідомлення про помилку, вийти

    $(elem).parents('.popup').attr('data-error', 'true');
    $(elem).parents('.popup').find('.popup__body').append('<p class="validation-error">' + dictionaryPopups.valpass1[lang] + '</p>');
    return;
  } // валідація паролів на однаковість


  var secondInputValue = $(elem).parents('.popup').find('.popup__password:eq(1)').val();

  if (firstInputValue != secondInputValue) {
    // якщо на помилку уже вказано - вийти
    if ($(elem).parents('.popup').attr('data-error') == 'true') return; // підсвітка input'а та фокус

    $(elem).parents('.popup').find('.popup__password:eq(0)').parent().css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    });
    $(elem).parents('.popup').find('.popup__password:eq(1)').parent().css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    }).focus(); // показати повідомлення, вийти
    // показати повідомлення про помилку, вийти

    $(elem).parents('.popup').attr('data-error', 'true');
    $(elem).parents('.popup').find('.popup__body').append('<p class="validation-error">' + dictionaryPopups.valpass2[lang] + '</p>');
    return;
  }

  console.log('паролі однакові, їх можна відправляти на сервер');
  closePopup(elem);
}

function validationChangePasswordLive(elem) {
  // валідація пароля при введенні пароля
  // якщо помилки ще не було - вийти
  if ($(elem).parents('.popup').attr('data-error') != 'true') return; // валідація паролю на довжину, наявність букв і цифр

  var firstInputValue = $(elem).parents('.popup').find('.popup__password:eq(0)').val();
  var secondInputValue = $(elem).parents('.popup').find('.popup__password:eq(1)').val();
  var tempPassArr = firstInputValue.split('');
  var tempCount = 0;

  for (var i = 0; i < tempPassArr.length; i++) {
    if (isNumeric(tempPassArr[i])) {
      tempCount++;
    }
  } // якщо пароль коректний, прибрати повідомлення


  if (firstInputValue.length >= 8 && firstInputValue.length != tempCount && tempCount != 0) {
    $(elem).parents('.popup').find('.popup__password:eq(0)').parent().css({
      'box-shadow': 'none',
      'border-color': 'transparent'
    });
    $(elem).parents('.popup').find('.validation-error').remove();
    $(elem).parents('.popup').attr('data-error', 'false');
  } // якщо паролі однакові - прибрати повідомлення


  if (firstInputValue == secondInputValue) {
    $(elem).parents('.popup').find('.popup__password:eq(0)').parent().css({
      'box-shadow': 'none',
      'border-color': 'transparent'
    });
    $(elem).parents('.popup').find('.popup__password:eq(1)').parent().css({
      'box-shadow': 'none',
      'border-color': 'transparent'
    });
    $(elem).parents('.popup').find('.validation-error').remove();
    $(elem).parents('.popup').attr('data-error', 'false');
  } else {
    if ($(elem).parents('.popup').attr('data-error') != 'true') {
      $(elem).parents('.popup').attr('data-error', 'true');
      $(elem).parents('.popup').find('.popup__password:eq(1)').parent().css({
        'box-shadow': '0 0 5px red',
        'border-color': 'red'
      }).focus();
      $(elem).parents('.popup').find('.popup__body').append('<p class="validation-error">' + dictionaryPopups.valpass2[lang] + '</p>');
    }
  }
}

function showHidePass(THIS) {
  // показує/приховує пароль при кліку по оку
  if ($(THIS).siblings('.popup__password').attr('type') == 'password') {
    $(THIS).siblings('.popup__password').attr('type', 'text');
    $(THIS).children('svg').removeClass('fa-eye-slash').addClass('fa-eye');
  } else {
    $(THIS).siblings('.popup__password').attr('type', 'password');
    $(THIS).children('svg').removeClass('fa-eye').addClass('fa-eye-slash');
  }
} // /* ↓↓↓ phone input - only for numbers ↓↓↓ */
// $('#input-phone').keypress(function(e){
//   e = e || event;
//   if (e.ctrlKey || e.altKey || e.metaKey) return;
//   var chr = getChar(e);
//   if (chr == null) return;
//   if (chr < '0' || chr > '9') {
//     return false;
//   }
//   function getChar(event) {
//     if (event.which == null) {
//       if (event.keyCode < 32) return null;
//       return String.fromCharCode(event.keyCode) // IE
//     }
//     if (event.which != 0 && event.charCode != 0) {
//       if (event.which < 32) return null;
//       return String.fromCharCode(event.which) // остальные
//     }
//     return null; // специальная клавиша
//   }
// });
// /* ↑↑↑ /phone input - only for numbers ↑↑↑ */