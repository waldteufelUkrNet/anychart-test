"use strict";

var pointStart,
    // перша точка графіку
startTime,
    // час першої точки графіку
lastPoint,
    //
tempPoint,
    //
сontrolPoint,
    // остання точка масиву, потрібна для порівняння: якщо вона не рівна останній точці масиву, значить масив оновився і графік потрібно перемалювати
сontrolPoint2,
    // -- // --  -- // --
YPlotLinesValue,
    // величина, від якої малюється положення червоної лінії
interval,
    // setInterval
resultArr = [],
    // масив з перероблених вхідних даних, придатний для обробки бібліотекою
stringType = '?',
    // тип даних: ? для areaspline та Ohlc? для candlestick/ohlc
stringSymbol = 'EURUSD',
    // назва торгової пари, потрібна для формування рядка запиту
dataType = 'areaspline',
    // тип графіку areaspline/candlestick/ohlc
timeStep = 5,
    // інтервал між точками на графіку
dataArr,
    // адреса для отримання масиву даних
dataOne,
    // адреса для отримання поточного значення
labelValue1 = 0,
    labelValue2 = 0,
    YPlotLinesValue = 0,
    // змінні для визначення тенденції в котировках (потрібні для зафарбовування рамки поточного значення)
labelTextColor = 'black',
    // колір поточного значення
chart,
    // об'єкт Highcharts робимо доступним глобально для усіх функцій
simpleLineColor = '#308f32',
    //'orange';
plotLineColor = '#308f32',
    topLabelTextColor = '#308f32',
    bottomLabelTextColor = 'red'; //визначаємо ширину вікна, у залежності від неї графік має різнуй відступ справа

var graphicPaddingRight = 0; // let labelBorderTop      = 292;
// if (document.documentElement.clientWidth > 619 ) {
//   labelBorderTop      = 267;
// }

if (document.documentElement.clientWidth > 768) {
  graphicPaddingRight = 80; // labelBorderTop      = 288;
}

getDataArr(); // ↓↓↓ type/time-switch-buttons behavior ↓↓↓

var arrOfTypeBtns = $('.graphic-type-btn');
var arrOfTimerBtns = $('.graphic-time-btn');
$(arrOfTypeBtns).click(function () {
  // type-buttons highlighting
  for (var _i = 0; _i < arrOfTypeBtns.length; _i++) {
    $(arrOfTypeBtns[_i]).removeClass('graphic-type-btn_active');
    $(this).addClass('graphic-type-btn_active'); // визначення типу графіку

    dataType = $(this).attr('data-type');
  } // time-buttons highlighting + визначення stringType: ? / Ohlc?


  if (dataType == 'candlestick' || dataType == 'ohlc') {
    for (var _i2 = 0; _i2 < arrOfTimerBtns.length; _i2++) {
      // якщо на candlestick/ohlc нема відповідного часового інтервалу, переключати на 30хв
      if ($(arrOfTimerBtns[_i2]).attr('data-time') != '30' && $(arrOfTimerBtns[_i2]).attr('data-time') != '60') {
        if ($(arrOfTimerBtns[_i2]).hasClass('graphic-time-btn_active')) {
          $(arrOfTimerBtns[3]).addClass('graphic-time-btn_active');
          timeStep = 30;
        }

        $(arrOfTimerBtns[_i2]).css({
          'display': 'none'
        }).removeClass('graphic-time-btn_active');
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
    $(arrOfTimerBtns[i]).removeClass('graphic-time-btn_active');
    $(this).addClass('graphic-time-btn_active');
  }

  timeStep = +$(this).attr('data-time');
  getDataArr();
}); // ↑↑↑ type/time-switch-buttons behavior ↑↑↑
// ↓↓↓ functions declarations ↓↓↓

function getDataArr() {
  // формує рядок запиту, визначає тип графіку і формує масив, придатний для обробки бібліотекою.
  // Викликає функцію перемальовування графіку.
  dataArr = 'https://central.investingcase.com/api/Stock' + stringType + 'timer=' + timeStep + '&symbol=' + stringSymbol;
  $.ajax({
    url: dataArr,
    success: function success(data) {
      resultArr = [];
      pointStart = 0;
      startTime = 0;

      if (dataType == 'areaspline') {
        YPlotLinesValue = data[data.length - 1].Value; // [{...},{...},{...}] -> [[...],[...],[...]]

        for (var i = 0; i < data.length; i++) {
          var tempArr = [];
          var tempTime = new Date(data[i].Date);
          tempArr.push(tempTime);
          tempArr.push(data[i].Value);
          resultArr.push(tempArr);
        }

        lastPoint = resultArr[resultArr.length - 1]; // в перший раз тимчасова точка (145 рандомна) = 144

        resultArr.push(resultArr[resultArr.length - 1]);
      } else if (dataType == 'candlestick' || dataType == 'ohlc') {
        YPlotLinesValue = data[data.length - 1].Close; // [{'DateOpen':'date1', 'DateClose':'date2', 'Open':'number1', 'Hight':'number2', 'Low':'number3', 'Close':'number4'}, {...},{...}]
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
      } // якщо точок забагато, контейнер їх не вміщує, і свічки замість 30/60 хв. стають по 1 - 6 годині,
      // простий графік теж збивається


      var containerWidth = $('#container').width();

      if (1382 <= containerWidth && containerWidth < 1512) {
        resultArr = resultArr.slice(14);
      } else if (1032 <= containerWidth && containerWidth < 1382) {
        resultArr = resultArr.slice(49);
      } else if (872 <= containerWidth && containerWidth < 1032) {
        resultArr = resultArr.slice(65);
      } else if (742 <= containerWidth && containerWidth < 872) {
        resultArr = resultArr.slice(77);
      } else if (621 <= containerWidth && containerWidth < 742) {
        resultArr = resultArr.slice(90);
      } else if (468 <= containerWidth && containerWidth < 621) {
        resultArr = resultArr.slice(106);
      } else if (340 <= containerWidth && containerWidth < 468) {
        resultArr = resultArr.slice(118);
      } else if (containerWidth < 340) {
        resultArr = resultArr.slice(124);
      }

      pointStart = resultArr[0];
      startTime = pointStart[0].getTime();

      if (!сontrolPoint) {
        // якщо сontrolPoint не призначена (перший вхід у функцію),
        // призначаємо контрольні точки сontrolPoint2 = сontrolPoint = lastPoint[0].getTime(),
        // та запускаємо відмальовування графіку drawChart()
        сontrolPoint2 = сontrolPoint = lastPoint[0].getTime();
        drawChart();
      } else {
        // якщо сontrolPoint уже призначена (вхід у функцію в циклі поки time > step з функції redrawSerie(x,y))
        // порівнюємо сontrolPoint2 та сontrolPoint
        сontrolPoint2 = lastPoint[0].getTime();

        if (сontrolPoint != сontrolPoint2) {
          // якщо контрольні точки різні, значить масив оновився, обнулюємо точки, перемальовуємо графік
          сontrolPoint = сontrolPoint2 = undefined;
          tempPoint = null;
          drawChart();
        } else {
          // якщо time > step (уже потрібно малювати нову точку), але її поки ще в масиві нема
          // зупиняємо відмальовування графіку та чекаємо на нову точку, після чого запускаємо відмальовування графіку
          clearInterval(interval);
          redrawChart();
          interval = setInterval(function () {
            $.ajax({
              url: dataArr,
              success: function success(data) {
                сontrolPoint2 = new Date(data[data.length - 1].Date);
                сontrolPoint2 = сontrolPoint2.getTime();

                if (сontrolPoint != сontrolPoint2) {
                  // якщо контрольні точки різні, значить масив оновився, обнулюємо точки, перемальовуємо графік
                  сontrolPoint = сontrolPoint2 = undefined;
                  drawChart();
                }
              }
            });
          }, 1000);
        }
      }
    }
  });
}

Highcharts.theme = {
  colors: ['#308f32', 'white']
};
Highcharts.setOptions(Highcharts.theme);

function drawChart() {
  // створює графік
  chart = Highcharts.stockChart({
    chart: {
      renderTo: 'graphic',
      backgroundColor: 'transparent',
      spacingRight: graphicPaddingRight,
      events: {
        load: function load() {
          redrawPlotline(this, YPlotLinesValue);
          clearInterval(interval); // зупиняє попередні інтервали, бо інакше при натисненні на кнопки часу і типу графік починає сходити з розуму

          interval = setInterval(function () {
            dataOne = 'https://central.investingcase.com/api/Stock?timer=realOne&symbol=' + stringSymbol;
            $.getJSON(dataOne, function (data) {
              // data = [{Sumbol,Value,'date'}]
              var x = new Date(data[0].Date),
                  y = data[0].Value; // зробити окрему функцію без ajax попросили бекендщики

              redrawSerie(x, y);
            });
          }, 3000);
          tugOfWarAnimation(); // remove "Highcharts.com"-marker

          $('.highcharts-credits').remove();
        }
      }
    },
    data: {
      dataRefreshRate: 1
    },
    navigator: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    },
    rangeSelector: {
      enabled: false
    },
    series: [{
      type: dataType,
      threshold: null,
      name: stringSymbol,
      data: resultArr,
      animation: false,
      color: simpleLineColor,
      showInNavigator: false,
      pointStart: startTime,
      pointInterval: timeStep * 60 * 1000,
      fillColor: {
        linearGradient: {
          x1: 1,
          y1: -3,
          x2: 1,
          y2: 1
        },
        stops: [[0, Highcharts.getOptions().colors[0]], [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')]]
      }
    }],
    xAxis: {
      type: 'datetime',
      crosshair: true,
      scrollbar: {
        enabled: false
      },
      lineColor: 'rgba(111, 111, 115, 0.2)',
      gridLineColor: 'rgba(111, 111, 115, 0.3)',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#555'
        }
      },
      dateTimeLabelFormats: {
        hour: '%H:%M'
      },
      tickColor: 'rgba(111, 111, 115, 0.2)',
      tickmarkPlacement: 'on',
      minorGridLineColor: 'rgba(111, 111, 115, 0.1)',
      minorTicks: true,
      minorTickLength: 0
    },
    yAxis: {
      crosshair: true,
      scrollbar: {
        enabled: false
      },
      opposite: true,
      lineColor: 'rgba(111, 111, 115, 0.2)',
      gridLineColor: 'rgba(111, 111, 115, 0.3)',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#555'
        },
        align: 'left',
        x: 8,
        y: 4
      },
      tickColor: 'rgba(111, 111, 115, 0.2)',
      tickWidth: 0,
      minorGridLineColor: 'rgba(111, 111, 115, 0.1)',
      minorTicks: true,
      minorTickLength: 0
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
        color: '#F0F0F0'
      },
      // xDateFormat          : '%Y-%m-%d %H:%M UTC',
      formatter: function formatter() {
        var s = [Highcharts.dateFormat('%d.%m.%Y %H:%M UTC', this.x), '<br>'];
        $.each(this.points, function (i, p) {
          if (p.series.type == 'candlestick' || p.series.type == 'ohlc') {
            s.push('open: ', p.point.open, '<br>', 'high: ', p.point.high, '<br>', 'low: ', p.point.low, '<br>', 'close: ', p.point.close, '<br>');
          } else {
            s.push(stringSymbol, ': ', p.y);
          }
        });
        return s.join('');
      }
    },
    plotOptions: {
      candlestick: {
        lineWidth: 1,
        pointWidth: 5
      }
    }
  });
}

function redrawSerie(x, y) {
  // приймає поточні значення котировки, визначає тип графіка, формує тимчасову точку та запускає
  // функцію redrawChart(), яка перемальовує графік. Якщо час тимчасової точки більше за час
  // останньої точки більше ніж на крок графіка, додає точку до масиву значень та видаляє першу точку
  //x = new Date(x); // так треба бекендщикам, бо у них дата - не рядок з json
  YPlotLinesValue = y;
  lastPoint = resultArr[resultArr.length - 2];
  chart.yAxis[0].removePlotLine('plot-line-1');
  redrawPlotline(chart, YPlotLinesValue);

  if (dataType == 'areaspline') {
    tempPoint = [x, y];
    resultArr[resultArr.length - 1] = tempPoint;
  } else if (dataType == 'candlestick' || dataType == 'ohlc') {
    if (tempPoint == null || !tempPoint[1]) {
      tempPoint = [x, y, y, y, y]; // tempPoint = [x, open, high, low, close];
    }

    tempPoint[0] = x;

    if (tempPoint[2] < y) {
      tempPoint[2] = y;
    }

    if (tempPoint[3] > y) {
      tempPoint[3] = y;
    }

    tempPoint[4] = y;
    resultArr[resultArr.length - 1] = tempPoint;
  }

  var deltaTime = x.getTime() - lastPoint[0].getTime();

  if (deltaTime >= timeStep * 60 * 1000) {
    // перезавантажуємо графік
    getDataArr();
  } else {
    // тягаємо хвостик
    redrawChart();
  }
}

function redrawChart() {
  // видаляє графік, перемальовує графік
  chart.series[0].remove();
  chart.addSeries({
    type: dataType,
    threshold: null,
    name: stringSymbol,
    data: resultArr,
    animation: false,
    color: simpleLineColor,
    showInNavigator: false,
    pointStart: startTime,
    pointInterval: timeStep * 60 * 1000,
    fillColor: {
      linearGradient: {
        x1: 1,
        y1: -3,
        x2: 1,
        y2: 1
      },
      stops: [[0, Highcharts.getOptions().colors[0]], [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]]
    }
  }, false);
  chart.redraw();
  chart.yAxis[0].removePlotLine('plot-line-1');
  redrawPlotline(chart, YPlotLinesValue);
  tugOfWarAnimation();
}

function redrawPlotline(nameOfChart, currentYCoordValue) {
  // console.log('start redrawPlotline');
  // перемальовує плот-лінію та поточне значення
  nameOfChart.yAxis[0].addPlotLine({
    color: plotLineColor,
    id: 'plot-line-1',
    dashStyle: 'dash',
    width: 1,
    zIndex: 9988,
    label: {
      //text        : currentYCoordValue.toFixed(5),
      textAlign: 'left',
      align: 'right',
      x: 5,
      y: 3,
      style: {
        color: 'transparent',
        fontSize: '11px'
      }
    },
    value: currentYCoordValue
  }); // highcharts-plot-line-label - перестало працювати усюди, крім edge

  var plotloneTop = getCoords($('.highcharts-plot-lines-9988')[0]).top,
      plotloneRight = getCoords($('.highcharts-plot-lines-9988')[0]).right;
  var labelBorderHeight = getCoords($('#labelBorder')[0]).height,
      labelBorderWidth = getCoords($('#labelBorder')[0]).width;
  var graphicWrapperTop = getCoords($('.graphic-wrapper')[0]).top,
      graphicWrapperLeft = getCoords($('.graphic-wrapper')[0]).left;
  var labelBorderTop, labelBorderLeft;

  if (document.documentElement.clientWidth > 768) {
    labelBorderTop = plotloneTop - graphicWrapperTop - labelBorderHeight / 2, labelBorderLeft = plotloneRight - graphicWrapperLeft + 7;
  } else {
    labelBorderTop = plotloneTop - graphicWrapperTop + 10, labelBorderLeft = plotloneRight - graphicWrapperLeft - labelBorderWidth + 7;
  }

  if (labelValue1 > labelValue2) {
    labelTextColor = bottomLabelTextColor;
  } else if (labelValue1 < labelValue2) {
    labelTextColor = topLabelTextColor;
  } else {
    labelTextColor = '#555';
  }

  labelValue1 = labelValue2;
  labelValue2 = currentYCoordValue;
  $('#labelBorder').css({
    'top': labelBorderTop,
    'left': labelBorderLeft,
    'color': labelTextColor
  }).text(currentYCoordValue.toFixed(5));
}

;

function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    bottom: box.bottom + pageYOffset,
    left: box.left + pageXOffset,
    right: box.right + pageXOffset,
    height: box.bottom - box.top,
    width: box.right - box.left
  };
} // ↑↑↑ functions declarations ↑↑↑
// ↓↓↓ BEM-blocks: tug-of-war (start) ↓↓↓


function tugOfWarAnimation() {
  // функція циклом визначає найбільшу і найменшу точки графіку, приймає їх за 100% та 0% відповідно,
  // потім бере першу і останню точки, переводить їх у проценти, знаходить їх різницю і ділить на два,
  // отримане значення або додає, або віднімає від 50% у залежності від тенденції.
  var firstTOWPoint, lastTOWPoint, minTOWPoint, maxTOWPoint, firstTOWPointInPercent, lastTOWPointInPercent, topPersent, bottomPersent; // indicators = $('.tug-of-war__indicator'),
  // indicatorsAmount = $(indicators).length;
  // визначаємо крайні ліву/праву точки та мін/макс точки

  if (dataType == 'areaspline') {
    minTOWPoint = maxTOWPoint = firstTOWPoint = resultArr[0][1];
    lastTOWPoint = resultArr[resultArr.length - 2][1];

    for (var i = 0; i < resultArr.length - 1; i++) {
      if (resultArr[i][1] > maxTOWPoint) {
        maxTOWPoint = resultArr[i][1];
      }

      if (resultArr[i][1] < minTOWPoint) {
        minTOWPoint = resultArr[i][1];
      }
    }
  } else if (dataType == 'candlestick' || dataType == 'ohlc') {
    minTOWPoint = maxTOWPoint = firstTOWPoint = resultArr[0][1];
    lastTOWPoint = resultArr[resultArr.length - 2][4];

    for (var i = 0; i < resultArr.length - 1; i++) {
      if (resultArr[i][4] > maxTOWPoint) {
        maxTOWPoint = resultArr[i][4];
      }

      if (resultArr[i][4] < minTOWPoint) {
        minTOWPoint = resultArr[i][4];
      }
    }
  }

  firstTOWPointInPercent = firstTOWPoint * 100 / (maxTOWPoint - minTOWPoint);
  lastTOWPointInPercent = lastTOWPoint * 100 / (maxTOWPoint - minTOWPoint); // вираховуємо процентне співвідношення

  if (firstTOWPointInPercent < lastTOWPointInPercent) {
    topPersent = 50 + (lastTOWPointInPercent - firstTOWPointInPercent) / 2;
  } else if (firstTOWPointInPercent > lastTOWPointInPercent) {
    topPersent = 50 - (firstTOWPointInPercent - lastTOWPointInPercent) / 2;
  } else {
    topPersent = 50;
  }

  topPersent = Math.round(topPersent * 10) / 10; // вносимо процентне співвідношення у html

  bottomPersent = (1000 - topPersent * 10) / 10 + '%';
  topPersent += '%';
  $('.tug-of-war__left').css('width', bottomPersent);
  $('.tug-of-war__right-value').text(topPersent);
  $('.tug-of-war__left-value').text(bottomPersent);
} // ↑↑↑ BEM-blocks: tug-of-war (end) ↑↑↑
// made by waldteufel@ukr.net