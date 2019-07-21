"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ VARIABLES DECLARATION ↓↓↓
var dataType = 'areaspline',
    // тип графіку 'areaspline'/'candlestick'/'ohlc'
timeStep = 5,
    // інтервал між точками на графіку
stringType = '?',
    // тип даних: '?' для areaspline та 'Ohlc?' для candlestick/ohlc
stringSymbol = 'EURUSD',
    // назва торгової пари, потрібна для формування рядка запиту
dataArr,
    // адреса для отримання масиву даних
resultArr = []; // масив з перероблених вхідних даних, придатний для обробки бібліотекою
// ↑↑↑ VARIABLES DECLARATION ↑↑↑
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ TYPE/TIME-SWITCH-BUTTONS BEHAVIOR ↓↓↓

var arrOfTypeBtns = $('.graphic__type-btn');
var arrOfTimerBtns = $('.graphic__time-btn');
$(arrOfTypeBtns).click(function () {
  // type-buttons highlighting
  for (var _i = 0; _i < arrOfTypeBtns.length; _i++) {
    $(arrOfTypeBtns[_i]).removeClass('graphic__type-btn_active');
    $(this).addClass('graphic__type-btn_active'); // визначення типу графіку

    dataType = $(this).attr('data-type');
  } // time-buttons highlighting + визначення stringType: ? / Ohlc?


  if (dataType == 'candlestick' || dataType == 'ohlc') {
    for (var _i2 = 0; _i2 < arrOfTimerBtns.length; _i2++) {
      // якщо на candlestick/ohlc нема відповідного часового інтервалу, переключати на 30хв
      if ($(arrOfTimerBtns[_i2]).attr('data-time') != '30' && $(arrOfTimerBtns[_i2]).attr('data-time') != '60') {
        if ($(arrOfTimerBtns[_i2]).hasClass('graphic__time-btn_active')) {
          $(arrOfTimerBtns[3]).addClass('graphic__time-btn_active');
          timeStep = 30;
        }

        $(arrOfTimerBtns[_i2]).css({
          'display': 'none'
        }).removeClass('graphic__time-btn_active');
      }
    }

    stringType = 'Ohlc?';
  } else {
    for (var i = 0; i < arrOfTimerBtns.length; i++) {
      $(arrOfTimerBtns[i]).css({
        'display': 'inline-block'
      });
    }

    stringType = '?';
  }

  getDataArr();
});
$(arrOfTimerBtns).click(function () {
  // підсвітка кнопок часу та вибір інтервалу, потрібного для формування рядка запиту
  for (var i = 0; i < arrOfTimerBtns.length; i++) {
    $(arrOfTimerBtns[i]).removeClass('graphic__time-btn_active');
    $(this).addClass('graphic__time-btn_active');
  }

  timeStep = +$(this).attr('data-time');
  getDataArr();
}); // ↑↑↑ TYPE/TIME-SWITCH-BUTTONS BEHAVIOR ↑↑↑
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

getDataArr(); ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ FUNCTIONS DECLARATION ↓↓↓

function getDataArr() {
  // формує рядок запиту, визначає тип графіку і формує масив, придатний для обробки бібліотекою.
  // Викликає функцію перемальовування графіку.
  dataArr = 'https://central.investingcase.com/api/Stock' + stringType + 'timer=' + timeStep + '&symbol=' + stringSymbol;
  $.ajax({
    url: dataArr,
    success: function success(data) {
      resultArr = [];

      if (dataType == 'areaspline') {
        // [{Date: "2019-07-17T18:58:00Z", Value: 1.23456, IsBrake: false },{...},{...}]
        // -> -> -> -> ->
        // [{x: Date.UTC(2019, 07, 17, 18, 58), value: 1.23456},{...},{...}]
        for (var i = 0; i < data.length; i++) {
          var tempTimeString = data[i].Date;
          var tempYear = +tempTimeString.slice(0, 4);
          var tempMonth = +tempTimeString.slice(5, 7) - 1;
          var tempDay = +tempTimeString.slice(8, 10);
          var tempHours = +tempTimeString.slice(11, 13);
          var tempMinutes = +tempTimeString.slice(14, 16);
          var tempArr = [];
          tempArr.push(Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes));
          tempArr.push(data[i].Value);
          resultArr.push(tempArr);
        } // lastPoint = resultArr[resultArr.length-1];
        // // в перший раз тимчасова точка (145 рандомна) = 144
        // resultArr.push(resultArr[resultArr.length-1]);

      } else if (dataType == 'candlestick' || dataType == 'ohlc') {
        // [{'DateOpen':'date1', 'DateClose':'date2', 'Open':'number1', 'Hight':'number2', 'Low':'number3', 'Close':'number4'}, {...},{...}]
        // -> -> -> -> ->
        // [[date2, number1, number2, number3, number4],[...],[...]]
        for (var _i3 = 0; _i3 < data.length; _i3++) {
          var _tempTimeString = data[_i3].DateOpen;

          var _tempYear = +_tempTimeString.slice(0, 4);

          var _tempMonth = +_tempTimeString.slice(5, 7) - 1;

          var _tempDay = +_tempTimeString.slice(8, 10);

          var _tempHours = +_tempTimeString.slice(11, 13);

          var _tempMinutes = +_tempTimeString.slice(14, 16);

          var _tempArr = [];

          _tempArr.push(Date.UTC(_tempYear, _tempMonth, _tempDay, _tempHours, _tempMinutes));

          _tempArr.push(data[_i3].Open);

          _tempArr.push(data[_i3].Hight);

          _tempArr.push(data[_i3].Low);

          _tempArr.push(data[_i3].Close);

          resultArr.push(_tempArr);
        } // // в перший раз тимчасова точка (145 рандомна) бере значення у Close 144-ї
        // tempPoint.push([lastPoint[0], lastPoint[4], lastPoint[4], lastPoint[4], lastPoint[4]]);
        // resultArr.push(tempPoint);

      }

      drawChart(resultArr);
    }
  });
}

function drawChart(data) {
  var table, mapping, chart; // витираємо попередній графік, якщо він є

  $('#graphic').empty(); // для роботи AnyStock Charts потрібні дані у форматі table-formatted data

  table = anychart.data.table();
  table.addData(data);

  if (dataType == 'areaspline') {
    // відображення даних
    mapping = table.mapAs();
    mapping.addField('value', 1, 'last'); // створити графік типу stock

    chart = anychart.stock(); // створити лінію на графіку певного типу (spline/candlestick/ohlc)

    chart.plot(0).spline(mapping);
  } else if (dataType == 'candlestick') {
    // відображення даних
    mapping = table.mapAs();
    mapping.addField('open', 1, 'first');
    mapping.addField('high', 2, 'max');
    mapping.addField('low', 3, 'min');
    mapping.addField('close', 4, 'last'); // mapping.addField('value', 4, 'last');
    // створити графік типу stock

    chart = anychart.stock(); // створити лінію на графіку певного типу (spline/candlestick/ohlc)

    chart.plot(0).candlestick(mapping);
  } else if (dataType == 'ohlc') {
    // відображення даних
    mapping = table.mapAs();
    mapping.addField('open', 1, 'first');
    mapping.addField('high', 2, 'max');
    mapping.addField('low', 3, 'min');
    mapping.addField('close', 4, 'last'); // mapping.addField('value', 4, 'last');
    // створити графік типу stock

    chart = anychart.stock(); // створити лінію на графіку певного типу (spline/candlestick/ohlc)

    chart.plot(0).ohlc(mapping);
  } // var indicator = chart.plot(0).priceIndicator(0, {value: 'first-visible'});
  // var grouping = chart.grouping();
  // grouping.minPixPerPoint(40);
  // Заголовок графіка


  chart.title(stringSymbol); // вписати графік в контейнер

  chart.container("graphic"); // ініціалізувати графік

  chart.draw(); // стерти водяний знак

  document.getElementsByClassName('anychart-credits')[0].remove(); // // витерти останню точку графіка
  // setTimeout(function(){
  //   table.remove( data[data.length-1][0], data[data.length-1][0] );
  // }, 3000);
} // ↑↑↑ FUNCTIONS DECLARATION ↑↑↑
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function getCoords(elem) {
//   var box = elem.getBoundingClientRect();
//   return {
//     top    : box.top + pageYOffset,
//     bottom : box.bottom + pageYOffset,
//     left   : box.left + pageXOffset,
//     right  : box.right + pageXOffset,
//     height : box.bottom - box.top,
//     width  : box.right - box.left
//   };
// }
// // made by waldteufel@ukr.net