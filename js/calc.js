function add(a, b) { 
    return +a + +b;
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
    isOp: false,
    displVar: '',
    equals: false,
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
        case '×':
            return multiply(a, b);
        case '/':
        case '÷':
            return divide(a, b);
        default:
            console.log('error');
            return;
    }
};

function refreshScreen(currText) {
    const screen = document.querySelector('.screen');

    // to handle float precision errors, innate with native JS
    // more info here: https://stackoverflow.com/questions/1458633/how-can-i-deal-with-floating-point-number-precision-in-javascript?noredirect=1&lq=1
    let floatCheck = parseFloat(Number(calcVars.displVar)
        .toFixed(12))
        .toString();

    if (calcVars.isOp) {
        if (floatCheck.length > 8) {
            currText.textContent = `${parseFloat(calcVars.displVar).toExponential(2)}${calcVars.op}`;
        } else {
            currText.textContent = `${floatCheck}${calcVars.op}`;
        }
    }

    //for checking result after '=' button pressed - due to chaining feature, remember that the total value stored in numA
    floatCheck = parseFloat(Number(calcVars.numA)
        .toFixed(12))
        .toString();

    if (calcVars.equals) {
        if (floatCheck.length > 8) {
            currText.textContent = parseFloat(calcVars.numA).toExponential(2);
        } else {
            currText.textContent = floatCheck;
        }
    }

    screen.textContent = '';
    screen.appendChild(currText);
}

function insertNum(currText, input) {
    // this conditional prevents leading zeros
    if (currText.textContent === '0' && input === '0') {
        return;
    } else if (currText.textContent === '0' && input !== '0') {
        calcVars.displVar = input;
        currText.textContent = input;
        refreshScreen(currText);
        return;    
    }

    // clear screen if previous input was an operator
    if (calcVars.isOp) {
        calcVars.isOp = false;
        calcVars.equals = false;
        calcVars.displVar = '';
    } else if (calcVars.equals) {
        resetCalc();
        calcVars.displVar = '';
    }

    calcVars.displVar += input;
    currText.textContent = calcVars.displVar;
}

function insertOp(currText, input) {
    
    // prevent screen from clearing if operator button pressed sucessively
    if ((input === calcVars.op) && (calcVars.displVar === '')) return;

    // if operator has been pressed, then same/another operator pressed, ONLY change operator, DONT change numA
    if (calcVars.isOp) {
        calcVars.op = input;
        currText.textContent = calcVars.displVar + input;
        return;
    }

    if (calcVars.equals) {
        // stop chaining feature from '=' button, which retained previous displVar
        calcVars.displVar = calcVars.numA;
    } else if (!(calcVars.numA)) {
        calcVars.numA = calcVars.displVar;
    } else {
            calcVars.numA = operate(calcVars.numA, calcVars.displVar, calcVars.op);
            calcVars.displVar = calcVars.numA;
    }

    calcVars.op = input;
    calcVars.isOp = true;

    currText.textContent = calcVars.displVar + input;

    // percent only applies once unless a new number is inserted (i.e. after operator pressed)
    calcVars.percent = false;
    calcVars.decimal = false;
}

function resetCalc() {
    calcVars.numA = 0;
    calcVars.numB = 0;
    calcVars.op = '';
    calcVars.isOp = false;
    calcVars.percent = false;
    calcVars.decimal = false;
    calcVars.equals = false;
    calcVars.displVar = '0';
}

function plusMinus(currText) {
    if (calcVars.equals) {
        calcVars.numA *= -1;
        calcVars.displVar = calcVars.numA;
    } else {
        calcVars.displVar *= -1;
    }

    currText.textContent = calcVars.displVar;

    // allows operators to be used following +/- btn press
    calcVars.isOp = false;
}

function percentage(currText) {
    // percent should not affect 0
    if ((calcVars.displVar / 100 === 0)) {
        return;
    }

    if (calcVars.equals) {
        calcVars.numA /= 100;
        calcVars.displVar = calcVars.numA;
        calcVars.op = '';
    } else {
        calcVars.displVar = calcVars.displVar / 100;
    }

    calcVars.percent = true;
    currText.textContent = calcVars.displVar + calcVars.op;
}

function decimalBtn(currText, input) {

    // If operator is pressed, then '.' - keep operator, but refresh screen to add '.' as a new number
    if (calcVars.isOp || calcVars.equals || (calcVars.displVar === '')) {
        calcVars.isOp = false;
        calcVars.displVar = '0';
    }

    calcVars.decimal = true;
    calcVars.displVar += input
    currText.textContent = calcVars.displVar
}

function equalsBtn(currText) {
    calcVars.equals = true;

    calcVars.numB = calcVars.displVar;

    calcVars.displVar = operate(calcVars.numA, calcVars.numB, calcVars.op);
    calcVars.numA = calcVars.displVar;
    currText.textContent = calcVars.displVar;

    // prevent further '.' insertions
    (calcVars.displVar % 1 !== 0) ? calcVars.decimal = true : calcVars.decimal = false;

    // to chain sucessive operations from pressing '=' multiple times
    calcVars.displVar = calcVars.numB;

    calcVars.isOp = false;
}

function changeDisplay (btn) {
    const currText = document.createElement('div');
    const input = String(btn.textContent)

    currText.classList.add('display');

    // if number alrdy exists, retrieve that number
    currText.textContent = calcVars.displVar;

    // switch could be better for the following, but unsure how to implement
    // next line checks if is number
    if (+input === +input) {
        insertNum(currText, input);

    } else if ('+-*/×÷'.includes(input)) {
        insertOp(currText, input);

    } else if (input === 'AC') {
        currText.textContent = '0';
        resetCalc();

    } else if (input === '+/-') {
        plusMinus(currText);

    } else if (input === '%') {
        percentage(currText);

    } else if (input === '.') {
        if (calcVars.decimal || calcVars.percent) {
            return;
        } else {
            decimalBtn(currText, input);
        }

    } else if (input === '=') {
        // do nothing if there is no operator
        if (!(calcVars.op)) {
            return;
        } else {
            equalsBtn(currText);
        }

    } refreshScreen(currText);
}

const allBtn = document.querySelectorAll('button');
allBtn.forEach( (btn) => {
    btn.addEventListener('click', () => {
        changeDisplay(btn);
    })
})

const body = document.querySelector('body');
body.addEventListener ('keydown', (e) => {
    let targetBtn;

    if (e.key === 'Escape') {
        targetBtn = document.getElementById('AC');
    } else if (e.key === 'Enter') {
        targetBtn = document.getElementById('=');
    } else {
        targetBtn = document.getElementById(e.key);
    }

    if (targetBtn) {
        targetBtn.click();
        targetBtn.classList.add('keyPressed');
    }
})
body.addEventListener ('keyup', (e) => {
    let targetBtn;
    
    if (e.key === 'Escape') {
        targetBtn = document.getElementById('AC');
    } else if (e.key === 'Enter') {
        targetBtn = document.getElementById('=');
    } else {
        targetBtn = document.getElementById(e.key);
    }
    
    if (targetBtn) {
        targetBtn.classList.remove('keyPressed');
    }
})