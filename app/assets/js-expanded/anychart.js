// http://195.201.39.116:81/api/Stock?timer=1Ms&symbol=EURUSD
// https://core.crmhub.info/api/Ohlc?timer=30Ms&symbol=EURUSD
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ VARIABLES DECLARATION ↓↓↓
  // let domain        = 'https://core.crmhub.info';
  let domain        = 'https://stock.crmhub.info';

  let dataType      = 'candlestick', // тип графіку 'areaspline'/'candlestick'/'ohlc'
      timeStep      = '15Ms',        // інтервал між точками на графіку
      stringType    = 'Ohlc?',     // тип даних: 'Stock?' для areaspline та 'Ohlc?' для candlestick/ohlc
      stringSymbol  = 'EURUSD',     // назва торгової пари, потрібна для формування рядка запиту
      resultArr     = [],           // масив з перероблених вхідних даних, придатний для обробки бібліотекою
      tailPoint     = [];           // хвостова (рандомна) точка графіка

  let table, lineMapping, OHLCMapping, chart, line;

  let dataСrosshair = 'sticky';
  let dataScroller  = 'off';
  let dataBreak     = 'off';
// ↑↑↑ VARIABLES DECLARATION ↑↑↑
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ START WORKING ↓↓↓
getDataArr();
// ↑↑↑ /START WORKING ↑↑↑
////////////////////////////////////////////////////////////////////////////////
// ↓↓↓ APPROITNMENT OF EVENT HANDLERS ↓↓↓
  // type-switch-buttons behavior
  let arrOfTypeBtns = document.querySelectorAll('[data-graphic-type]');
  addOnEventToObject('click', arrOfTypeBtns, setGraphicType);

  // time-switch-buttons behavior
  let arrOfTimeBtns = document.querySelectorAll('[data-graphic-time]');
  addOnEventToObject('click', arrOfTimeBtns, setGraphicTime);

  // crosshair-switch-buttons behavior
  let arrOfCrosshairBtns = document.querySelectorAll('[data-graphic-crosshair]');
  addOnEventToObject('click', arrOfCrosshairBtns, setGraphicCrosshair);

  // scroller-switch-buttons behavior
  let arrOfScrollBtns = document.querySelectorAll('[data-graphic-scroll]');
  addOnEventToObject('click', arrOfScrollBtns, setGraphicScroll);

  // drawing tools
  let arrOfDrawingBtns = document.querySelectorAll('[data-annotation-type]');
  addOnEventToObject('click', arrOfDrawingBtns, drawGraphicTools);
// ↑↑↑ /APPROITNMENT OF EVENT HANDLERS ↑↑↑
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

    let url = domain     + '/'        +
              stringType + 'timer='   +
              timeStep   + '&symbol=' +
              stringSymbol;

    ajax(url, 'get', dataArrHandler);
  }

  /**
   * [dataArrHandler здійснює обробку отриманого із серверу масиву даних,
   * перетворюючи їх у формат, придатний для робити з ним бібліотеки anychart]
   * @param  {[String]} data [масив даних для побудови графіка у форматі рядка]
   */
  function dataArrHandler(data) {
    let dataArr = JSON.parse(data);
    resultArr  = [];

    if (dataType == 'areaspline') {

      // [{Date: "2019-07-17T18:58:00Z", Value: 1.23456, IsBrake: false },{...},{...}]
      // -> -> -> -> ->
      // [[Date.UTC(2019, 07, 17, 18, 58), 1.23456],[...],[...]]
      for (let i = 0; i < dataArr.length; i++) {
        let tempTimeString = dataArr[i].date;

        let tempYear    = +tempTimeString.slice(0,4);
        let tempMonth   = +tempTimeString.slice(5,7) - 1;
        let tempDay     = +tempTimeString.slice(8,10);
        let tempHours   = +tempTimeString.slice(11,13);
        let tempMinutes = +tempTimeString.slice(14,16);

        let tempArr = [];
        tempArr.push( Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes) );
        tempArr.push(  dataArr[i].value );
        resultArr.push( tempArr );
      }

      // в перший раз хвостова (рандомна) точка береться з останньої точки графіка
      tailPoint = resultArr[resultArr.length-1];
      resultArr.push( tailPoint );

    } else if ( dataType == 'candlestick' || dataType == 'ohlc' ) {

      // [{'DateOpen':'date1', 'DateClose':'date2', 'Open':'number1', 'Hight':'number2', 'Low':'number3', 'Close':'number4'}, {...},{...}]
      // -> -> -> -> ->
      // [[date2, number1, number2, number3, number4],[...],[...]]
      for (let i = 0; i < dataArr.length; i++) {

        let tempTimeString = dataArr[i].dateClose;
        let tempYear       = +tempTimeString.slice(0,4);
        let tempMonth      = +tempTimeString.slice(5,7) - 1;
        let tempDay        = +tempTimeString.slice(8,10);
        let tempHours      = +tempTimeString.slice(11,13);
        let tempMinutes    = +tempTimeString.slice(14,16);

        let tempArr = [];

        tempArr.push( Date.UTC(tempYear, tempMonth, tempDay, tempHours, tempMinutes) );
        tempArr.push(dataArr[i].open);
        tempArr.push(dataArr[i].hight);
        tempArr.push(dataArr[i].low);
        tempArr.push(dataArr[i].close);
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

    let loader = document.querySelector('#content .tab-body_active .loader');
    loader.style.display = 'none';
    drawChart();
    // setGraphicCrosshair();
    // setGraphicScroll();
  }

  /**
   * [drawChart малює графік]
   */
  function drawChart() {
    // визначаємо контейнер, який містить графік
    let container = document.querySelector('#content .tab-body_active .graphic');

    // витираємо попередній графік, якщо він є
    container.innerHTML = '';

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

    // створити лінію на графіку певного типу (spline/candlestick/ohlc) та стилізувати її
    if (dataType == 'areaspline') {
      line = chart.plot(0).spline(lineMapping);
      line.stroke("green", 1); // line.stroke("green", 1, "10 5", "round");
    }
    else if (dataType == 'candlestick' ) {
      line = chart.plot(0).candlestick(OHLCMapping);
      line.fallingFill("red").fallingStroke("red");
      line.risingFill("green").risingStroke("green");
    }
    else if (dataType == 'ohlc') {
      line = chart.plot(0).ohlc(OHLCMapping);
      line.fallingStroke("red");
      line.risingStroke("green");
    }

    // // Заголовок графіка
    // chart.title(stringSymbol);

    // назва конкретної лінії на графіку
    line.name(stringSymbol);

    // додати засічки на осі абсцис
    let xAxis = chart.plot().xAxis();
    xAxis.labels({anchor: 'left-top'});
    xAxis.minorLabels({anchor: 'left-top'});
    xAxis.ticks(true); // або .ticks({stroke: '#F44336'});
    xAxis.minorTicks(true);

    // форматування дати по осі абсцис
    xAxis.labels().format(function () {
      return anychart.format.dateTime(this.tickValue, "dd.MM.yy \u000A HH:mm");
    });
    xAxis.minorLabels().format(function () {
      return anychart.format.dateTime(this.tickValue, "dd.MM.yy \u000A HH:mm");
    });

    // розташування засічок inside/outside
    xAxis.ticks().position("inside");
    xAxis.minorTicks().position("inside")

    // задати висоту осі абсцис
    xAxis.height(36);

    // перенести вісь ординат зліва направо
    chart.plot().yAxis().orientation("right");
    chart.padding(0, 80, 10, 10);

    // додати розлінування полотна графіка
    chart.plot().xGrid().enabled(true);
    chart.plot().yGrid().enabled(true); // стиль лінії .stroke({dash: "13 5"});
    chart.plot().xMinorGrid().enabled(true);
    chart.plot().yMinorGrid().enabled(true);

    // стилізація перехрестя
    chart.plot().crosshair().xStroke("red", 1); // .xStroke("#00bfa5", 1.5, "10 5", "round");
    chart.plot().crosshair().yStroke("red", 1);

    // поточне значення (т.зв. плот-лінія)
    let indicator = chart.plot().priceIndicator();
    indicator.value('last-visible');
    indicator.stroke("green", 1, "2 2");
    indicator.label().background().fill("green");
    indicator.label().fontColor("white");

    // виключення скролу часу в графіку
    chart.scroller().enabled(false);

    // форматування легенди графіка
    chart.plot().legend(true);
    chart.plot().legend().titleFormat("{%value}{dateTimeFormat: dd.MM.yyyy HH:mm}");

    // форматування часових лейблів перехрестя
    chart.crosshair().xLabel().format(function () {
      return anychart.format.dateTime(this.tickValue, "dd.MM.yy hh:mm");
    });
    chart.crosshair().yLabel().format(function () {
      return this.value;
    });

    // форматування часових лейблів полоси прокрутки
    chart.scroller().xAxis().labels().format(function () {
      return anychart.format.dateTime(this.tickValue, "dd.MM.yy hh:mm");
    });
    chart.scroller().xAxis().minorLabels().format(function () {
      return anychart.format.dateTime(this.tickValue, "dd.MM.yy hh:mm");
    });

    // вписати графік в контейнер
    chart.container(container);

    // ініціалізувати графік
    chart.draw();

    // стерти водяний знак
    document.getElementsByClassName('anychart-credits')[0].remove();

    // ↓↓↓ indicators ↓↓↓
    // sma
    // chart.plot(0).sma(lineMapping, 10, "line");

    // -: adl, cmf, cho, dmi, 

    // ama                        | plot(0) | 1 parameter: value
    // let mapping = table.mapAs({'value': 4});
    // chart.plot().ama(mapping).series();

    // aroon                      | plot(1) | 2 parameters: high/low        | 1 add.param.: period
    // let mapping = table.mapAs({"high": 2, "low": 3});
    // chart.plot(1).aroon(mapping, 25);

    // atr                        | plot(1) | 3 parameters: high/low/close  | 1 add.param.: period
    // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
    // chart.plot(1).atr(mapping, 10).series();

    // Awesome Oscillator         | plot(1) | 2 parameters: high/low        | 3 add.param.: fast period, slow period, ma type (Moving Average Type)
    // let mapping = table.mapAs({"high": 2, "low": 3});
    // chart.plot(1).ao(mapping, 5, 34, "sma/ema");

    // Bollinger Bands            | plot(0) | 1 parameter: value            | 2 add.param.: period, deviation
    // let mapping = table.mapAs({'value': 4});
    // chart.plot().bbands(mapping, 20, 2);

    // Bollinger Bands %B         | plot(1) | 1 parameter: value            | 2 add.param.: period, deviation
    // let mapping = table.mapAs({'value': 4});
    // chart.plot(1).bbandsB(mapping, 20, 2);

    // Bollinger Bands Width      | plot(1) | 1 parameter: value            | 2 add.param.: period, deviation
    // let mapping = table.mapAs({'value': 4});
    // chart.plot(1).bbandsWidth(mapping, 50, 3);

    // Commodity Channel Index    | plot(1) | 3 parameters: high/low/close  | 1 add.param.: period
    // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
    // chart.plot(1).cci(mapping, 20);

    // Envelope                   | plot(1) | 1 parameter: value            | 3 add.param.: period, deviation, ma type (Moving Average Type)
    // let mapping = table.mapAs({'value': 4});
    // chart.plot(1).env(mapping, 20, 10, "ema", "line", "line");

    // Exponential Moving Average | plot(0) | 1 parameter: value            | 1 add.param.: period
    // let mapping = table.mapAs({'value': 4});
    // chart.plot(0).ema(mapping, 10);

    // Heikin-Ashi                | plot(1) | 4 parameters: open/high/low/close
    // let mapping = table.mapAs({"open": 1, "high": 2, "low": 3, "close": 4});
    // chart.plot(1).ha(mapping);

    // Ichimoku Cloud             | plot(0) | 3 parameters: high/low/close  | 3 add.param.: conversion period, base period, leading period
    // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
    // chart.plot(0).ikh(mapping, 9, 26, 52);

    // KDJ                        | plot(1) | 3 parameters: high/low/close  | 5 add.param.: k-period, kma-period, d-period, k-multiplier, d-multiplier
    // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
    // chart.plot(1).kdj(mapping, 14, "EMA", 5, "EMA", 5, -2, 3);

    // Keltner Channels           | plot(0) | 3 parameters: high/low/close  | 3 add.param.: ma-period, multiplier
    // let mapping = table.mapAs({"high": 2, "low": 3, "close": 4});
    // chart.plot(0).keltnerChannels(mapping, 20, 10, "ema", 2);
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
        document.querySelector('.graphic-panel__time-btn.graphic-panel__btn_active')
               .classList.remove('graphic-panel__btn_active');
        document.querySelector('.graphic-panel__time-btn[data-graphic-time="15Ms"]')
                .classList.add('graphic-panel__btn_active');

        document.querySelector('.submenu-item[data-graphic-time].submenu-item_with-img_active')
                .classList.remove('submenu-item_with-img_active');
        document.querySelector('.submenu-item[data-graphic-time="15Ms"]')
                .classList.add('submenu-item_with-img_active');
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
    getDataArr();

    // підсвітка активної кнопки
    document.querySelector('.graphic-panel__type-btn.graphic-panel__btn_active')
            .classList.remove('graphic-panel__btn_active');
    document.querySelector('.graphic-panel__type-btn[data-graphic-type="'
                            + dataType
                            + '"]')
            .classList.add('graphic-panel__btn_active');

    document.querySelector('.submenu-item[data-graphic-type].submenu-item_with-img_active')
            .classList.remove('submenu-item_with-img_active');
    document.querySelector('.submenu-item[data-graphic-type="'
                            + dataType
                            + '"]')
            .classList.add('submenu-item_with-img_active');
  }

  /**
   * [setGraphicTime змінює крок графіка]
   * @param {[DOM-object]} elem [елемент DOM, на якому спрацював обробник]
   */
  function setGraphicTime(elem) {
    // визначення інтервалу графіка, його перезапуск
    timeStep = elem.dataset.graphicTime;
    getDataArr();

    // підсвітка активної кнопки
    document.querySelector('.graphic-panel__time-btn.graphic-panel__btn_active')
            .classList.remove('graphic-panel__btn_active');
    document.querySelector('.graphic-panel__time-btn[data-graphic-time="'
                            + timeStep
                            + '"]')
            .classList.add('graphic-panel__btn_active');

    document.querySelector('.submenu-item[data-graphic-time].submenu-item_with-img_active')
            .classList.remove('submenu-item_with-img_active');
    document.querySelector('.submenu-item[data-graphic-time="'
                            + timeStep
                            + '"]')
            .classList.add('submenu-item_with-img_active');
  }

  /**
   * [setGraphicCrosshair змінює тип курсору на графіку]
   * @param {[DOM-object]} elem [елемент DOM, на якому спрацював обробник]
   */
  function setGraphicCrosshair(elem) {
    dataСrosshair = elem.dataset.graphicCrosshair;

    // підствітка потрібних іконок
    document.querySelector('.graphic-panel__crosshair-btn.graphic-panel__btn_active')
            .classList.remove('graphic-panel__btn_active');
    document.querySelector('.graphic-panel__crosshair-btn[data-graphic-crosshair="'
                            + dataСrosshair
                            + '"]')
            .classList.add('graphic-panel__btn_active');


    document.querySelector('.submenu-item_with-img_active[data-graphic-crosshair]')
            .classList.remove('submenu-item_with-img_active');
    document.querySelector('.submenu-item_with-img[data-graphic-crosshair="'
                            + dataСrosshair
                            + '"]')
            .classList.add('submenu-item_with-img_active');

    // налаштування перехрестя
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

  /**
   * [setGraphicScroll вмикає/вимикає скролл]
   * @param {[DOM-object]} elem [елемент DOM, на якому спрацював обробник]
   */
  function setGraphicScroll(elem) {
    dataScroller = elem.dataset.graphicScroll;

    // підсвітка потрібних кнопочок
    document.querySelector('.graphic-panel__scroller-btn.graphic-panel__btn_active')
            .classList.remove('graphic-panel__btn_active');
    document.querySelector('.graphic-panel__scroller-btn[data-graphic-scroll="'
                           + dataScroller
                           + '"]')
            .classList.add('graphic-panel__btn_active');

    document.querySelector('.submenu-item_with-img_active[data-graphic-scroll]')
            .classList.remove('submenu-item_with-img_active');
    document.querySelector('.submenu-item_with-img[data-graphic-scroll="'
                           + dataScroller
                           + '"]')
            .classList.add('submenu-item_with-img_active');

    // включаємо/виключаємо скрол часу в графіку
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

  /**
   * [drawGraphicTools малює геометричні фігури на полотні графіка]
   * @param {[DOM-object]} elem [елемент DOM, на якому спрацював обробник]
   */
  function drawGraphicTools(elem) {
    let drawingType = elem.dataset.annotationType;

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
      controller.startDrawing(drawingType);

    } else {

      // an auxiliary variable for working with annotations
      let plot = chart.plot(0);
      let controller = plot.annotations();

      // start drawing the annotation
      controller.startDrawing(drawingType);

    }
  }

  /**
   * [wagTheTail тягає хвостик - крайню праву точку (тимчасову): видаляє точку,
   * додає точку. Викликається зі сторони бекенду]
   * @param  {[Object]} point [тимчасова точка - об'єкт з часом/параметрами]
   */
  function wagTheTail(point) {

    let tempYear    = +point.time.slice(0,4);
    let tempMonth   = +point.time.slice(5,7) - 1;
    let tempDay     = +point.time.slice(8,10);
    let tempHours   = +point.time.slice(11,13);
    let tempMinutes = +point.time.slice(14,16);

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

    }
  }

  /**
   * [addPoint додає у графік нову точку. Викликається зі сторони бекенду]
   */
  function addPoint() {
    let url = domain     + '/api/'    +
              stringType + 'timer='   +
              timeStep   + '&symbol=' +
              stringSymbol;

    ajax(url, 'get', redrawChart);
  }

  /**
   * [redrawChart бере із сервера оновлений масив, витягує останню точку (нову)
   *  і без перезавантаження усього графіка додає її в кінець графіка]
   * @param  {[String]} data [масив для побудови графіка]
   */
  function redrawChart(data) {

    let temp = JSON.parse(data);
    let newPoint = temp[temp.length-1];

    // видалити хвостову (рандомну) точку
    table.remove( resultArr[resultArr.length-1][0], resultArr[resultArr.length-1][0] );

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
// ↑↑↑ FUNCTIONS DECLARATION ↑↑↑
////////////////////////////////////////////////////////////////////////////////
