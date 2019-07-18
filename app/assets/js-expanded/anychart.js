////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ VARIABLES DECLARATION ↓↓↓

let dataType           = 'areaspline', // тип графіку 'areaspline'/'candlestick'/'ohlc'
    timeStep           = 5,            // інтервал між точками на графіку
    stringType         = '?',          // тип даних: '?' для areaspline та 'Ohlc?' для candlestick/ohlc
    stringSymbol       = 'EURUSD',     // назва торгової пари, потрібна для формування рядка запиту
    dataArr,                           // адреса для отримання масиву даних
    resultArr          = [];           // масив з перероблених вхідних даних, придатний для обробки бібліотекою

// ↑↑↑ VARIABLES DECLARATION ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ TYPE/TIME-SWITCH-BUTTONS BEHAVIOR ↓↓↓

let arrOfTypeBtns  = $('.graphic__type-btn');
let arrOfTimerBtns = $('.graphic__time-btn');

$(arrOfTypeBtns).click(function(){
  // type-buttons highlighting
  for (let i = 0; i < arrOfTypeBtns.length; i++) {
    $(arrOfTypeBtns[i]).removeClass('graphic__type-btn_active');
    $(this).addClass('graphic__type-btn_active');
    // визначення типу графіку
    dataType = $(this).attr('data-type');
  }

  // time-buttons highlighting + визначення stringType: ? / Ohlc?
  if (dataType == 'candlestick' || dataType == 'ohlc') {
    for (let i = 0; i < arrOfTimerBtns.length; i++) {
      // якщо на candlestick/ohlc нема відповідного часового інтервалу, переключати на 30хв
      if ($(arrOfTimerBtns[i]).attr('data-time') != '30' && $(arrOfTimerBtns[i]).attr('data-time') != '60') {
        if ($(arrOfTimerBtns[i]).hasClass('graphic__time-btn_active')) {
          $(arrOfTimerBtns[3]).addClass('graphic__time-btn_active');
          timeStep = 30;
        }
        $(arrOfTimerBtns[i]).css({'display':'none'}).removeClass('graphic__time-btn_active');
      }
    }
    stringType = 'Ohlc?';
  } else {
    for (var i = 0; i < arrOfTimerBtns.length; i++) {
      $(arrOfTimerBtns[i]).css({'display':'inline-block'});
    }
    stringType = '?';
  }
  getDataArr();
});

$(arrOfTimerBtns).click(function(){
  // підсвітка кнопок часу та вибір інтервалу, потрібного для формування рядка запиту
  for (var i = 0; i < arrOfTimerBtns.length; i++) {
    $(arrOfTimerBtns[i]).removeClass('graphic__time-btn_active');
    $(this).addClass('graphic__time-btn_active');
  }
  timeStep = +$(this).attr('data-time');
  getDataArr()
});

// ↑↑↑ TYPE/TIME-SWITCH-BUTTONS BEHAVIOR ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ GRAPHIC DRAWING ↓↓↓

// anychart.onDocumentLoad(function () {

//   // масив даних для побудови графіка
//   var data = [
//     [Date.UTC(2007, 7, 23), 23.55, 23.88, 23.38, 23.62],
//     [Date.UTC(2007, 7, 24), 22.65, 23.7, 22.65, 23.36],
//     [Date.UTC(2007, 7, 25), 22.75, 23.7, 22.69, 23.44],
//     [Date.UTC(2007, 7, 26), 23.2, 23.39, 22.87, 22.92],
//     [Date.UTC(2007, 7, 27), 23.98, 24.49, 23.47, 23.49],
//     [Date.UTC(2007, 7, 30), 23.55, 23.88, 23.38, 23.62],
//     [Date.UTC(2007, 7, 31), 23.88, 23.93, 23.24, 23.25],
//     [Date.UTC(2007, 8, 1), 23.17, 23.4, 22.85, 23.25],
//     [Date.UTC(2007, 8, 2), 22.65, 23.7, 22.65, 23.36],
//     [Date.UTC(2007, 8, 3), 23.2, 23.39, 22.87, 22.92],
//     [Date.UTC(2007, 8, 6), 23.03, 23.15, 22.44, 22.97],
//     [Date.UTC(2007, 8, 7), 22.75, 23.7, 22.69, 23.44]
//   ];

//   // створити об'єкт anychart
//   var chart = anychart.candlestick();

//   // create custom Date Time scale
//   var dateTimeScale = anychart.scales.dateTime();

//   // apply Date Time scale
//   chart.xScale(dateTimeScale);

//   // створити лінію на графіку
//   var series = chart.candlestick(data);

//   // set chart title
//   chart.title("Top 5 pancake fillings");

//   // set the container element
//   chart.container("graphic");

//   // initiate chart display
//   chart.draw();

//   // стерти водяний знак
//   document.getElementsByClassName('anychart-credits')[0].remove();
// });

// ↑↑↑ GRAPHIC DRAWING ↑↑↑

getDataArr();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ FUNCTIONS DECLARATION ↓↓↓

function getDataArr() {
// формує рядок запиту, визначає тип графіку і формує масив, придатний для обробки бібліотекою.
// Викликає функцію перемальовування графіку.

  dataArr = 'https://central.investingcase.com/api/Stock' + stringType + 'timer=' + timeStep + '&symbol=' + stringSymbol;
    $.ajax({
    url     : dataArr,
    success : function (data) {

      resultArr  = [];

      if (dataType == 'areaspline') {

        // [{Date: "2019-07-17T18:58:00Z", Value: 1.23456, IsBrake: false },{...},{...}]
        // -> -> -> -> ->
        // [{x: Date.UTC(2019, 07, 17, 18, 58), value: 1.23456},{...},{...}]
        for (let i = 0; i < data.length; i++) {

          let tempTimeString = data[i].Date;
          let tempYear       = +tempTimeString.slice(0,4);
          let tempMonth      = +tempTimeString.slice(5,7) - 1;
          let tempDay        = +tempTimeString.slice(8,10);
          let tempHours      = +tempTimeString.slice(11,13);
          let tempMinutes    = +tempTimeString.slice(14,16);

          let tempObj = {};
          tempObj.x = Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes);
          tempObj.value = data[i].Value;

          resultArr.push(tempObj);
        }

        // lastPoint = resultArr[resultArr.length-1];
        // // в перший раз тимчасова точка (145 рандомна) = 144
        // resultArr.push(resultArr[resultArr.length-1]);

      } else if ( dataType == 'candlestick' || dataType == 'ohlc' ) {

        // [{'DateOpen':'date1', 'DateClose':'date2', 'Open':'number1', 'Hight':'number2', 'Low':'number3', 'Close':'number4'}, {...},{...}]
        // -> -> -> -> ->
        // [[date2, number1, number2, number3, number4],[...],[...]]

        for (let i = 0; i < data.length; i++) {

          let tempTimeString = data[i].DateOpen;
          let tempYear       = +tempTimeString.slice(0,4);
          let tempMonth      = +tempTimeString.slice(5,7) - 1;
          let tempDay        = +tempTimeString.slice(8,10);
          let tempHours      = +tempTimeString.slice(11,13);
          let tempMinutes    = +tempTimeString.slice(14,16);

          let tempArr = [];

          tempArr.push( Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes) );
          tempArr.push(data[i].Open);
          tempArr.push(data[i].Hight);
          tempArr.push(data[i].Low);
          tempArr.push(data[i].Close);
          resultArr.push(tempArr);
        }

        // // в перший раз тимчасова точка (145 рандомна) бере значення у Close 144-ї
        // tempPoint.push([lastPoint[0], lastPoint[4], lastPoint[4], lastPoint[4], lastPoint[4]]);
        // resultArr.push(tempPoint);
      }

      drawChart(resultArr);
    }
  });
}

function drawChart(data) {

  // витираємо попередній графік, якщо він є
  $('#graphic').empty();
  let chart, series;
  if ( dataType == 'ohlc' ) {
    // створити об'єкт anychart
    chart = anychart.ohlc();
    // створити лінію на графіку
    series = chart.ohlc(data);
  }
  else if ( dataType == 'candlestick' ) {
    // створити об'єкт anychart
    chart = anychart.candlestick();
    // створити лінію на графіку
    series = chart.candlestick(data);
  }
  else if ( dataType == 'areaspline' ) {
    // створити об'єкт anychart
    chart = anychart.line();
    // створити лінію на графіку
    series = chart.spline(data);
  }

  // вісь абсцис - час
  var dateTimeScale = anychart.scales.dateTime();
  chart.xScale(dateTimeScale);

  // Заголовок графіка
  chart.title(stringSymbol);

  // вписати графік в контейнер
  chart.container("graphic");

  // ініціалізувати графік
  chart.draw();

  // стерти водяний знак
  document.getElementsByClassName('anychart-credits')[0].remove();

}
// ↑↑↑ FUNCTIONS DECLARATION ↑↑↑

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