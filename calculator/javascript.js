// Name: Nicholas vickery
// Date: start date - 06/20/2023, end date - 6/25/2023
// Project: Calculator




let display = document.getElementById('display');
let currentInput = '';
let currentOperation = null;
let shouldResetDisplay = false;

const buttons = [
    { text: 'C', action: clearDisplay },
    { text: 'CE', action: clearEntry },
    { text: '%', action: convertToPercent },
    { text: '<=', action: backspace },
    { text: '7', action: () => appendNumber('7') },
    { text: '8', action: () => appendNumber('8') },
    { text: '9', action: () => appendNumber('9') },
    { text: '/', action: () => appendOperation('/') },
    { text: '4', action: () => appendNumber('4') },
    { text: '5', action: () => appendNumber('5') },
    { text: '6', action: () => appendNumber('6') },
    { text: '*', action: () => appendOperation('*') },
    { text: '1', action: () => appendNumber('1') },
    { text: '2', action: () => appendNumber('2') },
    { text: '3', action: () => appendNumber('3') },
    { text: '-', action: () => appendOperation('-') },
    { text: '0', action: () => appendNumber('0') },
    { text: '.', action: () => appendNumber('.') },
    { text: '=', action: calculateAndAddToHistory },
    { text: '+', action: () => appendOperation('+') },
    { text: '1/x', action: reciprocate },
    { text: '^', action: () => appendOperation('^') },
    { text: '\u221A', action: squareRoot },
    { text: '+/-', action: toggleSign }
];
const operationsDisplay = {
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '%': '%',
    'sqrt': '\u221A',
    'exp': '^',
    'frac': '1/',
    '+/-': '+/-',
    'bs': '←',
    'ce': 'CE',
    '^' : '^',
};

window.onload = function() {
    const buttonsDiv = document.getElementsByClassName('buttons')[0];
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.innerHTML = button.text;
        btn.className = 'glowing';
        btn.onclick = button.action;
        buttonsDiv.appendChild(btn);
    });
}

function appendNumber(number) {
    if (display.value === "0" || shouldResetDisplay) resetDisplay();
    display.value += number;
}

function appendOperation(operator) {
    if (currentOperation !== null) calculate();
    currentInput = display.value;
    currentOperation = operator;
    shouldResetDisplay = true;
}
// parse float means to parses a value as a string and returns the first number
function calculate() {
    if (currentInput === null) {
        return;
    }

    let computation;
    const prev = parseFloat(currentInput);
    const current = parseFloat(display.value);
    switch (currentOperation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if(current === 0) {
                showErrorMessage("Cannot divide by zero");
                return;
            } else {
                computation = prev / current;
            }
            break;
        case '%':
            computation = prev % current;
            break;
        case '^':
            computation = Math.pow(prev, current);
            break;
        default:
            return;
    }
    display.value = computation;
    currentOperation = null;
    shouldResetDisplay = true;
}

function resetDisplay() {
    display.value = '';
    shouldResetDisplay = false;
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    currentOperation = null;
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function clearEntry() {
    display.value = '';
}
function convertToPercent() {
    const value = parseFloat(display.value);
    currentInput = display.value;
    currentOperation = 'percent';
    display.value = value / 100;
}
function reciprocate() {
    const value = parseFloat(display.value);
    if (value !== 0) {
        currentInput = display.value;
        currentOperation = 'reciprocate';
        display.value = 1 / value;
        shouldResetDisplay = true;
    } 
    else {
        showErrorMessage("Cannot divide by zero");
    }
}

function squareRoot() {
    const value = parseFloat(display.value);
    if (value < 0) {
        showErrorMessage('Error: Cannot find the square root of a negative number');
        return;
    }
    currentInput = display.value;
    currentOperation = 'sqrt';
    display.value = Math.sqrt(value);
}

function toggleSign() {
    display.value = parseFloat(display.value) * -1;
}
function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    setTimeout(() => { errorMessage.innerText = ''; }, 3000); // Remove the message after 3 seconds
}
function calculateAndAddToHistory() {
    const prev = parseFloat(currentInput);
    const current = parseFloat(display.value);
    const operation = operationsDisplay[currentOperation];
    if (currentOperation === 'sqrt') {
        addToHistory(`\u221A ${prev} = ${current}`);
    } 
    else if (currentOperation === 'reciprocate') {
        addToHistory(`1/${prev} = ${current}`);
    } 
    else if (currentOperation === 'percent') {
        addToHistory(`${prev}% = ${current}`);
    } else {
        calculate();
        addToHistory(`${prev} ${operation} ${current} = ${display.value}`);
    }
}
function addToHistory(value) {
    const historyList = document.getElementById('historyList');
    const newEntry = document.createElement('li');
    newEntry.textContent = value;
    historyList.appendChild(newEntry);
}