////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ VARIABLES DECLARATION ↓↓↓
let domain        = 'http://185.229.227.61:10002';

let dataType      = 'areaspline', // тип графіку 'areaspline'/'candlestick'/'ohlc'
    timeStep      = 5,            // інтервал між точками на графіку
    stringType    = '?',          // тип даних: '?' для areaspline та 'Ohlc?' для candlestick/ohlc
    stringSymbol  = 'EURUSD',     // назва торгової пари, потрібна для формування рядка запиту
    resultArr     = [],           // масив з перероблених вхідних даних, придатний для обробки бібліотекою
    tailPoint     = [];           // хвостова (рандомна) точка графіка

let table, lineMapping, OHLCMapping, chart, line;

let dataСrosshair = 'sticky';
let dataScroller  = 'off';

// ↑↑↑ VARIABLES DECLARATION ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ START WORKING ↓↓↓

getDataArr();

// ↑↑↑ START WORKING ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ TYPE/TIME-SWITCH-BUTTONS BEHAVIOR ↓↓↓

let arrOfTypeBtns  = $('.graphic__type-btn');
let arrOfTimerBtns = $('.graphic__time-btn');

$(arrOfTypeBtns).click(function(){
  // type-buttons highlighting
  for (let i = 0; i < arrOfTypeBtns.length; i++) {
    $(arrOfTypeBtns[i]).removeClass('graphic__btn_active');
    $(this).addClass('graphic__btn_active');
    // визначення типу графіку
    dataType = $(this).attr('data-type');
  }

  // time-buttons highlighting + визначення stringType: ? / Ohlc?
  if (dataType == 'candlestick' || dataType == 'ohlc') {
    for (let i = 0; i < arrOfTimerBtns.length; i++) {
      // якщо на candlestick/ohlc нема відповідного часового інтервалу, переключати на 30хв
      if ($(arrOfTimerBtns[i]).attr('data-time') != '30' && $(arrOfTimerBtns[i]).attr('data-time') != '60') {
        if ($(arrOfTimerBtns[i]).hasClass('graphic__btn_active')) {
          $(arrOfTimerBtns[3]).addClass('graphic__btn_active');
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
    $(arrOfTimerBtns[i]).removeClass('graphic__btn_active');
    $(this).addClass('graphic__btn_active');
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
    $(arrOfCrosshairsBtns[i]).removeClass('graphic__btn_active');
    $(this).addClass('graphic__btn_active');
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
    $(arrOfScrollerBtns[i]).removeClass('graphic__btn_active');
    $(this).addClass('graphic__btn_active');
  }

  // визначення стану скролу
  dataScroller = $(this).attr('data-scroll');

  toggleScroller ()
});

// ↑↑↑ SCROLLER-SWITCH-BUTTONS BEHAVIOR ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ DRAWING TOOLS ↓↓↓

$('[data-annotation-type]').click(function(){

  let drawingType = $(this).attr('data-annotation-type');

  if ( drawingType == 'removeAllAnnotations' ) {
    chart.annotations().removeAllAnnotations();
  } else if ( drawingType == 'label' ) {

    // an auxiliary variable for working with annotations
    let plot = chart.plot(0);
    let controller = plot.annotations();
    controller.label({
        xAnchor: "center-top",
        valueAnchor: 17.24,
        text: "Buy"
    });

    // start drawing the annotation
    // controller.startDrawing(drawingType);

  } else {

    // an auxiliary variable for working with annotations
    let plot = chart.plot(0);
    let controller = plot.annotations();

    // start drawing the annotation
    controller.startDrawing(drawingType);

  }
});



// ↑↑↑ DRAWING TOOLS ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ FUNCTIONS DECLARATION ↓↓↓

function getDataArr() {
// формує рядок запиту, визначає тип графіку і формує масив, придатний для обробки бібліотекою
// викликає функцію перемальовування графіку
// викликає функцію позначення типу курсору
// викликає функцію включення/виключення скролу часу графіка

    $.ajax({
    url     : domain + '/api/Stock' + stringType + 'timer=' + timeStep + '&symbol=' + stringSymbol,
    success : function (data) {

      resultArr  = [];

      if (dataType == 'areaspline') {

        // [{Date: "2019-07-17T18:58:00Z", Value: 1.23456, IsBrake: false },{...},{...}]
        // -> -> -> -> ->
        // [[Date.UTC(2019, 07, 17, 18, 58), 1.23456],[...],[...]]
        for (let i = 0; i < data.length; i++) {

          let tempTimeString = data[i].Date;
          let tempYear       = +tempTimeString.slice(0,4);
          let tempMonth      = +tempTimeString.slice(5,7) - 1;
          let tempDay        = +tempTimeString.slice(8,10);
          let tempHours      = +tempTimeString.slice(11,13);
          let tempMinutes    = +tempTimeString.slice(14,16);

          let tempArr = [];
          tempArr.push( Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes) );
          // tempArr.push(  data[i].Date );
          tempArr.push(  data[i].Value );

          resultArr.push( tempArr );
        }

        // в перший раз хвостова (рандомна) точка береться з останньої точки графіка
        tailPoint = resultArr[resultArr.length-1];
        resultArr.push( tailPoint );

      } else if ( dataType == 'candlestick' || dataType == 'ohlc' ) {

        // [{'DateOpen':'date1', 'DateClose':'date2', 'Open':'number1', 'Hight':'number2', 'Low':'number3', 'Close':'number4'}, {...},{...}]
        // -> -> -> -> ->
        // [[date2, number1, number2, number3, number4],[...],[...]]

        for (let i = 0; i < data.length; i++) {

          let tempTimeString = data[i].DateClose;
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

        // в перший раз хвостова (рандомна) точка береться з останньої точки графіка (з Close)
        tailPoint[0] = resultArr[resultArr.length-1][0];
        tailPoint[1] = resultArr[resultArr.length-1][1];
        tailPoint[2] = resultArr[resultArr.length-1][2];
        tailPoint[3] = resultArr[resultArr.length-1][3];
        tailPoint[4] = resultArr[resultArr.length-1][4];

        resultArr.push( tailPoint );
      }

      drawChart();
      setCrosshairType();
      toggleScroller();
    }
  });
}

function drawChart() {

  // витираємо попередній графік, якщо він є
  $('#graphic').empty();

  // для роботи AnyStock Charts потрібні дані у форматі table-formatted data
  table = anychart.data.table();
  table.addData(resultArr);

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

  // Заголовок графіка
  chart.title(stringSymbol);

  // назва конкретної лінії на графіку
  line.name(stringSymbol);

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

// add sma indicator
chart.plot(0).sma(lineMapping, 0, "line");

  // вписати графік в контейнер
  chart.container("graphic");

  // ініціалізувати графік
  chart.draw();

  // стерти водяний знак
  document.getElementsByClassName('anychart-credits')[0].remove();
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
    if ( dataType == 'areaspline' ) {
      chart.scroller().line(lineMapping);
    } else if ( dataType == 'candlestick' ) {
      chart.scroller().candlestick(OHLCMapping);
    } else if ( dataType == 'ohlc' ) {
      chart.scroller().ohlc(OHLCMapping);
    }
  }
}

function wagTheTail(point) {
// тягає хвостик - крайню праву точку (тимчасову): видаляє точку, додає точку
// викликається зі сторони бекенду

  let tempYear       = +point.time.slice(0,4);
  let tempMonth      = +point.time.slice(5,7) - 1;
  let tempDay        = +point.time.slice(8,10);
  let tempHours      = +point.time.slice(11,13);
  let tempMinutes    = +point.time.slice(14,16);

  let time = Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes) ;
  let value = Math.round(point.value*100000)/100000;

  // видалити хвостову (рандомну) точку
  table.remove( resultArr[resultArr.length-1][0], resultArr[resultArr.length-1][0] );

  if ( dataType == 'areaspline' ) {

    table.addData( [[time, value]] );

  } else if ( dataType == 'candlestick' || dataType == 'ohlc' ) {

    tailPoint[0] = time;
    tailPoint[4] = value;

    if ( tailPoint[2] < value || !tailPoint[2] ) { tailPoint[2] = value }
    if ( tailPoint[3] > value || !tailPoint[3] ) { tailPoint[3] = value }

    table.addData( [tailPoint] );

    // console.log(tailPoint);
  }
}

function addPoint() {
// додає у графік нову точку
// викликається зі сторони бекенду

  $.ajax({
    url     : domain + '/api/Stock' + stringType + 'timer=' + timeStep + '&symbol=' + stringSymbol,
    success : function (data) {

      // видалити хвостову (рандомну) точку
      table.remove( resultArr[resultArr.length-1][0], resultArr[resultArr.length-1][0] );

      let newPoint = data[data.length-1];

      if (dataType == 'areaspline') {
        let tempYear    = +newPoint.Date.slice(0,4);
        let tempMonth   = +newPoint.Date.slice(5,7) - 1;
        let tempDay     = +newPoint.Date.slice(8,10);
        let tempHours   = +newPoint.Date.slice(11,13);
        let tempMinutes = +newPoint.Date.slice(14,16);
        let time        = Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes);

        // додати реальну точку
        table.addData( [[time, newPoint.Value]] );

        // відновити хвостик
        table.addData( [[time+1000, newPoint.Value]] );

      } else if ( dataType == 'candlestick' || dataType == 'ohlc' ) {
        let tempYear    = +newPoint.DateClose.slice(0,4);
        let tempMonth   = +newPoint.DateClose.slice(5,7) - 1;
        let tempDay     = +newPoint.DateClose.slice(8,10);
        let tempHours   = +newPoint.DateClose.slice(11,13);
        let tempMinutes = +newPoint.DateClose.slice(14,16);
        let time        = Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes);

        // додати реальну точку
        table.addData( [[time, newPoint.Open, newPoint.Hight, newPoint.Low, newPoint.Close]] );

        // відновити хвостик
        table.addData( [[time, newPoint.Close, newPoint.Close, newPoint.Close, newPoint.Close]] );
      }
    }
  });

}

// ↑↑↑ FUNCTIONS DECLARATION ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ TEST ↓↓↓

setInterval(function(){
  $.ajax({
    url     : domain + '/api/Stock?timer=realOne&symbol=' + stringSymbol,
    success : function (data) {
      wagTheTail({time: data[0].Date, value: data[0].Value});
    }
  });
},2000);

// setTimeout(function(){
//   addPoint();
// },5000);

// ↑↑↑ TEST ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

