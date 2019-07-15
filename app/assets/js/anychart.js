"use strict";

anychart.onDocumentLoad(function () {
  // create an instance of a pie chart
  var chart = anychart.pie(); // set the data

  chart.data([["Chocolate", 5], ["Rhubarb compote", 2], ["Crêpe Suzette", 2], ["American blueberry", 2], ["Buttermilk", 1]]); // set chart title

  chart.title("Top 5 pancake fillings"); // set the container element

  chart.container("graphic"); // initiate chart display

  chart.draw();
}); // var pointStart,                        // перша точка графіку
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
// // ↓↓↓ type/time-switch-buttons behavior ↓↓↓
// let arrOfTypeBtns  = $('.graphic-type-btn');
// let arrOfTimerBtns = $('.graphic-time-btn');
// $(arrOfTypeBtns).click(function(){
//   // type-buttons highlighting
//   for (let i = 0; i < arrOfTypeBtns.length; i++) {
//     $(arrOfTypeBtns[i]).removeClass('graphic-type-btn_active');
//     $(this).addClass('graphic-type-btn_active');
//     // визначення типу графіку
//     dataType = $(this).attr('data-type');
//   }
//   // time-buttons highlighting + визначення stringType: ? / Ohlc?
//   if (dataType == 'candlestick' || dataType == 'ohlc') {
//     for (let i = 0; i < arrOfTimerBtns.length; i++) {
//       // якщо на candlestick/ohlc нема відповідного часового інтервалу, переключати на 30хв
//       if ($(arrOfTimerBtns[i]).attr('data-time') != '30' && $(arrOfTimerBtns[i]).attr('data-time') != '60') {
//         if ($(arrOfTimerBtns[i]).hasClass('graphic-time-btn_active')) {
//           $(arrOfTimerBtns[3]).addClass('graphic-time-btn_active');
//           timeStep = 30;
//         }
//         $(arrOfTimerBtns[i]).css({'display':'none'}).removeClass('graphic-time-btn_active');
//       }
//     }
//     stringType = 'Ohlc?';
//   } else {
//     for (var i = 0; i < arrOfTimerBtns.length; i++) {
//       $(arrOfTimerBtns[i]).css({'display':'inline-block'});
//     }
//     stringType = '?';
//   }
//   getDataArr();
// });
// $(arrOfTimerBtns).click(function(){
//   // підсвітка кнопок часу та вибір інтервалу, потрібного для формування рядка запиту
//   for (var i = 0; i < arrOfTimerBtns.length; i++) {
//     $(arrOfTimerBtns[i]).removeClass('graphic-time-btn_active');
//     $(this).addClass('graphic-time-btn_active');
//   }
//   timeStep = +$(this).attr('data-time');
//   getDataArr()
// });
// // ↑↑↑ type/time-switch-buttons behavior ↑↑↑
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