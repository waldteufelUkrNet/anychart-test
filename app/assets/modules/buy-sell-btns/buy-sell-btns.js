"use strict";
// buy-sell-btns module

////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ validation + increment/decrement inputs ↓↓↓ */
  document.addEventListener('click', incrementDecrementInputs);
  document.addEventListener('keydown', validateInputs);
  document.addEventListener('keyup', validateInputs);
  document.getElementById('lot').onblur = validateInputs;

  function incrementDecrementInputs(event) {
    let button = event.target.closest('[data-behavior="increment"]') ||
                 event.target.closest('[data-behavior="decrement"]');

    if (!button) return;

    let input = button.parentElement.querySelector('input');

    let currentValue = +input.value,
        minValue     = +input.dataset.minvalue,
        maxValue     = +input.dataset.maxvalue,
        step         = +input.dataset.step,
        behavior     = button.dataset.behavior;

    if (behavior == 'decrement') step = 0 - step;

    let newValue = Math.round( (currentValue + step)*10000 ) /10000;
    if (newValue > maxValue) newValue = maxValue;
    if (newValue < minValue) newValue = minValue;

    input.value = newValue;

  }

  function validateInputs(event) {
    let input = event.target.closest('input[data-validate="numeric"]');
    if (!input) return;

    if (event.type == 'keydown') {
      // фільтрація клавіш - тільки цифри, крапка та клавіші управління
      if ( (event.key >= '0' && event.key <= '9')
           || event.key == 'ArrowLeft'
           || event.key == 'ArrowRight'
           || event.key == 'Backspace'
           || event.key == 'Delete'
           || event.key == '.') {

      } else {
        event.preventDefault();
      }
    } else if (event.type == 'keyup'     &&
               event.key != 'ArrowLeft'  &&
               event.key != 'ArrowRight' &&
               event.key != 'Backspace'  &&
               event.key != 'Delete'     ||
               event.type == 'blur' ) {
      let currentValue = input.value,
          minValue     = input.dataset.minvalue || 0,
          maxValue     = input.dataset.maxvalue;

      //  . -> 0.
      if ( currentValue.startsWith('.') ) {
        let newValue = '0' + currentValue;
        input.value  = newValue;
      }

      // 0 -> 0.
      currentValue = input.value;
      if ( currentValue.startsWith('0') &&
           currentValue.length > 1      &&
           currentValue[1] != '.' ) {
        let newValue = '0.' + currentValue.slice(1);
        input.value  = newValue;
      }

      // only one point
      currentValue = input.value;
      let count    = 0,
          position = 0;
      while (true) {
        let found = currentValue.indexOf('.', position);
        if (found == -1) break;
        position = found + 1;
        count += 1;
        if ( count >= 2) {
          input.value = minValue;
          return
        }
      }

      // after point less then 6 symbols
      currentValue = input.value;
      if ( currentValue.includes('.') ) {
        let tempArr = currentValue.split('.');
        if (tempArr[1].length > 5) {
          input.value = tempArr[0] + '.' + tempArr[1].slice(0,5);
        }
      }

      // minValue < currentValue < maxValue
      currentValue = input.value;
      if (+currentValue < +minValue) input.value = minValue;
      if (+currentValue > +maxValue) input.value = maxValue
    }
  }
/* ↑↑↑ /validation + increment/decrement inputs ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////