"use strict";

/* ↓↓↓ кнопки "показати/приховати пароль" ↓↓↓ */
$('.regform__show-hide-pass').click(function () {
  if ($(this).children().hasClass('fa-eye-slash')) {
    $(this).siblings('.regform__input_pass').attr('type', 'text').focus();
    $(this).children('.fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
  } else {
    $(this).siblings('.regform__input_pass').attr('type', 'password').focus();
    $(this).children('.fa-eye').removeClass('fa-eye').addClass('fa-eye-slash');
  }
});
/* ↑↑↑ /кнопки "показати/приховати пароль" ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ побудова списку країн ↓↓↓ */

var isCountriesListOpen = false;
var blockedCountriesArr = ['AU', 'IR', 'IL', 'CA', 'UA', 'US', 'JP', 'SY', 'KP'];
$('.regform__flag-wrapper-cover-for-click').click(function () {
  if (!isCountriesListOpen) {
    // відкриття списку
    $('.regform__countries-wrapper').css({
      'display': 'block'
    }).css({
      'height': '190px'
    });
    isCountriesListOpen = true; // перевірка, чи список уже створювався (щоб не було дублікатів)

    if ($('.regform__country').children().length) {
      return;
    } // побудова списку


    outer: for (var i = 0; i < countriesArr.length; i++) {
      for (var j = 0; j < blockedCountriesArr.length; j++) {
        if (blockedCountriesArr[j] == countriesArr[i].ISOcode) {
          continue outer;
        }
      }

      var country = '<div class="regform__country" data-phoneCode="' + countriesArr[i].phoneCode + '" data-imgName="' + countriesArr[i].imgName + '" onclick="addCountryCode(this)">\
                       <div class="regform__img-flag-wrapper">\
                         <img class="regform__flag-img" src="assets/img/' + countriesArr[i].imgName + '", alt="country-flag">\
                       </div>\
                       <div class="regform__country-name">' + countriesArr[i].nameEn + '</div>\
                     </div>';
      $('.regform__countries-wrapper').append(country);
    }
  } else {
    //закриття списку
    $('.regform__countries-wrapper').css({
      'height': '0px'
    }).css({
      'display': 'none'
    });
    isCountriesListOpen = false;
  }
});
/* ↑↑↑ /побудова списку країн ↑↑↑ */

$(document).click(function (event) {
  if (isCountriesListOpen && event.target.className != 'regform__flag-wrapper-cover-for-click') {
    $('.regform__countries-wrapper').css({
      'height': '0px'
    }).css({
      'display': 'none'
    });
    isCountriesListOpen = false;
  }
});
/* ↓↓↓ вибір країни ↓↓↓ */

var selectedCountry;

function addCountryCode(arg) {
  var THIS = arg; // підставляємо отриманий код в input

  var tempCode = $(THIS).attr('data-phoneCode');
  $('#input-country-code').val(tempCode); // замінюємо прапорець

  var tempImgName = $(THIS).attr('data-imgName');
  var tempSrc = 'assets/img/' + tempImgName;
  $(THIS).parent().siblings('.regform__flag-wrapper').find('.regform__flag-img').attr('src', tempSrc); // після вибору країни - фокусування на input з тел. номером

  $('#input-phone').removeAttr('readonly').focus(); // це для ajax

  selectedCountry = tempImgName.slice(0, -4);
}
/* ↑↑↑ /вибір країни ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ phone input - only for numbers ↓↓↓ */


$('#input-phone').keypress(function (e) {
  e = e || event;
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  var chr = getChar(e);
  if (chr == null) return;

  if (chr < '0' || chr > '9') {
    return false;
  }

  function getChar(event) {
    if (event.which == null) {
      if (event.keyCode < 32) return null;
      return String.fromCharCode(event.keyCode); // IE
    }

    if (event.which != 0 && event.charCode != 0) {
      if (event.which < 32) return null;
      return String.fromCharCode(event.which); // остальные
    }

    return null; // специальная клавиша
  }
});
/* ↑↑↑ /phone input - only for numbers ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var dictionary = {
  emptyField: {
    ru: 'Данное поле не может быть пустым. Заполните поле!',
    en: 'This field cannot be empty. Fill in the field!'
  },
  correctEmail: {
    ru: 'Введите корректную эл. почту!',
    en: 'Enter a valid e-mail!'
  },
  correctPhone: {
    ru: 'Выберите код страны и введите корректный номер телефона!',
    en: 'Select a country code and enter a valid phone number!'
  },
  correctPassword: {
    ru: 'Пароль должен быть минимум 8 символов в длинну, содержать цифры и буквы!',
    en: 'The password must be at least 8 characters long, contain numbers and letters!'
  },
  passwordMatch: {
    ru: 'Пароли не совпадают!',
    en: 'Passwords do not match!'
  },
  consentConfirm: {
    ru: 'Подтвердите согласие с условиями!',
    en: 'Confirm the conditions!'
  }
};
var isMessageVisible = false;
/* ↓↓↓ клік на кнопку ↓↓↓ */

$('#btnsubmit').click(function () {
  // валідація імені
  if ($('#input-firstName').val().length < 2) {
    // якщо повідомлення уже є - вийти
    if (isMessageVisible) return; // підсвітка input'а та фокус

    $('#input-firstName').css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    }).focus(); //показати повідомлення та вийти

    showErrorMessage('#input-firstName', dictionary.emptyField);
    isMessageVisible = true;
    return;
  } // валідація прізвища


  if ($('#input-lastName').val().length < 2) {
    // якщо повідомлення уже є - вийти
    if (isMessageVisible) return; // підсвітка input'а та фокус

    $('#input-lastName').css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    }).focus(); // показати повідомлення, вийти

    showErrorMessage('#input-lastName', dictionary.emptyField);
    isMessageVisible = true;
    return;
  } // валідація пошти


  var tempEmail = $('#input-email').val();

  if (!isEmailValid(tempEmail)) {
    // якщо повідомлення уже є - вийти
    if (isMessageVisible) return; // підсвітка input'а та фокус

    $('#input-email').css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    }).focus(); // показати повідомлення, вийти

    showErrorMessage('#input-email', dictionary.correctEmail);
    isMessageVisible = true;
    return;
  } // валідація телефону


  if ($('#input-phone').val().length < 7) {
    // якщо повідомлення уже є - вийти
    if (isMessageVisible) return; // підсвітка input'а та фокус

    $('.regform__phone-wrapper:eq(0)').css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    }).focus(); // показати повідомлення, вийти

    showErrorMessage('.regform__phone-wrapper:eq(0)', dictionary.correctPhone, 170, 150);
    isMessageVisible = true;
    return;
  } // валідація паролю на довжину, наявність букв і цифр


  var tempPass = $('#input-password').val();
  var tempPassArr = tempPass.split('');
  var tempCount = 0;

  for (var i = 0; i < tempPassArr.length; i++) {
    if (isNumeric(tempPassArr[i])) {
      tempCount++;
    }
  }

  if (tempPass.length < 8 || tempPass.length == tempCount || tempCount == 0) {
    // якщо повідомлення уже є - вийти
    if (isMessageVisible) return; // підсвітка input'а та фокус

    $('#input-password').css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    }).focus(); // показати повідомлення, вийти

    showErrorMessage('#input-password', dictionary.correctPassword);
    isMessageVisible = true;
    return;
  } // валідація паролів на однаковість


  if ($('#input-password').val() != $('#input-confirm-pass').val()) {
    // якщо повідомлення уже є - вийти
    if (isMessageVisible) return; // підсвітка input'а та фокус

    $('#input-password, #input-confirm-pass').css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    });
    $('#input-confirm-pass').focus(); // показати повідомлення, вийти

    showErrorMessage('#input-confirm-pass', dictionary.passwordMatch);
    isMessageVisible = true;
    return;
  } // валідація на поставлену пташку


  if ("attr('checked')", $('.regform__agree-wrapper input:checked').length != 1) {
    // якщо повідомлення уже є - вийти
    if (isMessageVisible) return; // підсвітка input'а

    $('.regform__agree-checkbox-span').css({
      'box-shadow': '0 0 5px red',
      'border-color': 'red'
    }); // показати повідомлення, вийти

    showErrorMessage('.regform__agree-checkbox-span', dictionary.consentConfirm, 270, -1);
    isMessageVisible = true;
    return;
  } // var dat = {
  //   CustomerEmail     : $('#input-email').val(),
  //   CustomerPassword  : $('#input-password').val(),
  //   CustomerFirstName : $('#input-firstName').val(),
  //   CustomerLastName  : $('#input-lastName').val(),
  //   CustomerPhone     : $('#input-country-code').val()+$('#input-phone').val(),
  //   CustomerCountry   : selectedCountry,
  //   CustomerCity      : "unknown",
  //   CustomerIp        : "0",
  //   CustomerLanguage  : "unknown",
  //   CompanyId         : 0,
  //   Hash              : 'self'
  // }
  // $.ajax({
  //       url     : "https://backend.astra-investing.com/api/LidsSelfRegisr",
  //       type    : "POST",
  //       data    : dat,
  //       success : function (data) {
  //                   if (data=="Ok") {
  //                     location.href = 'https://traiding.astra-investing.com/Home/LoginSite?email=' + dat.CustomerEmail + '&pass=' + dat.CustomerPassword
  //                   } else {
  //                     // якщо повідомлення уже є - вийти
  //                     var message = $('.regform__info.regform__info_error:eq(7)');
  //                     if ( $(message).css('height') != '0px' ) return;
  //                     // підсвітка input'а
  //                     $('#input-email').css({'box-shadow':'0 0 5px red','border-color':'red'});
  //                     // показати повідомлення, вийти
  //                     $(message).css({'height':'auto','min-height':'30px','padding':'3px 0'});
  //                     var tempHeight = $(message).css('height');
  //                     $(message).css({'height': '0px','min-height':'0px','padding':'0px'});
  //                     $(message).css({'transition':'height .5s, padding-top .5s, margin .5s','height':tempHeight, 'padding':'3px', 'margin':'3px 0'});
  //                     return
  //                   }
  //                 }
  // });

});
/* ↑↑↑ /клік на кнопку ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ перевірка правильності на input'ах ↓↓↓ */
// якщо ім'я є - прибрати повідомлення

$('#input-firstName').keyup(function (e) {
  if ($('#input-firstName').val().length > 1) {
    $('.regform__error').remove();
    isMessageVisible = false; // підсвітка input'а

    $('#input-firstName').css({
      'box-shadow': 'none',
      'border-color': 'white'
    });
  }
}); // якщо прізвище є - прибрати повідомлення

$('#input-lastName').keyup(function (e) {
  if ($('#input-lastName').val().length > 1) {
    $('.regform__error').remove();
    isMessageVisible = false; // підсвітка input'а

    $('#input-lastName').css({
      'box-shadow': 'none',
      'border-color': 'white'
    });
  }
}); // якщо пошта коректна - прибрати повідомлення

$('#input-email').keyup(function () {
  var tempEmail = $('#input-email').val();

  if (isEmailValid(tempEmail)) {
    $('.regform__error').remove();
    isMessageVisible = false; // підсвітка input'а

    $('#input-email').css({
      'box-shadow': 'none',
      'border-color': 'white'
    });
  }
}); // якщо телефон коректний - прибрати повідомлення

$('#input-phone').keyup(function (e) {
  if ($('#input-phone').val().length > 6) {
    $('.regform__error').remove();
    isMessageVisible = false; // підсвітка input'а

    $('.regform__phone-wrapper:eq(0)').css({
      'box-shadow': 'none',
      'border-color': 'white'
    });
  }
}); // якщо пароль коректний - прибрати повідомлення

$('#input-password, #input-confirm-pass').keyup(function () {
  var tempPass = $('#input-password').val();
  var tempPassArr = tempPass.split('');
  var tempCount = 0;

  for (var i = 0; i < tempPassArr.length; i++) {
    if (isNumeric(tempPassArr[i])) {
      tempCount++;
    }
  }

  if (tempPass.length >= 8 && tempPass.length != tempCount && tempCount != 0) {
    $('.regform__error').remove();
    isMessageVisible = false; // підсвітка input'а

    $('#input-password, #input-confirm-pass').css({
      'box-shadow': 'none',
      'border-color': 'white'
    });
  }
}); // якщо паролі однакові - прибрати повідомлення

$('#input-password, #input-confirm-pass').keyup(function () {
  if ($('#input-password').val() === $('#input-confirm-pass').val()) {
    $('.regform__error').remove();
    isMessageVisible = false; // підсвітка input'а

    $('#input-password, #input-confirm-pass').css({
      'box-shadow': 'none',
      'border-color': 'white'
    });
  }
}); // якщо пташка поставлена - прибрати повідомлення

$('.regform__agree-label').click(function () {
  if ("attr('checked')", $('.regform__agree-wrapper input:checked').length == 1) {
    $('.regform__error').remove();
    isMessageVisible = false; // підсвітка input'а

    $('.regform__agree-checkbox-span').css({
      'box-shadow': 'none',
      'border-color': 'white'
    });
  }
});
/* ↑↑↑ /перевірка правильності на input'ах ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ↓↓↓ FUNCTIONS DECLARATIONS ↓↓↓ */

function showErrorMessage(query, text, top, left) {
  var field = $(query)[0];
  var fieldWidth = $(field).outerWidth();
  var fieldLeft = $(field).position().left;
  var fieldBottom = top || $(field).position().top + $(field).outerHeight();
  var currentLang = $('.language-switcher').attr('data-lang');
  var message = $('<div class="regform__error"></div>').text(text[currentLang]).append('<div class="error-triangle"></div>');
  var triangleLeft;

  if (left) {
    triangleLeft = left + 'px';
  } else {
    triangleLeft = fieldLeft + fieldWidth / 2 - 20 + 'px';
  }

  $(message).css('top', fieldBottom + 10);
  $($('.regform')[0]).append(message);
  $($('.error-triangle')[0]).css('left', triangleLeft);
}

function isEmailValid(email) {
  // повинен бути 1 символ @
  var temp = calculateCharsInStr(email, '@');
  if (temp != 1) return false; // повинен бути мінімум 1 символ .

  temp = calculateCharsInStr(email, '.');
  if (temp < 1) return false; // символи @ та . не повинні бути крайніми

  if (email.charAt(0) == '@' || email.charAt(0) == '.' || email.charAt(email.length - 1) == '@' || email.charAt(email.length - 1) == '.') return false; // комбінація символів @. не допустима

  if (email.indexOf('@.') != -1) return false; // після символу @ обов'язково повинен бути символ .

  var tempArr = email.split('@');
  if (tempArr[1].indexOf('.') == -1) return false;
  return true;
}

function calculateCharsInStr(str, _char) {
  var pos = 0,
      count = 0;

  while (true) {
    var foundPos = str.indexOf(_char, pos);
    if (foundPos == -1) break;
    count++;
    pos = foundPos + 1;
  }

  return count;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
/* ↑↑↑ /FUNCTIONS DECLARATIONS ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////