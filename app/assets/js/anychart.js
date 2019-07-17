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

  console.log("\ndataType : ".concat(dataType, "\ntimeStep : ").concat(timeStep, "\n\u0437\u0430\u043F\u0438\u0442 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440, \u043F\u0435\u0440\u0435\u043C\u0430\u043B\u044C\u043E\u0432\u0443\u0432\u0430\u0442\u0442\u044F \u0433\u0440\u0430\u0444\u0456\u043A\u0443\n")); // getDataArr();
});
$(arrOfTimerBtns).click(function () {
  // підсвітка кнопок часу та вибір інтервалу, потрібного для формування рядка запиту
  for (var i = 0; i < arrOfTimerBtns.length; i++) {
    $(arrOfTimerBtns[i]).removeClass('graphic__time-btn_active');
    $(this).addClass('graphic__time-btn_active');
  }

  timeStep = +$(this).attr('data-time');
  console.log("\ndataType : ".concat(dataType, "\ntimeStep : ").concat(timeStep, "\n\u0437\u0430\u043F\u0438\u0442 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440, \u043F\u0435\u0440\u0435\u043C\u0430\u043B\u044C\u043E\u0432\u0443\u0432\u0430\u0442\u0442\u044F \u0433\u0440\u0430\u0444\u0456\u043A\u0443\n")); // getDataArr()
}); // ↑↑↑ TYPE/TIME-SWITCH-BUTTONS BEHAVIOR ↑↑↑
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ GRAPHIC DRAWING ↓↓↓

anychart.onDocumentLoad(function () {
  // масив даних для побудови графіка
  var data = [{
    x: Date.UTC(2000, 1, 1),
    value: 10000
  }, {
    x: Date.UTC(2000, 2, 1),
    value: 12000
  }, {
    x: Date.UTC(2000, 3, 1),
    value: 18000
  }, {
    x: Date.UTC(2000, 4, 1),
    value: 11000
  }, {
    x: Date.UTC(2000, 5, 1),
    value: 9000
  }]; // створити об'єкт anychart

  var chart = anychart.line(); // create custom Date Time scale

  var dateTimeScale = anychart.scales.dateTime(); // apply Date Time scale

  chart.xScale(dateTimeScale); // створити лінію на графіку

  var series = chart.spline(data); // set chart title

  chart.title("Top 5 pancake fillings"); // set the container element

  chart.container("graphic"); // initiate chart display

  chart.draw(); // стерти водяний знак

  document.getElementsByClassName('anychart-credits')[0].remove();
}); // ↑↑↑ GRAPHIC DRAWING ↑↑↑

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
        console.log("areaspline"); // [{...},{...},{...}] -> [[...],[...],[...]]

        for (var i = 0; i < data.length; i++) {
          var tempArr = [];
          var tempTime = new Date(data[i].Date);
          tempArr.push(tempTime);
          tempArr.push(data[i].Value);
          resultArr.push(tempArr);
        } // lastPoint = resultArr[resultArr.length-1];
        // в перший раз тимчасова точка (145 рандомна) = 144


        resultArr.push(resultArr[resultArr.length - 1]);
      } else if (dataType == 'candlestick' || dataType == 'ohlc') {
        // [{'DateOpen':'date1', 'DateClose':'date2', 'Open':'number1', 'Hight':'number2', 'Low':'number3', 'Close':'number4'}, {...},{...}]
        // -> -> -> -> ->
        // [[date2, number1, number2, number3, number4],[...],[...]]
        for (var i = 0; i < data.length; i++) {
          var tempArr = [];
          var tempTime = new Date(data[i].DateClose);
          tempArr.push(tempTime);
          tempArr.push(data[i].Open);
          tempArr.push(data[i].Hight);
          tempArr.push(data[i].Low);
          tempArr.push(data[i].Close);
          resultArr.push(tempArr);
        }

        lastPoint = resultArr[resultArr.length - 1];
        tempPoint = []; // в перший раз тимчасова точка (145 рандомна) бере значення у Close 144-ї

        tempPoint.push([lastPoint[0], lastPoint[4], lastPoint[4], lastPoint[4], lastPoint[4]]);
        resultArr.push(tempPoint);
      }
    }
  });
} // ↑↑↑ FUNCTIONS DECLARATION ↑↑↑
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// var pointStart,                        // перша точка графіку
//     startTime,                         // час першої точки графіку
//     lastPoint,                         //
//     tempPoint,                         //
//     сontrolPoint,                      // остання точка масиву, потрібна для порівняння: якщо вона не рівна останній точці масиву, значить масив оновився і графік потрібно перемалювати
//     сontrolPoint2,                     // -- // --  -- // --
//     YPlotLinesValue,                   // величина, від якої малюється положення червоної лінії
//     interval,                          // setInterval
//     resultArr          = [],           // масив з перероблених вхідних даних, придатний для обробки бібліотекою
//     stringType         = '?',          // тип даних: ? для areaspline та Ohlc? для candlestick/ohlc
//     stringSymbol       = 'EURUSD',     // назва торгової пари, потрібна для формування рядка запиту
//     dataType           = 'areaspline', // тип графіку areaspline/candlestick/ohlc
//     timeStep           = 5,            // інтервал між точками на графіку
//     dataArr,                           // адреса для отримання масиву даних
//     dataOne,                           // адреса для отримання поточного значення
//     labelValue1        = 0,
//     labelValue2        = 0,
//     YPlotLinesValue    = 0,            // змінні для визначення тенденції в котировках (потрібні для зафарбовування рамки поточного значення)
//     labelTextColor     = 'black',      // колір поточного значення
//     chart,                             // об'єкт Highcharts робимо доступним глобально для усіх функцій
//     simpleLineColor      = '#308f32',  //'orange';
//     plotLineColor        = '#308f32',
//     topLabelTextColor    = '#308f32',
//     bottomLabelTextColor = 'red';
// //визначаємо ширину вікна, у залежності від неї графік має різнуй відступ справа
// let graphicPaddingRight = 0;
// // let labelBorderTop      = 292;
// // if (document.documentElement.clientWidth > 619 ) {
// //   labelBorderTop      = 267;
// // }
// if (document.documentElement.clientWidth > 768 ) {
//   graphicPaddingRight = 80;
//   // labelBorderTop      = 288;
// }
// getDataArr();
// // ↓↓↓ functions declarations ↓↓↓
// function getDataArr() {
//   // формує рядок запиту, визначає тип графіку і формує масив, придатний для обробки бібліотекою.
//   // Викликає функцію перемальовування графіку.
//   dataArr = 'https://central.investingcase.com/api/Stock' + stringType + 'timer=' + timeStep + '&symbol=' + stringSymbol;
//     $.ajax({
//     url     : dataArr,
//     success : function (data) {
//       resultArr  = [];
//       pointStart = 0;
//       startTime  = 0;
//       if (dataType == 'areaspline') {
//         YPlotLinesValue = data[data.length-1].Value;
//         // [{...},{...},{...}] -> [[...],[...],[...]]
//         for (var i = 0; i < data.length; i++) {
//           var tempArr = [];
//           var tempTime = new Date(data[i].Date);
//           tempArr.push(tempTime);
//           tempArr.push(data[i].Value);
//           resultArr.push(tempArr);
//         }
//         lastPoint = resultArr[resultArr.length-1];
//         // в перший раз тимчасова точка (145 рандомна) = 144
//         resultArr.push(resultArr[resultArr.length-1]);
//       } else if ( dataType == 'candlestick' || dataType == 'ohlc' ) {
//         YPlotLinesValue = data[data.length-1].Close;
//         // [{'DateOpen':'date1', 'DateClose':'date2', 'Open':'number1', 'Hight':'number2', 'Low':'number3', 'Close':'number4'}, {...},{...}]
//         // -> -> -> -> ->
//         // [[date2, number1, number2, number3, number4],[...],[...]]
//         for (var i = 0; i < data.length; i++) {
//           var tempArr = [];
//           var tempTime = new Date(data[i].DateClose);
//           tempArr.push(tempTime);
//           tempArr.push(data[i].Open);
//           tempArr.push(data[i].Hight);
//           tempArr.push(data[i].Low);
//           tempArr.push(data[i].Close);
//           resultArr.push(tempArr);
//         }
//         lastPoint = resultArr[resultArr.length-1];
//         tempPoint = [];
//         // в перший раз тимчасова точка (145 рандомна) бере значення у Close 144-ї
//         tempPoint.push([lastPoint[0], lastPoint[4], lastPoint[4], lastPoint[4], lastPoint[4]]);
//         resultArr.push(tempPoint);
//       }
//       // якщо точок забагато, контейнер їх не вміщує, і свічки замість 30/60 хв. стають по 1 - 6 годині,
//       // простий графік теж збивається
//       var containerWidth = $('#container').width();
//       if (1382 <= containerWidth && containerWidth < 1512) {
//         resultArr = resultArr.slice(14);
//       } else if (1032 <= containerWidth && containerWidth < 1382) {
//         resultArr = resultArr.slice(49);
//       } else if (872 <= containerWidth && containerWidth < 1032) {
//         resultArr = resultArr.slice(65);
//       } else if (742 <= containerWidth && containerWidth < 872) {
//         resultArr = resultArr.slice(77);
//       } else if (621 <= containerWidth && containerWidth < 742) {
//         resultArr = resultArr.slice(90);
//       } else if (468 <= containerWidth && containerWidth < 621) {
//         resultArr = resultArr.slice(106);
//       } else if (340 <= containerWidth && containerWidth < 468) {
//         resultArr = resultArr.slice(118);
//       } else if (containerWidth < 340) {
//         resultArr = resultArr.slice(124);
//       }
//       pointStart = resultArr[0];
//       startTime  = pointStart[0].getTime();
//       if (!сontrolPoint) {
//         // якщо сontrolPoint не призначена (перший вхід у функцію),
//         // призначаємо контрольні точки сontrolPoint2 = сontrolPoint = lastPoint[0].getTime(),
//         // та запускаємо відмальовування графіку drawChart()
//         сontrolPoint2 = сontrolPoint = lastPoint[0].getTime();
//         drawChart();
//       } else {
//         // якщо сontrolPoint уже призначена (вхід у функцію в циклі поки time > step з функції redrawSerie(x,y))
//         // порівнюємо сontrolPoint2 та сontrolPoint
//         сontrolPoint2 = lastPoint[0].getTime();
//         if (сontrolPoint != сontrolPoint2) {
//           // якщо контрольні точки різні, значить масив оновився, обнулюємо точки, перемальовуємо графік
//           сontrolPoint = сontrolPoint2 = undefined;
//           tempPoint = null;
//           drawChart();
//         } else {
//           // якщо time > step (уже потрібно малювати нову точку), але її поки ще в масиві нема
//           // зупиняємо відмальовування графіку та чекаємо на нову точку, після чого запускаємо відмальовування графіку
//           clearInterval(interval);
//           redrawChart();
//           interval = setInterval(function () {
//             $.ajax({
//               url     : dataArr,
//               success : function (data) {
//                           сontrolPoint2 = new Date (data[data.length-1].Date);
//                           сontrolPoint2 = сontrolPoint2.getTime();
//                           if (сontrolPoint != сontrolPoint2) {
//                           // якщо контрольні точки різні, значить масив оновився, обнулюємо точки, перемальовуємо графік
//                           сontrolPoint = сontrolPoint2 = undefined;
//                           drawChart();
//                         }
//               }
//             })
//           }, 1000);
//         }
//       }
//     }
//   });
// }
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
// // ↑↑↑ functions declarations ↑↑↑
// // made by waldteufel@ukr.net