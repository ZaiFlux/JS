document.addEventListener('DOMContentLoaded', () => {
  const screen = document.querySelector('.screen');
  const buttons = document.querySelectorAll('.buttons button');

  let currentInput = '';

  function updateScreen() {
    screen.textContent = currentInput || '0';
  }

  function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
  }

  function safeEvaluate(input) {
    while (input && isOperator(input.slice(-1))) input = input.slice(0, -1);
    if (!input) return '0';
    try {
      return Function('"use strict";return (' + input + ')')().toString();
    } catch {
      return 'Error';
    }
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.textContent;

      if (value === '=') {
        currentInput = safeEvaluate(currentInput);
      } else if (value === 'C') {
        currentInput = '';
      } else if (value === '⌫') {
        currentInput = currentInput.slice(0, -1);
      } else {
        if (isOperator(value) && (!currentInput || isOperator(currentInput.slice(-1)))) return;
        if (value === '.') {
          const lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
          if (lastNumber.includes('.')) return;
        }
        currentInput += value;
      }

      updateScreen();
    });
  });

  document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!isNaN(key) || ['+', '-', '*', '/'].includes(key)) {
      if (isOperator(key) && (!currentInput || isOperator(currentInput.slice(-1)))) return;
      currentInput += key;
    } else if (key === '.') {
      const lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
      if (!lastNumber.includes('.')) currentInput += '.';
    } else if (key === 'Enter') {
      currentInput = safeEvaluate(currentInput);
    } else if (key === 'Backspace') {
      currentInput = currentInput.slice(0, -1);
    } else if (key.toLowerCase() === 'c') {
      currentInput = '';
    }

    updateScreen();
  });
});
