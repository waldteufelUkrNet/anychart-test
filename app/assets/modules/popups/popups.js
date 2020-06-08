"use strict";
// popups module

////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: info ↓↓↓ */
  document.querySelector('.popup-info .popup__btn')
          .addEventListener('click', simpleClose);
/* ↑↑↑ /popup: info ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: incoming message ↓↓↓ */
  document.querySelector('.popup-incoming-message .popup__btn')
          .addEventListener('click', simpleClose);
/* ↑↑↑ /popup: incoming message ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: deposit confirmation ↓↓↓ */
  document.querySelector('.popup-deposit-confirmation .popup__btn')
          .addEventListener('click', simpleClose);
/* ↑↑↑ /popup: deposit confirmation ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: bid confirmation ↓↓↓ */
  document.querySelectorAll('.buy-sell-btns__btn')[0].onclick = function(){
    let pair = document.querySelector('#content .tab-header_active').dataset.tab;
    let amount = document.getElementById('lot').value;
    openPopup('.popup-bid-confirmation', 'sell', pair, amount);
  }

  document.querySelectorAll('.buy-sell-btns__btn')[1].onclick = function(){
    let pair = document.querySelector('#content .tab-header_active').dataset.tab;
    let amount = document.getElementById('lot').value;
    openPopup('.popup-bid-confirmation', 'buy', pair, amount);
  }

  document.querySelector('.popup-bid-confirmation .popup__btn')
          .addEventListener('click', simpleClose);
/* ↑↑↑ /popup: bid confirmation ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: trading result ↓↓↓ */
  document.querySelector('.popup-trading-result .popup__btn')
          .addEventListener('click', simpleClose);
/* ↑↑↑ /popup: trading result ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: validation data ↓↓↓ */
  let arrOfInputs = document.querySelectorAll('.popup-verification__input');
  document.querySelector('.popup-verification .popup__btn').onclick = function() {
    simpleClose(this);
  }

  // обробка input'ів
  addOnEventToObject('change', arrOfInputs, documentPreloading);
  function documentPreloading(){
    let id = event.target.getAttribute('id');
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
                  success: function (result) {
                      if (result == "1") {

                          // загрузка прошла успешно
                          $('#' + namefile).after('<p style="padding:6px; border: 1px solid grey">completed</p>');
                          $('#' + namefile).remove();
                      } else {
                          $('#' + namefile).val("");
                      }
                  },
                  error: function () {
                      $('#' + namefile).val("");
                  }
              });
          } else {
              alert("Браузер не поддерживает загрузку файлов HTML5!");
          }
      }
  };
/* ↑↑↑ /popup: validation data ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: write message ↓↓↓ */
  document.querySelector('.popup-write-message .popup__btn').onclick = function() {
    let message = document.querySelector('.popup-write-message .popup__write-message-text').value;
    if ( message.length < 6 ) {
      this.closest('.popup').querySelectorAll('.popup__validation-error')[0]
                            .classList.add('popup__validation-error_active');
      return
    }
    // ajax
    ajaxPost('url', message, simpleClose, this);
    // тут місце для ajax-запиту
    // --//--//--//--//--//--//-
    // це навісити на ajax-success
    // simpleClose(this);
  }

  // валідація довжини повідомлення
  document.querySelector('.popup-write-message .popup__write-message-text').onkeyup = function() {
    let message = document.querySelector('.popup-write-message .popup__write-message-text').value;
    if ( message.length >= 6 ) {
      this.closest('.popup').querySelectorAll('.popup__validation-error')[0]
                          .classList.remove('popup__validation-error_active');
    }
  }
/* ↑↑↑ /popup: write message ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: change password ↓↓↓ */
  // показ/приховування паролю при кліку по оку
  let eyesBtns = document.querySelectorAll('.popup__show-hide-pass');
  addOnEventToObject('click', eyesBtns, hideShowPass)

  function hideShowPass(elem) {
    let inputType = elem.closest('.popup__input-wrapper')
                        .querySelector('.popup__password')
                        .getAttribute('type');
    if (inputType == 'password') {
      elem.closest('.popup__input-wrapper')
          .querySelector('.popup__password')
          .setAttribute('type','text');
      elem.querySelector('.eye_show').style.display = 'block';
      elem.querySelector('.eye_hide').style.display = 'none';
    } else {
      elem.closest('.popup__input-wrapper')
          .querySelector('.popup__password')
          .setAttribute('type','password');
      elem.querySelector('.eye_show').style.display = 'none';
      elem.querySelector('.eye_hide').style.display = 'block';
    }
  }

  // клік на кнопку: валідація паролів, ajax-запит на сервер, закриття попапа
  document.querySelector('.popup-change-pass .popup__btn').onclick = function(event) {
    let password = document.getElementById('input-password').value;
    if ( password.length < 6 ) {
      event.target.closest('.popup')
                  .querySelectorAll('.popup__validation-error')[0]
                  .classList.add('popup__validation-error_active');
      return;
    }

    let repeat = document.getElementById('input-confirm-pass').value;
    if ( password != repeat ) {
      event.target.closest('.popup')
                  .querySelectorAll('.popup__validation-error')[1]
                  .classList.add('popup__validation-error_active');
      return;
    }
    ajaxPost('url', password, simpleClose, this);
    // тут місце для ajax-запиту
    // --//--//--//--//--//--//-
    // це навісити на ajax-success
    // simpleClose(this);
  }

  // валідація довжини паролю
  document.getElementById('input-password').onkeyup = function() {
    let password = this.value;
    if ( password.length >= 6 ) {
      this.closest('.popup').querySelectorAll('.popup__validation-error')[0]
                            .classList.remove('popup__validation-error_active');
    }
  };

  // валідація на співпадіння паролів
  document.getElementById('input-confirm-pass').onkeyup = function() {
    let password = document.getElementById('input-password').value;
    let repeat   = this.value;
    if ( password == repeat ) {
      this.closest('.popup').querySelectorAll('.popup__validation-error')[1]
                            .classList.remove('popup__validation-error_active');
    }
  };
/* ↑↑↑ /popup: change password ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: wihtdrawal confirmation ↓↓↓ */
  document.querySelector('.popup-withdrawal-confirm .popup__btn').onclick = function(event) {
    let value = document.querySelector('.popup__withdrawal-input').value;
    if (+value <= 0) {
      this.closest('.popup').querySelectorAll('.popup__validation-error')[0]
                            .classList.add('popup__validation-error_active');
      return
    }
    let currency = document.querySelector('.popup__withdrawal-select').value;

    let data = {
      value    : value,
      currency : currency
    };

    ajaxPost('url', data, simpleClose, this);
    // тут місце для ajax-запиту
    // --//--//--//--//--//--//-
    // це навісити на ajax-success
    // simpleClose(this);
  }
/* ↑↑↑ /popup: wihtdrawal confirmation ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: profile editor ↓↓↓ */
  document.querySelector('.popup-profile-editor .popup__btn').onclick = function() {
    let fname  = document.getElementById('input-profile-fname').value;
    if (fname.length < 2) {
      this.closest('.popup').querySelectorAll('.popup__validation-error')[0]
                            .classList.add('popup__validation-error_active');
      return;
    }

    let lname  = document.getElementById('input-profile-lname').value;
    if (lname.length < 2) {
      this.closest('.popup').querySelectorAll('.popup__validation-error')[1]
                            .classList.add('popup__validation-error_active');
      return;
    }

    let gender = document.querySelector('.popup__profile-editor-radio-input:checked').value;

    let data = {
      fname  : fname,
      lname  : lname,
      gender : gender
    }
    ajaxPost('url', data, simpleClose, this);
    // тут місце для ajax-запиту
    // --//--//--//--//--//--//-
    // це навісити на ajax-success
    // simpleClose(this);
  };

  // валідація
  document.getElementById('input-profile-fname').onkeyup = function() {
    let fname = this.value;
    if ( fname.length >= 2 ) {
      this.closest('.popup').querySelectorAll('.popup__validation-error')[0]
                            .classList.remove('popup__validation-error_active');
    }
  };

  document.getElementById('input-profile-lname').onkeyup = function() {
    let lname = this.value;
    if ( lname.length >= 2 ) {
      this.closest('.popup').querySelectorAll('.popup__validation-error')[1]
                            .classList.remove('popup__validation-error_active');
    }
  };
/* ↑↑↑ /popup: profile editor ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ popup: make-deposit ↓↓↓ */
  // toggle tabs with forms
  let tabs = document.querySelectorAll('.popup__tab-header');
  addOnEventToObject('click', tabs, toggleForms);
  function toggleForms(elem) {
    // скидання вибраних опцій
    document.querySelector('#mdf1 .popup__make-deposit-amount-input').value = '';
    document.querySelector('#mdf2 .popup__make-deposit-amount-input').value = '';

    document.querySelector('#mdf1 input[type="checkbox"]').checked = false;
    document.querySelector('#mdf2 input[type="checkbox"]').checked = false;

    document.querySelectorAll('.popup-make-deposit .popup__validation-error')[0]
            .classList.remove('popup__validation-error_active');
    document.querySelectorAll('.popup-make-deposit .popup__validation-error')[1]
            .classList.remove('popup__validation-error_active');

    let formNumber = elem.dataset.terminal;
    let tabs       = document.querySelectorAll('.popup__tab-header');
    let forms      = document.querySelectorAll('.popup__make-deposit-form');
    let buttons    = document.querySelectorAll('.popup__make-deposit-btn');

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('popup__tab-header_active');
      forms[i].classList.remove('popup__make-deposit-form_active');
      buttons[i].classList.remove('popup__make-deposit-btn_active');
    }
    elem.classList.add('popup__tab-header_active');
    document.querySelector('.popup__make-deposit-form[data-terminal="'
                            + formNumber
                            + '"]')
            .classList.add('popup__make-deposit-form_active');
    document.querySelector('.popup__make-deposit-btn[data-terminal="'
                            + formNumber
                            + '"]')
            .classList.add('popup__make-deposit-btn_active');
  }

  // bankcards list toggle
  let isBankCardsListOpen = false;
  document.querySelector('.popup__make-deposit-card-pseudoselect').onclick = function() {
    if (!isBankCardsListOpen) {
      document.querySelector('.popup__make-deposit-cards-wrapper')
              .style.display = 'block';
    } else {
      document.querySelector('.popup__make-deposit-cards-wrapper')
              .style.display = 'none';
    }
    isBankCardsListOpen = !isBankCardsListOpen;
  }

  // bankcards selection
  let bankCardsObj = document.querySelectorAll('.popup__make-deposit-cards-wrapper span.popup__make-deposit-card');
  addOnEventToObject('click', bankCardsObj, selectBankCard);
  function selectBankCard (elem) {
    document.querySelector('.popup__make-deposit-card-current span')
            .innerHTML = elem.innerHTML;
    document.querySelector('.popup__make-deposit-card-current span')
            .setAttribute('data-paySystem', elem.dataset.paysystem);
  }

  // валідація та відправка форми
  let formButtons    = document.querySelectorAll('.popup__make-deposit-btn');
  addOnEventToObject('click', formButtons, sendDepositForm);

  function sendDepositForm(elem) {
    console.log("elem", elem);
    let formId = elem.getAttribute('form');

    // перевірка на поставлену пташку
    if( document.getElementById( formId.slice(1) )
                .querySelectorAll('input[type="checkbox"]:checked').length < 1 ) {
      elem.closest('.popup').querySelectorAll('.popup__validation-error')[0]
                            .classList.add('popup__validation-error_active');
      return
    }

    // паревірка на непустий інпут
    if( +document.getElementById( formId.slice(1) )
                .querySelector('.popup__make-deposit-amount-input').value < 1 ) {
      elem.closest('.popup').querySelectorAll('.popup__validation-error')[1]
                            .classList.add('popup__validation-error_active');
      return
    }

    let terminal  = document.querySelector('.popup__tab-header_active')
                            .dataset.terminal;
    let paySystem = 'none';
    if ( document.getElementById( formId.slice(1) )
                 .querySelector('.popup__make-deposit-card-current .popup__make-deposit-card') ) {
      paySystem   = document.getElementById( formId.slice(1) )
                            .querySelector('.popup__make-deposit-card-current .popup__make-deposit-card')
                            .dataset.paysystem;
    }
    let amount    = document.getElementById( formId.slice(1) )
                            .querySelector('.popup__make-deposit-amount-input').value;
    let currency  = document.getElementById( formId.slice(1) )
                            .querySelector('select').value;

    let data = {
      terminal  : terminal,
      paySystem : paySystem,
      amount    : amount,
      currency  : currency
    }

    ajaxPost( 'url', data, simpleClose, document.querySelector('.popup__make-deposit-btn') );
    // тут місце для ajax-запиту
    // --//--//--//--//--//--//-
    // це навісити на ajax-success
    // simpleClose(this);
  }

  // валідація
  let checkedArr = document.querySelectorAll('.popup__make-deposit-checkbox-wrapper input');
  addOnEventToObject('change', checkedArr, checkValidate);
  function checkValidate (elem) {
    if (elem.checked) {
      elem.closest('.popup').querySelectorAll('.popup__validation-error')[0]
                            .classList.remove('popup__validation-error_active');
    }
  }

  let depositInputs = document.querySelectorAll('.popup__make-deposit-amount-input');
  addOnEventToObject('keyup', depositInputs, validateDepositInputs);
  function validateDepositInputs(elem) {
    if (elem.value > 0) {
      elem.closest('.popup').querySelectorAll('.popup__validation-error')[1]
                            .classList.remove('popup__validation-error_active');
    }
  }
/* ↑↑↑ /popup: make-deposit ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ SIMPLE CLOSE ↓↓↓
  let closeBtns = document.querySelectorAll('.popup__close-btn');
  addOnEventToObject('click', closeBtns, simpleClose)
// ↑↑↑ SIMPLE CLOSE ↑↑↑
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

    if ( elem == '.popup-trading-result' ) {
      let lang = document.getElementById('language-active').dataset.lang;
      if ( lang == 'ru' ) {
        if ( arguments[1] == 'buy' ) {
          document.getElementById('popup-result-direction').textContent = 'покупку';
        } else if ( arguments[1] == 'sell' ) {
          document.getElementById('popup-result-direction').textContent = 'продажу';
        }
      } else if ( lang == 'en' ) {
        if ( arguments[1] == 'buy' ) {
          document.getElementById('popup-result-direction').textContent = 'buy';
        } else if ( arguments[1] == 'sell' ) {
          document.getElementById('popup-result-direction').textContent = 'sell';
        }
      }

      document.getElementById('popup-result-pair').textContent = arguments[2];
      document.getElementById('popup-result-amount').textContent = arguments[3];
      document.getElementById('popup-result-profit').textContent = arguments[4];
    }

    if ( elem == '.popup-bid-confirmation' ) {
      let lang = document.getElementById('language-active').dataset.lang;
      if ( lang == 'ru' ) {
        if ( arguments[1] == 'buy' ) {
          document.getElementById('popup-bid-direction').textContent = 'покупку';
        } else if ( arguments[1] == 'sell' ) {
          document.getElementById('popup-bid-direction').textContent = 'продажу';
        }
      } else if ( lang == 'en' ) {
        if ( arguments[1] == 'buy' ) {
          document.getElementById('popup-bid-direction').textContent = 'buy';
        } else if ( arguments[1] == 'sell' ) {
          document.getElementById('popup-bid-direction').textContent = 'sell';
        }
      }

      document.getElementById('popup-bid-pair').textContent =  arguments[2] ;
      document.getElementById('popup-bid-amount').textContent =  arguments[3] ;
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
  }
// ↑↑↑ FUNCTIONS DECLARATION ↑↑↑
////////////////////////////////////////////////////////////////////////////////


    document.querySelector('.popup-set-SL-TP .popup__btn').onclick = function () {
        let popup = event.target.closest('.popup.popup-set-SL-TP');
        let id = popup.dataset.id;

        let sl = popup.querySelector('#input-SL').value || popup.querySelector('#pseudo-input-SL').innerHTML;
        let tp = popup.querySelector('#input-TP').value || popup.querySelector('#pseudo-input-TP').innerHTML;
        console.log('click',sl,tp,id);
        //////////
    }