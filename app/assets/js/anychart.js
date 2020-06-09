"use strict";

// http://195.201.39.116:81/api/Stock?timer=1Ms&symbol=EURUSD
// https://core.crmhub.info/api/Ohlc?timer=30Ms&symbol=EURUSD
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ VARIABLES DECLARATION ↓↓↓
// let domain        = 'https://core.crmhub.info';
var domain = 'https://stock.crmhub.info';
var dataType = 'candlestick',
    // тип графіку 'areaspline'/'candlestick'/'ohlc'
timeStep = '15Ms',
    // інтервал між точками на графіку
stringType = 'Ohlc?',
    // тип даних: 'Stock?' для areaspline та 'Ohlc?' для candlestick/ohlc
stringSymbol = 'EURUSD',
    // назва торгової пари, потрібна для формування рядка запиту
resultArr = [],
    // масив з перероблених вхідних даних, придатний для обробки бібліотекою
tailPoint = []; // хвостова (рандомна) точка графіка

var table, lineMapping, OHLCMapping, chart, line;
var dataСrosshair = 'sticky';
var dataScroller = 'off';
var dataBreak = 'off'; // ↑↑↑ VARIABLES DECLARATION ↑↑↑
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ START WORKING ↓↓↓

getDataArr(); // ↑↑↑ /START WORKING ↑↑↑
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ APPROITNMENT OF EVENT HANDLERS ↓↓↓
// type-switch-buttons behavior

var arrOfTypeBtns = document.querySelectorAll('[data-graphic-type]');
addOnEventToObject('click', arrOfTypeBtns, setGraphicType); // time-switch-buttons behavior

var arrOfTimeBtns = document.querySelectorAll('[data-graphic-time]');
addOnEventToObject('click', arrOfTimeBtns, setGraphicTime); // crosshair-switch-buttons behavior

var arrOfCrosshairBtns = document.querySelectorAll('[data-graphic-crosshair]');
addOnEventToObject('click', arrOfCrosshairBtns, setGraphicCrosshair); // scroller-switch-buttons behavior

var arrOfScrollBtns = document.querySelectorAll('[data-graphic-scroll]');
addOnEventToObject('click', arrOfScrollBtns, setGraphicScroll); // drawing tools

var arrOfDrawingBtns = document.querySelectorAll('[data-annotation-type]');
addOnEventToObject('click', arrOfDrawingBtns, drawGraphicTools); // ↑↑↑ /APPROITNMENT OF EVENT HANDLERS ↑↑↑
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ FUNCTIONS DECLARATION ↓↓↓

/**
 * [getDataArr формує рядок запиту даних для графіка і викликає функцію
 * запиту]
 */

function getDataArr() {
  // let url = domain     + '/api/'    +
  //           stringType + 'timer='   +
  //           timeStep   + '&symbol=' +
  //           stringSymbol;
  var url = domain + '/' + stringType + 'timer=' + timeStep + '&symbol=' + stringSymbol;
  ajax(url, 'get', dataArrHandler);
}
/**
 * [dataArrHandler здійснює обробку отриманого із серверу масиву даних,
 * перетворюючи їх у формат, придатний для робити з ним бібліотеки anychart]
 * @param  {[String]} data [масив даних для побудови графіка у форматі рядка]
 */


function dataArrHandler(data) {
  var dataArr = JSON.parse(data);
  resultArr = [];

  if (dataType == 'areaspline') {
    // [{Date: "2019-07-17T18:58:00Z", Value: 1.23456, IsBrake: false },{...},{...}]
    // -> -> -> -> ->
    // [[Date.UTC(2019, 07, 17, 18, 58), 1.23456],[...],[...]]
    for (var i = 0; i < dataArr.length; i++) {
      var tempTimeString = dataArr[i].date;
      var tempYear = +tempTimeString.slice(0, 4);
      var tempMonth = +tempTimeString.slice(5, 7) - 1;
      var tempDay = +tempTimeString.slice(8, 10);
      var tempHours = +tempTimeString.slice(11, 13);
      var tempMinutes = +tempTimeString.slice(14, 16);
      var tempArr = [];
      tempArr.push(Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes));
      tempArr.push(dataArr[i].value);
      resultArr.push(tempArr);
    } // в перший раз хвостова (рандомна) точка береться з останньої точки графіка


    tailPoint = resultArr[resultArr.length - 1];
    resultArr.push(tailPoint);
  } else if (dataType == 'candlestick' || dataType == 'ohlc') {
    // [{'DateOpen':'date1', 'DateClose':'date2', 'Open':'number1', 'Hight':'number2', 'Low':'number3', 'Close':'number4'}, {...},{...}]
    // -> -> -> -> ->
    // [[date2, number1, number2, number3, number4],[...],[...]]
    for (var _i = 0; _i < dataArr.length; _i++) {
      var _tempTimeString = dataArr[_i].dateClose;

      var _tempYear = +_tempTimeString.slice(0, 4);

      var _tempMonth = +_tempTimeString.slice(5, 7) - 1;

      var _tempDay = +_tempTimeString.slice(8, 10);

      var _tempHours = +_tempTimeString.slice(11, 13);

      var _tempMinutes = +_tempTimeString.slice(14, 16);

      var _tempArr = [];

      _tempArr.push(Date.UTC(_tempYear, _tempMonth, _tempDay, _tempHours, _tempMinutes));

      _tempArr.push(dataArr[_i].open);

      _tempArr.push(dataArr[_i].hight);

      _tempArr.push(dataArr[_i].low);

      _tempArr.push(dataArr[_i].close);

      resultArr.push(_tempArr);
    } // в перший раз хвостова (рандомна) точка береться з останньої точки графіка (з Close)


    tailPoint[0] = resultArr[resultArr.length - 1][0];
    tailPoint[1] = resultArr[resultArr.length - 1][1];
    tailPoint[2] = resultArr[resultArr.length - 1][2];
    tailPoint[3] = resultArr[resultArr.length - 1][3];
    tailPoint[4] = resultArr[resultArr.length - 1][4];
    resultArr.push(tailPoint);
  }

  var loader = document.querySelector('#content .tab-body_active .loader');
  loader.style.display = 'none';
  drawChart(); // setGraphicCrosshair();
  // setGraphicScroll();
}
/**
 * [drawChart малює графік]
 */


function drawChart() {
  // визначаємо контейнер, який містить графік
  var container = document.querySelector('#content .tab-body_active .graphic'); // витираємо попередній графік, якщо він є

  container.innerHTML = ''; // для роботи AnyStock Charts потрібні дані у форматі table-formatted data

  table = anychart.data.table();
  table.addData(resultArr); // способи відобрадення даних

  lineMapping = table.mapAs();
  lineMapping.addField('value', 1, 'last');
  OHLCMapping = table.mapAs();
  OHLCMapping.addField('open', 1, 'first');
  OHLCMapping.addField('high', 2, 'max');
  OHLCMapping.addField('low', 3, 'min');
  OHLCMapping.addField('close', 4, 'last');
  OHLCMapping.addField('value', 4, 'last'); // створити графік типу stock

  chart = anychart.stock(); // створити лінію на графіку певного типу (spline/candlestick/ohlc) та стилізувати її

  if (dataType == 'areaspline') {
    line = chart.plot(0).spline(lineMapping);
    line.stroke("green", 1); // line.stroke("green", 1, "10 5", "round");
  } else if (dataType == 'candlestick') {
    line = chart.plot(0).candlestick(OHLCMapping);
    line.fallingFill("red").fallingStroke("red");
    line.risingFill("green").risingStroke("green");
  } else if (dataType == 'ohlc') {
    line = chart.plot(0).ohlc(OHLCMapping);
    line.fallingStroke("red");
    line.risingStroke("green");
  } // // Заголовок графіка
  // chart.title(stringSymbol);
  // назва конкретної лінії на графіку


  line.name(stringSymbol); // додати засічки на осі абсцис

  var xAxis = chart.plot().xAxis();
  xAxis.labels({
    anchor: 'left-top'
  });
  xAxis.minorLabels({
    anchor: 'left-top'
  });
  xAxis.ticks(true); // або .ticks({stroke: '#F44336'});

  xAxis.minorTicks(true); // форматування дати по осі абсцис

  xAxis.labels().format(function () {
    return anychart.format.dateTime(this.tickValue, "dd.MM.yy \n HH:mm");
  });
  xAxis.minorLabels().format(function () {
    return anychart.format.dateTime(this.tickValue, "dd.MM.yy \n HH:mm");
  }); // розташування засічок inside/outside

  xAxis.ticks().position("inside");
  xAxis.minorTicks().position("inside"); // задати висоту осі абсцис

  xAxis.height(36); // перенести вісь ординат зліва направо

  chart.plot().yAxis().orientation("right");
  chart.padding(0, 80, 10, 10); // додати розлінування полотна графіка

  chart.plot().xGrid().enabled(true);
  chart.plot().yGrid().enabled(true); // стиль лінії .stroke({dash: "13 5"});

  chart.plot().xMinorGrid().enabled(true);
  chart.plot().yMinorGrid().enabled(true); // стилізація перехрестя

  chart.plot().crosshair().xStroke("red", 1); // .xStroke("#00bfa5", 1.5, "10 5", "round");

  chart.plot().crosshair().yStroke("red", 1); // поточне значення (т.зв. плот-лінія)

  var indicator = chart.plot().priceIndicator();
  indicator.value('last-visible');
  indicator.stroke("green", 1, "2 2");
  indicator.label().background().fill("green");
  indicator.label().fontColor("white"); // виключення скролу часу в графіку

  chart.scroller().enabled(false); // форматування легенди графіка

  chart.plot().legend(true);
  chart.plot().legend().titleFormat("{%value}{dateTimeFormat: dd.MM.yyyy HH:mm}"); // форматування часових лейблів перехрестя

  chart.crosshair().xLabel().format(function () {
    return anychart.format.dateTime(this.tickValue, "dd.MM.yy hh:mm");
  });
  chart.crosshair().yLabel().format(function () {
    return this.value;
  }); // форматування часових лейблів полоси прокрутки

  chart.scroller().xAxis().labels().format(function () {
    return anychart.format.dateTime(this.tickValue, "dd.MM.yy hh:mm");
  });
  chart.scroller().xAxis().minorLabels().format(function () {
    return anychart.format.dateTime(this.tickValue, "dd.MM.yy hh:mm");
  }); // вписати графік в контейнер

  chart.container(container); // ініціалізувати графік

  chart.draw(); // стерти водяний знак

  document.getElementsByClassName('anychart-credits')[0].remove(); // ↓↓↓ indicators ↓↓↓
  // dont able: adl, cmf, cho, dmi, mfi, obv, rat
  // ↓↓↓ simple-plot-0-indicators ↓↓↓
  // ama                                    | plot(0) | 1 parameter: value
  // let mapping = table.mapAs({'value': 4});
  // chart.plot().ama(mapping).series();
  // Exponential Moving Average             | plot(0) | 1 parameter: value            | 1 add.param.: period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(0).ema(mapping, 10);
  // Modified Moving Average                | plot(0) | 1 parameter: value            | 1 add.param.: period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot().mma(mapping, 20);
  // Bollinger Bands                        | plot(0) | 1 parameter: value            | 2 add.param.: period, deviation
  // let mapping = table.mapAs({'value': 4});
  // chart.plot().bbands(mapping, 20, 2);
  // ↑↑↑ simple-plot-0-indicators ↑↑↑
  // ↓↓↓ ohlc-plot-0-indicators ↓↓↓
  // Price Channels                         | plot(0) | 2 parameters: high/low        | 1 add.param.: period
  // let mapping = table.mapAs({"high": 2, "low": 3});
  // chart.plot(0).priceChannels(mapping, 20);
  // Parabolic SAR                          | plot(0) | 2 parameters: high/low        | 3 add.param.: Acceleration Factor Start, Acceleration Factorincrement, Acceleration Factor Maximum
  // let mapping = table.mapAs({"high": 2, "low": 3});
  // chart.plot().psar(mapping, 0.08, 0.60, 0.10, "line").series();
  // Ichimoku Cloud                         | plot(0) | 3 parameters: high/low/close  | 3 add.param.: conversion period, base period, leading period
  // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
  // chart.plot(0).ikh(mapping, 9, 26, 52);
  // Keltner Channels                       | plot(0) | 3 parameters: high/low/close  | 3 add.param.: ma-period, multiplier
  // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
  // chart.plot(0).keltnerChannels(mapping, 20, 10, "ema", 2);
  // ↑↑↑ ohlc-plot-0-indicators ↑↑↑
  // ↓↓↓ simple-plot-1-indicators ↓↓↓
  // Psychological Line                     | plot(1) | 1 parameter: value            | 1 add.param.: period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).psy(mapping, 20);
  // Rank Correlation Index                 | plot(1) | 1 parameter: value            | 1 add.param.: period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).rci(mapping, 12);
  // Rate of change                         | plot(1) | 1 parameter: value            | 1 add.param.: period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).roc(mapping, 30);
  // Relative Strength Index                | plot(1) | 1 parameter: value            | 1 add.param.: period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).rsi(mapping, 14);
  // sma                                    | plot(1) | 1 parameters: value           | 1 add.param.: period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(0).sma(mapping, 10, "line");
  // Momentum                               | plot(1) | 1 parameter: value            | 1 add.param.: period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).momentum(mapping, 14);
  // Bollinger Bands %B                     | plot(1) | 1 parameter: value            | 2 add.param.: period, deviation
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).bbandsB(mapping, 20, 2);
  // Bollinger Bands Width                  | plot(1) | 1 parameter: value            | 2 add.param.: period, deviation
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).bbandsWidth(mapping, 50, 3);
  // TRIX                                   | plot(1) | 1 parameter: value            | 2 add.param.: Periodб Signal Period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).trix(mapping, 15, 9, "ema", "ema");
  // Envelope                               | plot(1) | 1 parameter: value            | 3 add.param.: period, deviation, ma type (Moving Average Type)
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).env(mapping, 20, 10, "ema", "line", "line");
  // Moving Average Convergence/Divergence  | plot(1) | 1 parameter: value            | 3 add.param.: fast period, slow period, signal period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).macd(mapping, 12, 26, 9);
  // Price Oscillator indicator             | plot(1) | 1 parameter: value            | 3 add.param.: Short Period, Long Period, Smoothing Period
  // let mapping = table.mapAs({'value': 4});
  // chart.plot(1).ppo(mapping, 12, 26, 9);
  // ↑↑↑ simple-plot-1-indicators ↑↑↑
  // ↓↓↓ ohlc-plot-1-indicators ↓↓↓
  // Heikin-Ashi                            | plot(1) | 4 parameters: open/high/low/close
  // let mapping = table.mapAs({"open": 1, "high": 2, "low": 3, "close": 4});
  // chart.plot(1).ha(mapping);
  // aroon                                  | plot(1) | 2 parameters: high/low        | 1 add.param.: period
  // let mapping = table.mapAs({"high": 2, "low": 3});
  // chart.plot(1).aroon(mapping, 25);
  // atr                                    | plot(1) | 3 parameters: high/low/close  | 1 add.param.: period
  // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
  // chart.plot(1).atr(mapping, 10).series();
  // Commodity Channel Index                | plot(1) | 3 parameters: high/low/close  | 1 add.param.: period
  // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
  // chart.plot(1).cci(mapping, 20);
  // Williams %R                            | plot(1) | 3 parameters: high/low/close  | 1 add.param.: period
  // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
  // chart.plot(1).williamsR(mapping, 4);
  // Awesome Oscillator                     | plot(1) | 2 parameters: high/low        | 3 add.param.: fast period, slow period, ma type (Moving Average Type)
  // let mapping = table.mapAs({"high": 2, "low": 3});
  // chart.plot(1).ao(mapping, 5, 34, "sma/ema");
  // Stochastic oscillator                  | plot(1) | 3 parameters: high/low/close  | 3 add.param.: K-Period, Kma Period, D-Period
  // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
  // chart.plot(1).stochastic(mapping, 10, "EMA", 10, "SMA", 20);
  // KDJ                                    | plot(1) | 3 parameters: high/low/close  | 5 add.param.: k-period, kma-period, d-period, k-multiplier, d-multiplier
  // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
  // chart.plot(1).kdj(mapping, 14, "EMA", 5, "EMA", 5, -2, 3);
  // ↑↑↑ ohlc-plot-1-indicators ↑↑↑
  // видалення plot
  // setTimeout( () => {
  //   chart.plot(1).dispose()
  //   }, 10000);
  // видалення serie
  // setTimeout( function(){
  //   let series = chart.plot(0).getSeriesCount();
  //   for (let i = 1; i < series; i++) {
  //     chart.plot(0).removeSeriesAt(1)
  //   }
  // }, 3000);
  // ↑↑↑ /indicators ↑↑↑
}
/**
 * [setGraphicType змінює тип графіка]
 * @param {[DOM-object]} elem [елемент DOM, на якому спрацював обробник]
 */


function setGraphicType(elem) {
  // визначення типу графіка, його перезапуск
  dataType = elem.dataset.graphicType;

  if (dataType == 'candlestick' || dataType == 'ohlc') {
    stringType = 'Ohlc?';

    if (timeStep == '1Ms' || timeStep == '5Ms') {
      timeStep = '15Ms';
      document.querySelector('.graphic-panel__time-btn.graphic-panel__btn_active').classList.remove('graphic-panel__btn_active');
      document.querySelector('.graphic-panel__time-btn[data-graphic-time="15Ms"]').classList.add('graphic-panel__btn_active');
      document.querySelector('.submenu-item[data-graphic-time].submenu-item_with-img_active').classList.remove('submenu-item_with-img_active');
      document.querySelector('.submenu-item[data-graphic-time="15Ms"]').classList.add('submenu-item_with-img_active');
    }

    document.querySelector('.graphic-panel__time-btn[data-graphic-time="1Ms"]').style.display = 'none';
    document.querySelector('.graphic-panel__time-btn[data-graphic-time="5Ms"]').style.display = 'none';
    document.querySelector('.submenu-item[data-graphic-time="1Ms"]').style.display = 'none';
    document.querySelector('.submenu-item[data-graphic-time="5Ms"]').style.display = 'none';
  } else if (dataType == 'areaspline') {
    stringType = 'Stock?';
    document.querySelector('.graphic-panel__time-btn[data-graphic-time="1Ms"]').style.display = 'block';
    document.querySelector('.graphic-panel__time-btn[data-graphic-time="5Ms"]').style.display = 'block';
    document.querySelector('.submenu-item[data-graphic-time="1Ms"]').style.display = 'block';
    document.querySelector('.submenu-item[data-graphic-time="5Ms"]').style.display = 'block';
  }

  getDataArr(); // підсвітка активної кнопки

  document.querySelector('.graphic-panel__type-btn.graphic-panel__btn_active').classList.remove('graphic-panel__btn_active');
  document.querySelector('.graphic-panel__type-btn[data-graphic-type="' + dataType + '"]').classList.add('graphic-panel__btn_active');
  document.querySelector('.submenu-item[data-graphic-type].submenu-item_with-img_active').classList.remove('submenu-item_with-img_active');
  document.querySelector('.submenu-item[data-graphic-type="' + dataType + '"]').classList.add('submenu-item_with-img_active');
}
/**
 * [setGraphicTime змінює крок графіка]
 * @param {[DOM-object]} elem [елемент DOM, на якому спрацював обробник]
 */


function setGraphicTime(elem) {
  // визначення інтервалу графіка, його перезапуск
  timeStep = elem.dataset.graphicTime;
  getDataArr(); // підсвітка активної кнопки

  document.querySelector('.graphic-panel__time-btn.graphic-panel__btn_active').classList.remove('graphic-panel__btn_active');
  document.querySelector('.graphic-panel__time-btn[data-graphic-time="' + timeStep + '"]').classList.add('graphic-panel__btn_active');
  document.querySelector('.submenu-item[data-graphic-time].submenu-item_with-img_active').classList.remove('submenu-item_with-img_active');
  document.querySelector('.submenu-item[data-graphic-time="' + timeStep + '"]').classList.add('submenu-item_with-img_active');
}
/**
 * [setGraphicCrosshair змінює тип курсору на графіку]
 * @param {[DOM-object]} elem [елемент DOM, на якому спрацював обробник]
 */


function setGraphicCrosshair(elem) {
  dataСrosshair = elem.dataset.graphicCrosshair; // підствітка потрібних іконок

  document.querySelector('.graphic-panel__crosshair-btn.graphic-panel__btn_active').classList.remove('graphic-panel__btn_active');
  document.querySelector('.graphic-panel__crosshair-btn[data-graphic-crosshair="' + dataСrosshair + '"]').classList.add('graphic-panel__btn_active');
  document.querySelector('.submenu-item_with-img_active[data-graphic-crosshair]').classList.remove('submenu-item_with-img_active');
  document.querySelector('.submenu-item_with-img[data-graphic-crosshair="' + dataСrosshair + '"]').classList.add('submenu-item_with-img_active'); // налаштування перехрестя

  if (dataСrosshair == 'float') {
    chart.crosshair(true);
    chart.crosshair().displayMode("float");
  } else if (dataСrosshair == 'disable') {
    chart.crosshair(false);
  } else {
    chart.crosshair(true);
    chart.crosshair().displayMode("sticky");
  }
}
/**
 * [setGraphicScroll вмикає/вимикає скролл]
 * @param {[DOM-object]} elem [елемент DOM, на якому спрацював обробник]
 */


function setGraphicScroll(elem) {
  dataScroller = elem.dataset.graphicScroll; // підсвітка потрібних кнопочок

  document.querySelector('.graphic-panel__scroller-btn.graphic-panel__btn_active').classList.remove('graphic-panel__btn_active');
  document.querySelector('.graphic-panel__scroller-btn[data-graphic-scroll="' + dataScroller + '"]').classList.add('graphic-panel__btn_active');
  document.querySelector('.submenu-item_with-img_active[data-graphic-scroll]').classList.remove('submenu-item_with-img_active');
  document.querySelector('.submenu-item_with-img[data-graphic-scroll="' + dataScroller + '"]').classList.add('submenu-item_with-img_active'); // включаємо/виключаємо скрол часу в графіку

  if (dataScroller == 'off') {
    chart.scroller().enabled(false);
  } else if (dataScroller == 'on') {
    chart.scroller().enabled(true);

    if (dataType == 'areaspline') {
      chart.scroller().line(lineMapping);
    } else if (dataType == 'candlestick') {
      chart.scroller().candlestick(OHLCMapping);
    } else if (dataType == 'ohlc') {
      chart.scroller().ohlc(OHLCMapping);
    }
  }
}
/**
 * [drawGraphicTools малює геометричні фігури на полотні графіка]
 * @param {[DOM-object]} elem [елемент DOM, на якому спрацював обробник]
 */


function drawGraphicTools(elem) {
  var drawingType = elem.dataset.annotationType;

  if (drawingType == 'removeAllAnnotations') {
    chart.annotations().removeAllAnnotations();
  } else if (drawingType == 'label') {
    // an auxiliary variable for working with annotations
    var plot = chart.plot(0);
    var controller = plot.annotations();
    controller.label({
      xAnchor: "center-top",
      valueAnchor: 17.24,
      text: "Buy"
    }); // start drawing the annotation

    controller.startDrawing(drawingType);
  } else {
    // an auxiliary variable for working with annotations
    var _plot = chart.plot(0);

    var _controller = _plot.annotations(); // start drawing the annotation


    _controller.startDrawing(drawingType);
  }
}
/**
 * [wagTheTail тягає хвостик - крайню праву точку (тимчасову): видаляє точку,
 * додає точку. Викликається зі сторони бекенду]
 * @param  {[Object]} point [тимчасова точка - об'єкт з часом/параметрами]
 */


function wagTheTail(point) {
  var tempYear = +point.time.slice(0, 4);
  var tempMonth = +point.time.slice(5, 7) - 1;
  var tempDay = +point.time.slice(8, 10);
  var tempHours = +point.time.slice(11, 13);
  var tempMinutes = +point.time.slice(14, 16);
  var time = Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes);
  var value = Math.round(point.value * 100000) / 100000; // видалити хвостову (рандомну) точку

  table.remove(resultArr[resultArr.length - 1][0], resultArr[resultArr.length - 1][0]);

  if (dataType == 'areaspline') {
    table.addData([[time, value]]);
  } else if (dataType == 'candlestick' || dataType == 'ohlc') {
    tailPoint[0] = time;
    tailPoint[4] = value;

    if (tailPoint[2] < value || !tailPoint[2]) {
      tailPoint[2] = value;
    }

    if (tailPoint[3] > value || !tailPoint[3]) {
      tailPoint[3] = value;
    }

    table.addData([tailPoint]);
  }
}
/**
 * [addPoint додає у графік нову точку. Викликається зі сторони бекенду]
 */


function addPoint() {
  var url = domain + '/api/' + stringType + 'timer=' + timeStep + '&symbol=' + stringSymbol;
  ajax(url, 'get', redrawChart);
}
/**
 * [redrawChart бере із сервера оновлений масив, витягує останню точку (нову)
 *  і без перезавантаження усього графіка додає її в кінець графіка]
 * @param  {[String]} data [масив для побудови графіка]
 */


function redrawChart(data) {
  var temp = JSON.parse(data);
  var newPoint = temp[temp.length - 1]; // видалити хвостову (рандомну) точку

  table.remove(resultArr[resultArr.length - 1][0], resultArr[resultArr.length - 1][0]);

  if (dataType == 'areaspline') {
    var tempYear = +newPoint.Date.slice(0, 4);
    var tempMonth = +newPoint.Date.slice(5, 7) - 1;
    var tempDay = +newPoint.Date.slice(8, 10);
    var tempHours = +newPoint.Date.slice(11, 13);
    var tempMinutes = +newPoint.Date.slice(14, 16);
    var time = Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes); // додати реальну точку

    table.addData([[time, newPoint.Value]]); // відновити хвостик

    table.addData([[time + 1000, newPoint.Value]]);
  } else if (dataType == 'candlestick' || dataType == 'ohlc') {
    var _tempYear2 = +newPoint.DateClose.slice(0, 4);

    var _tempMonth2 = +newPoint.DateClose.slice(5, 7) - 1;

    var _tempDay2 = +newPoint.DateClose.slice(8, 10);

    var _tempHours2 = +newPoint.DateClose.slice(11, 13);

    var _tempMinutes2 = +newPoint.DateClose.slice(14, 16);

    var _time = Date.UTC(_tempYear2, _tempMonth2, _tempDay2, _tempHours2, _tempMinutes2); // додати реальну точку


    table.addData([[_time, newPoint.Open, newPoint.Hight, newPoint.Low, newPoint.Close]]); // відновити хвостик

    table.addData([[_time, newPoint.Close, newPoint.Close, newPoint.Close, newPoint.Close]]);
  }
} // ↑↑↑ FUNCTIONS DECLARATION ↑↑↑
////////////////////////////////////////////////////////////////////////////////