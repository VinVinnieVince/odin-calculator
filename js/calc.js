function add(a, b) { 
    return a + b;
};

function subtract(a, b) {
    return a - b;
};

function multiply(a, b) {
    return a * b;
};

function divide(a, b) {
    return a / b;
};

const calcVars = {
    numA: 0,
    numB: 0,
    op: '',
    displVar: '',
    percent: false,
    decimal: false,
}

function operate(a, b, op) {
    switch (op) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            console.log('error');
            return;
    }
};

function changeDisplay (btn) {
    const screen = document.querySelector('.screen');
    const currText = document.createElement('div');
    const input = String(btn.textContent)

    currText.classList.add('display');

    // if number alrdy exists, retrieve that number
    currText.textContent = calcVars.displVar;

    // switch could be better for the following, but unsure how to implement
    // next line checks if is number
    if (+input === +input) {

        // this conditional prevents leading zeros
        if (currText.textContent === '0' && input === '0') {
            return;
        } else if (currText.textContent === '0' && input !== '0') {
            calcVars.displVar = input;

            currText.textContent = input;
    
            screen.textContent = '';
            screen.appendChild(currText);
            return;    
        }

        // if operator has been pressed, clear screen upon pressing next number
        // percent only applies once until an operator AND another number is inputted
        // same with decimal
        if (calcVars.op) {
            calcVars.op = '';
            calcVars.displVar = '';
            calcVars.percent = false;
            calcVars.decimal = false;

            currText.textContent = '';
            screen.textContent = '';

        }

        calcVars.displVar += input;
        currText.textContent = calcVars.displVar;

        screen.textContent = '';
        screen.appendChild(currText);

    } else if ('+-*/'.includes(input)) {

        calcVars.op = input;
        calcVars.decimal = false;

        currText.textContent += input;

        screen.textContent = '';
        screen.appendChild(currText);

    } else if (input === 'AC') {
        calcVars.displVar = '';
        calcVars.op = '';
        calcVars.percent = false;
        calcVars.decimal = false;

        calcVars.displVar = '0';
        screen.textContent = '0';

    } else if (input === '+/-') {
        calcVars.displVar = calcVars.displVar * -1;
        currText.textContent = calcVars.displVar + calcVars.op;

        screen.textContent = '';
        screen.appendChild(currText);
    } else if (input === '%') {
        // percent should only trigger once per number, should not affect 0
        if ((calcVars.displVar / 100 === 0) || calcVars.percent) {
            return;
        }

        calcVars.displVar = calcVars.displVar / 100;
        calcVars.percent = true;
        currText.textContent = calcVars.displVar + calcVars.op;

        screen.textContent = '';
        screen.appendChild(currText);
    } else if (input === '.') {
        if (calcVars.decimal || calcVars.percent) {
            return;
        }

        if (calcVars.op) {
            calcVars.op = '';
            calcVars.displVar = '';
        }

        calcVars.decimal = true;
        calcVars.displVar += input
        currText.textContent = calcVars.displVar

        screen.textContent = '';
        screen.appendChild(currText);
    }
}


const allBtn = document.querySelectorAll('button');
allBtn.forEach( (btn) => {
    btn.addEventListener('click', () => {
        changeDisplay(btn);
    })
})