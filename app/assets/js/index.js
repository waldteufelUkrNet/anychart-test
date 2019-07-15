'use strict'; // made by waldteufel@ukr.net

var dictionary,
    lang,
    isOperationContainerOpen,
    selectTimeTimer,
    newUTCTimeObj = {},
    dateString;
$(document).ready(function () {
  dictionary = {
    s30: {
      en: '1 second',
      ru: '30 секунд'
    },
    m1: {
      en: '1 minute',
      ru: '1 минута'
    },
    m2: {
      en: '2 minutes',
      ru: '2 минуты'
    },
    m3: {
      en: '3 minutes',
      ru: '3 минуты'
    },
    time: {
      en: 'Time',
      ru: 'Время'
    }
  }; ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* ↓↓↓ визначення мови ↓↓↓ */

  lang = $('.language-switcher:eq(0)').attr('data-lang');
  /* ↑↑↑ /визначення мови ↑↑↑ */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* ↓↓↓ БЛОК ЧАСУ ↓↓↓ */
  // для правильного визначення часу звертаємося до сервера (у клієнта на компі може стояти неправильний час)

  (function () {
    // запускається один раз при старті, ajax'ом робить запит на сервер, забирає час і далі самостійно через setInterval робить відлік часу і записує в об'єкт
    // відповідь на ajax-запит має формат "2019-03-22T10:16:31Z"
    // потрібно взяти у бекендщиків новий url
    $.ajax({
      url: 'http://localhost/api/UtcTime',
      success: function success(data) {
        newUTCTimeObj.yyyySTR = data.slice(0, 4);
        newUTCTimeObj.yyyyNUM = +data.slice(0, 4);
        newUTCTimeObj.yySTR = data.slice(2, 4);
        newUTCTimeObj.yyNUM = +data.slice(2, 4);
        newUTCTimeObj.mmSTR = data.slice(5, 7);
        newUTCTimeObj.mmNUM = +data.slice(5, 7);
        newUTCTimeObj.ddSTR = data.slice(8, 10);
        newUTCTimeObj.ddNUM = +data.slice(8, 10);
        newUTCTimeObj.hhSTR = data.slice(11, 13);
        newUTCTimeObj.hhNUM = +data.slice(11, 13);
        newUTCTimeObj.minSTR = data.slice(14, 16);
        newUTCTimeObj.minNUM = +data.slice(14, 16);
        newUTCTimeObj.ssSTR = data.slice(17, 19);
        newUTCTimeObj.ssNUM = +data.slice(17, 19);
        newUTCTimeObj.timeInMS = Date.parse(data);
        newUTCTimeObj.date = new Date(newUTCTimeObj.timeInMS);
        newUTCTimeObj.weekday = newUTCTimeObj.date.getDay(); // день тижня 0 - неділя, 6 - субота

        newUTCTimeObj.hh_mm = newUTCTimeObj.hhSTR + ':' + newUTCTimeObj.minSTR;
        newUTCTimeObj.yyyy_mm_dd = newUTCTimeObj.yyyySTR + '-' + newUTCTimeObj.mmSTR + '-' + newUTCTimeObj.ddSTR;
        dateString = data;
        timer();
      },
      error: function error() {
        var date = new Date();
        newUTCTimeObj.yyyySTR = '' + date.getUTCFullYear();
        newUTCTimeObj.yyyyNUM = date.getUTCFullYear();
        newUTCTimeObj.yySTR = newUTCTimeObj.yyyySTR.slice(2, 4);
        newUTCTimeObj.yyNUM = +newUTCTimeObj.yyyySTR.slice(2, 4);
        newUTCTimeObj.mmNUM = date.getUTCMonth() + 1;

        if (newUTCTimeObj.mmNUM < 10) {
          newUTCTimeObj.mmSTR = '0' + newUTCTimeObj.mmNUM;
        } else {
          newUTCTimeObj.mmSTR = '' + newUTCTimeObj.mmNUM;
        }

        ;
        newUTCTimeObj.ddNUM = date.getUTCDate();

        if (newUTCTimeObj.ddNUM < 10) {
          newUTCTimeObj.ddSTR = '0' + newUTCTimeObj.ddNUM;
        } else {
          newUTCTimeObj.ddSTR = '' + newUTCTimeObj.ddNUM;
        }

        ;
        newUTCTimeObj.hhNUM = date.getUTCHours();

        if (newUTCTimeObj.hhNUM < 10) {
          newUTCTimeObj.hhSTR = '0' + newUTCTimeObj.hhNUM;
        } else {
          newUTCTimeObj.hhSTR = '' + newUTCTimeObj.hhNUM;
        }

        ;
        newUTCTimeObj.minNUM = date.getUTCMinutes();

        if (newUTCTimeObj.minNUM < 10) {
          newUTCTimeObj.minSTR = '0' + newUTCTimeObj.minNUM;
        } else {
          newUTCTimeObj.minSTR = '' + newUTCTimeObj.minNUM;
        }

        ;
        newUTCTimeObj.ssNUM = date.getUTCSeconds();

        if (newUTCTimeObj.ssNUM < 10) {
          newUTCTimeObj.ssSTR = '0' + newUTCTimeObj.ssNUM;
        } else {
          newUTCTimeObj.ssSTR = '' + newUTCTimeObj.ssNUM;
        }

        ;
        newUTCTimeObj.timeInMS = +date;
        newUTCTimeObj.date = date;
        newUTCTimeObj.weekday = date.getDay(); // день тижня 0 - неділя, 6 - субота

        newUTCTimeObj.hh_mm = newUTCTimeObj.hhSTR + ':' + newUTCTimeObj.minSTR;
        newUTCTimeObj.yyyy_mm_dd = newUTCTimeObj.yyyySTR + '-' + newUTCTimeObj.mmSTR + '-' + newUTCTimeObj.ddSTR;
        dateString = newUTCTimeObj.yyyySTR + '-' + newUTCTimeObj.mmSTR + '-' + newUTCTimeObj.ddSTR + 'T' + newUTCTimeObj.hhSTR + ':' + newUTCTimeObj.minSTR + ':' + newUTCTimeObj.ssSTR + 'Z';
        timer();
      }
    });
  })();

  dateString = "2019-03-22T11:16:31Z";
  timer();
  /* ↓↓↓ datetimer ↓↓↓ */

  var datetimer = document.getElementById('UTC-datetimer');
  setInterval(function () {
    datetimer.innerHTML = newUTCTimeObj.yyyySTR + "-" + newUTCTimeObj.mmSTR + "-" + newUTCTimeObj.ddSTR + "   " + newUTCTimeObj.hhSTR + ":" + newUTCTimeObj.minSTR + ":" + newUTCTimeObj.ssSTR;
  }, 1000);
  /* ↑↑↑ /datetimer ↑↑↑ */

  /* ↑↑↑ /БЛОК ЧАСУ ↑↑↑ */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ↓↓↓ вибір типу пар (криптовалюта/акції/валютні пари/товари) ↓↓↓
  // робимо підсвітку обраної вкладки, визначаємо тип активної пари, підвантажуємо відповідний графік за замовчуванням та
  // підставляємо потрібну назву у кнопку
  // потрібно зробити ajax-запит на сервер, щоб він почав видавати потрібні значення для нового графіку
  // потрібно визначитися із чотирма графіками за замовчуванням, щоб підставляти відповідні значення у кнопку списку пар

  var arrOfTradingTypes = $('.asset-type-list__item');
  var tradingType = 'crypto';
  $(arrOfTradingTypes).click(function () {
    console.log('клік по типах пар'); // підсвітка

    for (var i = 0; i < arrOfTradingTypes.length; i++) {
      $(arrOfTradingTypes[i]).removeClass('asset-type-list__item_active');
    }

    $(this).addClass('asset-type-list__item_active'); // закриваємо область #operation-container

    $('#operation-container').css('display', 'none');
    isOperationContainerOpen = false; // обнуляємо час

    $('.work-area-header__chosen-time:eq(0)').text(dictionary.time[lang]);
    $('.work-area-header__chosen-time:eq(0)').removeAttr('data-timetoendinms'); // скидаємо суму

    $('#investment-input').val('25');
    calculateProfit(); // визначаємо тип активної пари, підвантажуємо відповідний графік за замовчуванням та
    // підставляємо потрібну назву у кнопку

    tradingType = $(this).attr('data-tradingType');
    console.log("tradingType", tradingType);

    if (tradingType == 'crypto') {
      console.log("переключалка на крипту");
    } else if (tradingType == 'stock') {
      console.log("переключалка на акції");
    } else if (tradingType == 'currency') {
      console.log("переключалка на валюту");
    } else if (tradingType == 'goods') {
      console.log("переключалка на товари");
    }
  }); // ↑↑↑ /вибір типу пар (криптовалюта/акції/валютні пари/товари) ↑↑↑
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ↓↓↓ клік по кнопці списку пар ↓↓↓
  // робимо видимою область #operation-container, перед цим чистимо її вміст від попереднього вмісту
  // потрібно зробити ajax-запит на сервер, щоб він відмалював торгові пари даного типу та
  // почав видавати потрібні для них значення котировок, а при закритті - запит, щоб припиняв

  $('.work-area-header__chosen-assets').click(function () {
    console.log("клік по кнопці списку пар");

    if (!isOperationContainerOpen) {
      $('#operation-container').css('display', 'flex'); // .empty();

      isOperationContainerOpen = true;
    } else {
      $('#operation-container').css('display', 'none');
      isOperationContainerOpen = false;
    }
  }); // ↑↑↑ /клік по кнопці списку пар ↑↑↑
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ↓↓↓ вибір пари ↓↓↓
  // вибираємо пару, змінюємо текст в кнопці списку пар, закриваємо область #operation-container
  // потрібно перемалювати графік та дати серверу команду припинити видавати дані для усіх торгових пар

  var currentTradingPair;
  $('.trade-pair-item').click(function () {
    console.log('клік по конкретній парі');
    currentTradingPair = $(this).children('.trade-pair-item__name').text();
    console.log("currentTradingPair", currentTradingPair);
    $($('.work-area-header__chosen-assets')[0]).text(currentTradingPair);
    $('#operation-container').css('display', 'none');
    isOperationContainerOpen = false;
  }); // ↑↑↑ /вибір пари ↑↑↑
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ↓↓↓ клік по кнопці часу (побудова списку можливих ставок) ↓↓↓
  // робимо видимою область #operation-container, перед цим чистимо її вміст від попереднього вмісту
  // визначаємо активну пару, поточний час, часові обмеження на торгівлю, свята та будуємо список можливих ставок
  // потрібно взяти у бекендщиків breakInTrade

  $('.work-area-header__chosen-time').click(function () {
    console.log('клік по кнопці часу');

    if (!isOperationContainerOpen) {
      $('#operation-container').css('display', 'block').empty();
      isOperationContainerOpen = true; // перевірка роботи біржи по конкретній парі
      // let breakInTrade = $('#').attr('data-break');

      var breakInTrade = 0;

      if (breakInTrade == 1) {
        console.log('біржа не працює');
      } else if (breakInTrade == 0) {
        console.log("tradingType", tradingType);

        if (tradingType == 'currency') {
          // валюта
          // перевірка на вихідні: п'ятниця 21:30 - неділя 21:30
          // 21:30 = 21 * 60 + 30 = 1290
          var weekday = newUTCTimeObj.weekday,
              tempTimeInMinutes = newUTCTimeObj.hhNUM * 60 + newUTCTimeObj.minNUM;

          if (weekday == 5 && tempTimeInMinutes >= 1285 || // -5хв - для запасу на короткі ставки
          weekday == 6 || weekday == 0 && tempTimeInMinutes <= 1290) {//showInfoMessage('moneyExchangeDontWork');
          } else {
            // якщо робочий час - побудувати список ставок
            var startTime = newUTCTimeObj.hh_mm;
            var finishTime;

            if (weekday == 5) {
              finishTime = '21:30';
            } else {
              finishTime = '24:00';
            }

            writeParlayList(startTime, finishTime);
          }
        } else if (tradingType == 'stock') {
          // акції
          // перевірка на вихідні (субота та неділя)
          var _weekday = newUTCTimeObj.weekday;

          if (_weekday == 6 || _weekday == 0) {
            //showInfoMessage('ActionsExchangeDontWork');
            return;
          } // перевірка на робочий час (13:30 - 20:00 по UTC)
          // 13:30 = 13 * 60 + 30 = 810;
          // 20:00 = 20 * 60 = 1200;


          var _tempTimeInMinutes = newUTCTimeObj.hhNUM * 60 + newUTCTimeObj.minNUM;

          if (_tempTimeInMinutes < 810 || _tempTimeInMinutes > 1195) {
            // -5хв - для запасу на короткі ставки
            //showInfoMessage('ActionsExchangeDontWork');
            return;
          } // перевірка на державні святкові дні в США


          var tempDate = newUTCTimeObj.yyyy_mm_dd;

          if (isFeastDayInUSA('tempDate')) {
            //showInfoMessage('ActionsExchangeDontWork');
            return;
          } // якщо робочий час - побудувати список ставок


          var _startTime = newUTCTimeObj.hh_mm;
          var _finishTime = '20:00';
          writeParlayList(_startTime, _finishTime);
        } else if (tradingType == 'goods') {
          // товари
          // перевірка на вихідні: п'ятниця 21:30 - неділя 21:30
          // 21:30 = 21 * 60 + 30 = 1290
          var _weekday2 = newUTCTimeObj.weekday,
              _tempTimeInMinutes2 = newUTCTimeObj.hhNUM * 60 + newUTCTimeObj.minNUM;

          if (_weekday2 == 5 && _tempTimeInMinutes2 >= 1285 || // -5хв - для запасу на короткі ставки
          _weekday2 == 6 || _weekday2 == 0 && _tempTimeInMinutes2 <= 1290) {//showInfoMessage('moneyExchangeDontWork');
          } else {
            // якщо робочий час - побудувати список ставок
            var _startTime2 = newUTCTimeObj.hh_mm;

            var _finishTime2;

            if (_weekday2 <= 0 && _weekday2 >= 4) {
              _finishTime2 = '24:00';
            } else {
              _finishTime2 = '21:30';
            }

            writeParlayList(_startTime2, _finishTime2);
          }
        } else if (tradingType == 'crypto') {
          // криптовалюта
          // перевірка на вихідні: працюють безперервно
          // побудувати список ставок
          var _startTime3 = newUTCTimeObj.hh_mm,
              _finishTime3 = '24:00';
          writeParlayList(_startTime3, _finishTime3);
        }
      }
    } else {
      $('#operation-container').css('display', 'none');
      isOperationContainerOpen = false;
    }
  });

  function writeParlayList(start, finish) {
    // створює список ставок
    // короткі: 30сек, 1, 2, 3 хв
    // нормальні: від поточного часу до 24:00 (для акцій - до 20:00) з інтервалом 30хв
    // короткі
    $('#operation-container').empty().append('\
                               <div class="time-list-header">Быстрые</div>\
                               <div class="time-list-body">\
                                 <div class="time-list-body-item" data-timeToEndInMS="30000" onclick="selectTime(this)">' + dictionary.s30[lang] + '</div>\
                                 <div class="time-list-body-item" data-timeToEndInMS="60000" onclick="selectTime(this)">' + dictionary.m1[lang] + '</div>\
                                 <div class="time-list-body-item" data-timeToEndInMS="120000" onclick="selectTime(this)">' + dictionary.m2[lang] + '</div>\
                                 <div class="time-list-body-item" data-timeToEndInMS="180000" onclick="selectTime(this)">' + dictionary.m3[lang] + '</div>\
                               </div>\
                               <div class="time-list-header">Средние</div>\
                               <div class="time-list-body"></div>\
                               <div class="time-list-header">Длинные</div>\
                               <div class="time-list-body"></div>\
                             '); // довгі
    // для довгих потрібно використати newUTCTimeObj.date, але вираз startTime = newUTCTimeObj.date посилається на об'єкт,
    // а не на примітив, відповідно його змінює і ламає код. Щоб цього не було, потрібно створити клон об'єкту. Для цього
    // використовуємо наступний канделябр: беремо час на компі клієнта, вираховуємо різницю між цим часом та UTC, отриману
    // різницю віднімаємо/додаємо від/до часу компа і отримуємо новий об'єкт-час уже в UTC

    var tempTime = Date.now();
    var startTime, delta;

    if (tempTime > +newUTCTimeObj.date) {
      delta = tempTime - +newUTCTimeObj.date;
      startTime = new Date(tempTime - delta);
    } else if (tempTime < +newUTCTimeObj.date) {
      delta = +newUTCTimeObj.date - tempTime;
      startTime = new Date(tempTime + delta);
    } else if (tempTime = +newUTCTimeObj.date) {
      startTime = new Date(tempTime);
    }

    var timeToEndInMS = 86400000; // 24*60*60*1000
    // створення нового списку

    for (var i = 0; i < 31; i++) {
      // додаємо по одній добі
      startTime.setUTCDate(startTime.getUTCDate() + 1);
      var tempDateSTR = {};
      tempDateSTR.yyyySTR = '' + startTime.getUTCFullYear();
      tempDateSTR.mmNUM = startTime.getUTCMonth() + 1;

      if (tempDateSTR.mmNUM < 10) {
        tempDateSTR.mmSTR = '0' + tempDateSTR.mmNUM;
      } else {
        tempDateSTR.mmSTR = '' + tempDateSTR.mmNUM;
      }

      ;
      tempDateSTR.ddNUM = startTime.getUTCDate();

      if (tempDateSTR.ddNUM < 10) {
        tempDateSTR.ddSTR = '0' + tempDateSTR.ddNUM;
      } else {
        tempDateSTR.ddSTR = '' + tempDateSTR.ddNUM;
      }

      ;
      var tempDatehhNUM = startTime.getUTCHours();
      var tempDateminNUM = startTime.getUTCMinutes();
      var weekday = startTime.getDay();
      tempDateSTR = tempDateSTR.yyyySTR + '-' + tempDateSTR.mmSTR + '-' + tempDateSTR.ddSTR; // додаткова перевірка для акцій (по дню закінчення)

      if (tradingType == 'stock') {
        if (weekday == 6 || weekday == 0) continue;
        if (isFeastDayInUSA(tempDateSTR)) continue;
      } // додаткова перевірка для валюти та товарів (по дню закінчення)


      if (tradingType == 'goods' || tradingType == 'currency') {
        var tempTimeInMinutes = tempDatehhNUM * 60 + tempDateminNUM;

        if (weekday == 5 && tempTimeInMinutes >= 1285 || weekday == 6 || weekday == 0 && tempTimeInMinutes <= 1290) {
          continue;
        }
      }

      $('.time-list-body:eq(2)').append('<div class="time-list-body-item" data-timeToEndInMS="' + timeToEndInMS + '" onclick="selectTime(this)">' + tempDateSTR + '</div>');
      timeToEndInMS += timeToEndInMS;
    } //середні
    // розібрати рядки startTime / finishTime


    var tempStartTimeUTCHours = +start.slice(0, 2),
        tempStartTimeUTCMinutes = +start.slice(3),
        tempFinishTimeUTCHours = +finish.slice(0, 2),
        tempFinishTimeUTCMinutes = +finish.slice(3);
    var tempStartTimeInMinutes = tempStartTimeUTCHours * 60 + tempStartTimeUTCMinutes,
        tempFinishTimeInMinutes = tempFinishTimeUTCHours * 60 + tempFinishTimeUTCMinutes; // визначення, чи ставки можливі впринципі (мінімум 35хв до 24:00 (для акцій - до 20:00) )

    if (tempFinishTimeInMinutes - 35 <= tempStartTimeInMinutes) return; // округлення часу першої можливої ставки до 00хв або 30хв

    if (25 <= tempStartTimeUTCMinutes && tempStartTimeUTCMinutes < 55) {
      // оркуглити до 00, додати 1 годину
      tempStartTimeUTCHours = +tempStartTimeUTCHours + 1;
      if (tempStartTimeUTCHours < 10) tempStartTimeUTCHours = '0' + +tempStartTimeUTCHours;
      tempStartTimeUTCMinutes = '00';
    } else if (0 <= tempStartTimeUTCMinutes && tempStartTimeUTCMinutes < 25) {
      // оркуглити до 30
      tempStartTimeUTCMinutes = '30';
    } else if (55 <= tempStartTimeUTCMinutes && tempStartTimeUTCMinutes <= 59) {
      // округлити до 30, додати годину
      tempStartTimeUTCHours = +tempStartTimeUTCHours + 1;
      if (tempStartTimeUTCHours < 10) tempStartTimeUTCHours = '0' + +tempStartTimeUTCHours;
      tempStartTimeUTCMinutes = '30';
    } // створення першої ставки і далі створення в циклі нового списку


    while (tempFinishTimeInMinutes > tempStartTimeInMinutes) {
      if (tempStartTimeUTCHours < 10) tempStartTimeUTCHours = '0' + +tempStartTimeUTCHours;

      if (tempStartTimeUTCMinutes == 0) {
        tempStartTimeUTCMinutes = '00';
      }

      var tempTimeString = newUTCTimeObj.yyyy_mm_dd + ' ' + tempStartTimeUTCHours + ':' + tempStartTimeUTCMinutes;
      $('.time-list-body:eq(1)').append('<div class="time-list-body-item" data-timeToEnd="' + tempTimeString + '" onclick="selectTime(this)">' + tempTimeString + '</div>'); // збільшуємо час на 30хв

      tempStartTimeInMinutes = tempStartTimeUTCHours * 60 + +tempStartTimeUTCMinutes + 30;
      tempStartTimeUTCHours = Math.floor(tempStartTimeInMinutes / 60);
      tempStartTimeUTCMinutes = tempStartTimeInMinutes - tempStartTimeUTCHours * 60;
    }
  } // ↑↑↑ /клік по кнопці часу (побудова списку можливих ставок) ↑↑↑
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // клік - і не тільки - по input'у для введення грошей


  $('#investment-input').bind('keypress keyup blur', function (e) {
    // в поле можна вводити тільки цілі додатні числа
    if (e.type == 'keypress') {
      e = e || event;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      var chr = getChar(e);
      if (chr == null) false;

      if (chr < '0' || chr > '9') {
        return false;
      }
    } // перша цифра не може бути нулем


    if (e.type == 'keyup') {
      if ($('#investment-input').val() == '0') {
        $('#investment-input').val('');
      }

      ;
    }

    calculateProfit();
  }); ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // клік по кнопці "вгору"/"вниз"
  // підготовка даних для відправки на сервер, підготовка даних та виведення попапа

  $('#btn-call, #btn-put').click(function () {
    // напрямок очікування ставки - call/put
    var anticipation = $(this).attr('id').slice(4); // торгова пара

    currentTradingPair = $('.work-area-header__chosen-assets:eq(0)').text(); // сума

    var inputValue = +$('#investment-input').val(); // час у формі рядка

    var timeString = $('.work-area-header__chosen-time:eq(0)').text(); // час у мілісекундах

    var timeInMS = $('.work-area-header__chosen-time:eq(0)').attr('data-timetoendinms');
  }); ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* ↓↓↓ навігація по історіях ставок/депозитів ↓↓↓ */

  $('.account-info__header').click(function () {
    // підсвітка заголовків
    $('.account-info__header').removeClass('account-info__header_active');
    $(this).addClass('account-info__header_active'); // активація відповідного поля

    $('.account-info__body').removeClass('account-info__body_active');

    for (var i = 0; i < $('.account-info__header').length; i++) {
      if ($('.account-info__header')[i] == this) {
        $($('.account-info__body')[i]).addClass('account-info__body_active'); // вирівняти таблицю

        makeTablesEquable($('.account-info__body')[i]);
        return;
      }
    }
  });
  /* ↑↑↑ /навігація по історіях ставок/депозитів ↑↑↑ */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* ↓↓↓ вирівнювання таблиці при першому завантаженні сторінки ↓↓↓ */

  makeTablesEquable($('.account-info__body_active')[0]);
  /* ↑↑↑ /вирівнювання таблиці при першому завантаженні сторінки ↑↑↑ */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* ↓↓↓ навішування адреси домену на усі посилання на платформі ↓↓↓ */

  translateLinks();
  /* ↑↑↑ /навіішування адреси домену на усі посилання на платформі ↑↑↑ */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
/* ↓↓↓ FUNCTIONS DECLARATIONS ↓↓↓ */

function translateLinks() {
  var domain = 'https://domain/';
  var arrOfLinks = $('.header__logo-link:eq(0), .navigation__list a[data-href], .footer a[data-href]');

  for (var i = 0; i < arrOfLinks.length; i++) {
    var href = $(arrOfLinks[i]).attr('data-href');
    var newHref = void 0;

    if (lang == 'en') {
      newHref = domain + href + '_en.html';
    } else {
      newHref = domain + href + '.html';
    }

    $(arrOfLinks[i]).attr('href', newHref);
  }
}

function makeTablesEquable(elem) {
  // вирівнює ширини чарунок шапки та тіла таблиці
  // формуємо масив чарунок шапки таблиці, масив їхніх ширин
  var arrOfTableHeaderCells = $(elem).find('.account-info__table-header-item');
  var arrOfHeaderCellWidth = [];

  for (var j = 0; j < arrOfTableHeaderCells.length; j++) {
    arrOfHeaderCellWidth.push($(arrOfTableHeaderCells[j]).outerWidth());
  } // формуємо масив рядків тіла таблиці, в кожному рядку вибираємо чарунки, вносимо в масив і далі в циклі порівнюємо із наступними значеннями, якщо знаходиться більше - замінюємо елемент масиву


  var rows = $(elem).find('.account-info__table-body-item');
  var arrOfBodyCellWidth = [];

  for (var _j = 0; _j < rows.length; _j++) {
    var tempArrOfBodyCell = $(rows[_j]).find('.account-info__table-body-item-info');

    for (var k = 0; k < tempArrOfBodyCell.length; k++) {
      if ($(tempArrOfBodyCell[k]).outerWidth() > arrOfBodyCellWidth[k] || !arrOfBodyCellWidth[k]) {
        arrOfBodyCellWidth[k] = $(tempArrOfBodyCell[k]).outerWidth();
      }
    }
  } // порівнюємо масиви розмірів чарунок шапки та тіла, більші значення вписуємо в масив шапки.


  for (var _j2 = 0; _j2 < arrOfHeaderCellWidth.length; _j2++) {
    if (arrOfHeaderCellWidth[_j2] < arrOfBodyCellWidth[_j2]) {
      arrOfHeaderCellWidth[_j2] = arrOfBodyCellWidth[_j2];
    }
  } // пробігаємо в циклах чарунки шапок та рядків тіла, призначаємо їм ширини


  for (var _j3 = 0; _j3 < arrOfTableHeaderCells.length; _j3++) {
    $(arrOfTableHeaderCells[_j3]).css('width', arrOfHeaderCellWidth[_j3]);
  }

  for (var _j4 = 0; _j4 < rows.length; _j4++) {
    var _tempArrOfBodyCell = $(rows[_j4]).find('.account-info__table-body-item-info');

    for (var _k = 0; _k < _tempArrOfBodyCell.length; _k++) {
      $(_tempArrOfBodyCell[_k]).css('width', arrOfHeaderCellWidth[_k]);
    }
  } // визначаємо загальну ширину елементів та призначаємо її їхному батьку


  var tempWidth = 0;

  for (var _j5 = 0; _j5 < arrOfHeaderCellWidth.length; _j5++) {
    tempWidth += arrOfHeaderCellWidth[_j5];
  }

  $(elem).find('.account-info__table-wrapper').css('width', tempWidth); // додаємо скрол
  // addTopScroll (elem);
}

function addTopScroll(elem) {
  // поки відключена - не коректно працює
  var content = $(elem).children()[0];
  var contentWidth = $(content).width();
  var elemWidth = $(elem).width();
  $(elem).css({
    'overflow-x': 'scroll',
    'padding-top': '18px'
  }); // додаємо верхню прокрутку

  $(elem).prepend('<div class="topscroll">\
                     <div class="fake"></div>\
                   </div>');
  $('.topscroll').css({
    'position': 'absolute',
    'z-Index': '1',
    'left': '0',
    'top': '0',
    'width': elemWidth,
    'height': '16px',
    'overflow-x': 'scroll'
  });
  $('.fake').css({
    'height': '1px',
    'width': contentWidth
  });
  var topscroll = $('.topscroll')[0];
  $(topscroll).scroll(function (e) {
    $(elem).scrollLeft($(topscroll).scrollLeft());
  });
  $(elem).scroll(function (e) {
    $(topscroll).scrollLeft($(elem).scrollLeft());
  });
}

function timer() {
  var currentDate = Date.parse(dateString);
  currentDate = new Date(currentDate);
  setInterval(function () {
    currentDate.setSeconds(currentDate.getSeconds() + 1);
    newUTCTimeObj.yyyySTR = '' + currentDate.getUTCFullYear();
    newUTCTimeObj.yyyyNUM = currentDate.getUTCFullYear();
    newUTCTimeObj.yySTR = newUTCTimeObj.yyyySTR.slice(2, 4);
    newUTCTimeObj.yyNUM = +newUTCTimeObj.yyyySTR.slice(2, 4);
    newUTCTimeObj.mmNUM = currentDate.getUTCMonth() + 1;

    if (newUTCTimeObj.mmNUM < 10) {
      newUTCTimeObj.mmSTR = '0' + newUTCTimeObj.mmNUM;
    } else {
      newUTCTimeObj.mmSTR = '' + newUTCTimeObj.mmNUM;
    }

    ;
    newUTCTimeObj.ddNUM = currentDate.getUTCDate();

    if (newUTCTimeObj.ddNUM < 10) {
      newUTCTimeObj.ddSTR = '0' + newUTCTimeObj.ddNUM;
    } else {
      newUTCTimeObj.ddSTR = '' + newUTCTimeObj.ddNUM;
    }

    ;
    newUTCTimeObj.hhNUM = currentDate.getUTCHours();

    if (newUTCTimeObj.hhNUM < 10) {
      newUTCTimeObj.hhSTR = '0' + newUTCTimeObj.hhNUM;
    } else {
      newUTCTimeObj.hhSTR = '' + newUTCTimeObj.hhNUM;
    }

    ;
    newUTCTimeObj.minNUM = currentDate.getUTCMinutes();

    if (newUTCTimeObj.minNUM < 10) {
      newUTCTimeObj.minSTR = '0' + newUTCTimeObj.minNUM;
    } else {
      newUTCTimeObj.minSTR = '' + newUTCTimeObj.minNUM;
    }

    ;
    newUTCTimeObj.ssNUM = currentDate.getUTCSeconds();

    if (newUTCTimeObj.ssNUM < 10) {
      newUTCTimeObj.ssSTR = '0' + newUTCTimeObj.ssNUM;
    } else {
      newUTCTimeObj.ssSTR = '' + newUTCTimeObj.ssNUM;
    }

    ;
    newUTCTimeObj.timeInMS = +currentDate;
    newUTCTimeObj.date = currentDate;
    newUTCTimeObj.weekday = currentDate.getDay(); // день тижня 0 - неділя, 6 - субота

    newUTCTimeObj.hh_mm = newUTCTimeObj.hhSTR + ':' + newUTCTimeObj.minSTR;
    newUTCTimeObj.yyyy_mm_dd = newUTCTimeObj.yyyySTR + '-' + newUTCTimeObj.mmSTR + '-' + newUTCTimeObj.ddSTR;
  }, 1000);
}

function isFeastDayInUSA(date) {
  // перевіряє, чи є вказаний день святковим в США: 1 - святковий, 0 - не святковий
  var url = 'https://central.investingcase.com/api/Hol/GetDate?value=' + date;
  var ansver;
  $.ajax({
    url: url,
    async: false,
    success: function success(data) {
      if (data == 1) {
        // святковий день
        ansver = true;
      } else if (data == 0) {
        // не святковий день
        ansver = false;
      }
    }
  });
  return ansver;
}

function selectTime(elem) {
  // обробка кліку по кнопці конкретного часу
  clearTimeout(selectTimeTimer); // вносимо значення часу в кнопку

  $('.work-area-header__chosen-time:eq(0)').text($(elem).text());

  if ($(elem).attr('data-timeToEndInMS')) {
    $('.work-area-header__chosen-time:eq(0)').attr('data-timeToEndInMS', $(elem).attr('data-timeToEndInMS'));
  } else if ($(elem).attr('data-timeToEnd')) {
    var parlayTime = $(elem).attr('data-timeToEnd');
    var tempStartTimeInMinutes = newUTCTimeObj.hhNUM * 60 + newUTCTimeObj.minNUM;
    var tempFinishTimeInMinutes = +parlayTime.slice(11, 13) * 60 + +parlayTime.slice(14, 16);
    parlayTime = (tempFinishTimeInMinutes - tempStartTimeInMinutes) * 60 * 1000;
    $('.work-area-header__chosen-time:eq(0)').attr('data-timeToEndInMS', parlayTime);
  } // закриваємо област #operation-container


  $('#operation-container').css('display', 'none');
  isOperationContainerOpen = false; // через 30 сeк обнуляємо обраний час

  selectTimeTimer = setTimeout(function () {
    $('.work-area-header__chosen-time:eq(0)').text(dictionary.time[lang]);
    $('.work-area-header__chosen-time:eq(0)').removeAttr('data-timetoendinms');
  }, 30000);
}

function calculateProfit() {
  var inputValue = +$('#investment-input').val();
  var percentValue = parseInt($('#payout').text());
  $('#result').text(inputValue * percentValue / 100 + inputValue + '$');
}

function getChar(event) {
  if (event.which == null) {
    // IE
    if (event.keyCode < 32) return null; // спец. символ

    return String.fromCharCode(event.keyCode);
  }

  if (event.which != 0 && event.charCode != 0) {
    // все кроме IE
    if (event.which < 32) return null; // спец. символ

    return String.fromCharCode(event.which); // остальные
  }

  return null; // спец. символ
}
/* ↑↑↑ /FUNCTIONS DECLARATIONS ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// made by waldteufel@ukr.net