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
            currText.textContent = input;
            calcVars.displVar = input;
    
            screen.textContent = '';
            screen.appendChild(currText);
            return;    
        }

        // if operator has been pressed, clear screen upon pressing next number
        if (calcVars.op) {
            calcVars.displVar = '';
            screen.textContent = '';
            currText.textContent = '';
            calcVars.op = '';
        }

        currText.textContent += input;
        calcVars.displVar += input;

        screen.textContent = '';
        screen.appendChild(currText);

    } else if ('+-*/'.includes(input)) {
        calcVars.op = input;
        currText.textContent += input;

        screen.textContent = '';
        screen.appendChild(currText);

    } else if (input === 'AC') {
        calcVars.displVar = '';
        screen.textContent = '0';
        currText.textContent = '';
        calcVars.op = '';

    } else if (input === '+/-') {
        currText.textContent = calcVars.displVar * -1;
        calcVars.displVar = calcVars.displVar * -1;

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