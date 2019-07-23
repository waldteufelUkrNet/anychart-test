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

let table, lineMapping, OHLCMapping, chart, line;
let dataСrosshair = 'sticky';
let dataScroller  = 'off';

// ↑↑↑ VARIABLES DECLARATION ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

getDataArr();

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

// ↓↓↓ CROSSHAIR-SWITCH-BUTTONS BEHAVIOR ↓↓↓

let arrOfCrosshairsBtns = $('.graphic__crosshair-btn');
$(arrOfCrosshairsBtns).click(function(){
  // підсвітка кнопок типу курсору
  for (var i = 0; i < arrOfCrosshairsBtns.length; i++) {
    $(arrOfCrosshairsBtns[i]).removeClass('graphic__crosshair-btn_active');
    $(this).addClass('graphic__crosshair-btn_active');
  }
  // визначення типу курсору
  dataСrosshair = $(this).attr('data-crosshair');

  setCrosshairType()
});

// ↑↑↑ CROSSHAIR-SWITCH-BUTTONS BEHAVIOR ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ SCROLLER-SWITCH-BUTTONS BEHAVIOR ↓↓↓

let arrOfScrollerBtns = $('.graphic__scroller-btn');
$(arrOfScrollerBtns).click(function(){
  // підсвітка кнопок типу курсору
  for (var i = 0; i < arrOfScrollerBtns.length; i++) {
    $(arrOfScrollerBtns[i]).removeClass('graphic__scroller-btn_active');
    $(this).addClass('graphic__scroller-btn_active');
  }

  // визначення стану скролу
  dataScroller = $(this).attr('data-scroll');

  toggleScroller ()
});

// ↑↑↑ SCROLLER-SWITCH-BUTTONS BEHAVIOR ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ FUNCTIONS DECLARATION ↓↓↓

function getDataArr() {
// формує рядок запиту, визначає тип графіку і формує масив, придатний для обробки бібліотекою
// викликає функцію перемальовування графіку
// викликає функцію позначення типу курсору
// викликає функцію включення/виключення скролу часу графіка

  dataArr = 'http://185.229.227.61:10002/api/Stock' + stringType + 'timer=' + timeStep + '&symbol=' + stringSymbol;
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

          let tempArr = [];
          tempArr.push( Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes) );
          tempArr.push(  data[i].Value );

          resultArr.push( tempArr );
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
      setCrosshairType();
      toggleScroller();
    }
  });

}

function drawChart(data) {

  // витираємо попередній графік, якщо він є
  $('#graphic').empty();

  // для роботи AnyStock Charts потрібні дані у форматі table-formatted data
  table = anychart.data.table();
  table.addData(data);

  // способи відобрадення даних
  lineMapping = table.mapAs();
  lineMapping.addField('value', 1, 'last');

  OHLCMapping = table.mapAs();
  OHLCMapping.addField('open', 1, 'first');
  OHLCMapping.addField('high', 2, 'max');
  OHLCMapping.addField('low', 3, 'min');
  OHLCMapping.addField('close', 4, 'last');
  OHLCMapping.addField('value', 4, 'last');

  // створити графік типу stock
  chart = anychart.stock();

  if (dataType == 'areaspline') {
    // створити лінію на графіку певного типу (spline/candlestick/ohlc)
    line = chart.plot(0).spline(lineMapping);
    line.stroke("green", 1); // line.stroke("green", 1, "10 5", "round");
  }
  else if (dataType == 'candlestick' ) {
    // створити лінію на графіку певного типу (spline/candlestick/ohlc)
    line = chart.plot(0).candlestick(OHLCMapping);
    line.fallingFill("red").fallingStroke("red");
    line.risingFill("green").risingStroke("green");
  }
  else if (dataType == 'ohlc') {
    // створити лінію на графіку певного типу (spline/candlestick/ohlc)
    line = chart.plot(0).ohlc(OHLCMapping);
    line.fallingStroke("red");
    line.risingStroke("green");
  }

  // var grouping = chart.grouping();
  // grouping.minPixPerPoint(40);
  // grouping.enabled(false);

  // Заголовок графіка
  chart.title(stringSymbol);

  // назва конкретної лінії на графіку
  line.name(stringSymbol);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // додати засічки на осі абсцис
  let xAxis = chart.plot().xAxis();
  xAxis.labels({anchor: 'left-top'});
  xAxis.minorLabels({anchor: 'left-top'});
  xAxis.ticks(true); // або .ticks({stroke: '#F44336'});
  xAxis.minorTicks(true);

  // xAxis.labels().format('{%Value}{dateTimeFormat:yyyy-MM-dd hh:mm}');
  // xAxis.minorLabels().format('{%Value}{dateTimeFormat:hh:mm}');

  // xAxis.background("#BBDEFB");
  // xAxis.height(60);

  //розташування засічок inside/outside
  // xAxis.ticks().position("inside");
  xAxis.minorTicks().position("inside")

  // перенести вісь ординат зліва направо
  chart.plot().yAxis().orientation("right");
  chart.padding(0, 80, 10, 10);

  // підпис осі ординат
  // let yTitle = chart.plot().yAxis().title();
  // yTitle.enabled(true);
  // yTitle.text("Units");
  // yTitle.align("bottom");

  // додаткова вісь ординат справа
  // var extraYAxis = chart.plot().yAxis(1);
  // extraYAxis.orientation("right");

  // enable major grids
  chart.plot().xGrid().enabled(true);
  chart.plot().yGrid().enabled(true); // стиль лінії .stroke({dash: "13 5"});
  // enable minor grids
  chart.plot().xMinorGrid().enabled(true);
  chart.plot().yMinorGrid().enabled(true);

  // стилізація перехрестя
  chart.plot().crosshair().xStroke("red", 1); // .xStroke("#00bfa5", 1.5, "10 5", "round");

  // сховати перехрестя
  // chart.plot().crosshair().yStroke(null);

  // поточне значення (т.зв. плот-лінія)
  let indicator = chart.plot().priceIndicator();
  indicator.value('last-visible');
  indicator.stroke("green", 1, "2 2");
  indicator.label().background().fill("green");
  indicator.label().fontColor("white");

  // виключення скролу часу в графіку
  chart.scroller().enabled(false);

  // ???
  // chart.plot().xAxis().showHelperLabel(false);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // вписати графік в контейнер
  chart.container("graphic");

  // ініціалізувати графік
  chart.draw();

  // стерти водяний знак
  document.getElementsByClassName('anychart-credits')[0].remove();

  // витерти останню точку графіка
  // setTimeout(function(){
  //   table.remove( data[data.length-1][0], data[data.length-1][0] );
  // }, 3000);

}

function setCrosshairType() {
// змінює властивості anychart під потрібний вигляд курсору
  if ( dataСrosshair == 'float' ) {
    chart.crosshair(true);
    chart.crosshair().displayMode("float");
  } else if ( dataСrosshair == 'disable' ) {
    chart.crosshair(false);
  } else {
    chart.crosshair(true);
    chart.crosshair().displayMode("sticky");
  }
}

function toggleScroller() {
// включає/виключає скрол часу в графіку
  if ( dataScroller == 'off' ) {
    chart.scroller().enabled(false);
  } else if ( dataScroller == 'on' ) {
    chart.scroller().enabled(true);
  }
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