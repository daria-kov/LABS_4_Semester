window.onload = function() {
    let a = '';
    let b = '';
    let expressionResult = '';
    let selectedOperation = null;
    let memoryValue = 0;
    let displayColorIndex = 0;
    let lastInputWasOperation = false;

    const outputElement = document.getElementById("result");

    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]');

    const dotButton = document.getElementById("btn_digit_dot");

    const clearButton = document.getElementById("btn_op_clear");
    const signButton = document.getElementById("btn_op_sign");
    const percentButton = document.getElementById("btn_op_percent");
    const backButton = document.getElementById("btn_op_back");
    const plusButton = document.getElementById("btn_op_plus");
    const divButton = document.getElementById("btn_op_div");
    const multButton = document.getElementById("btn_op_mult");
    const minusButton = document.getElementById("btn_op_minus");
    const equalButton = document.getElementById("btn_op_equal");
    const zero000Button = document.getElementById("btn_op_000");
    const sqrtButton = document.getElementById("btn_op_sqrt");
    const squareButton = document.getElementById("btn_op_square");
    const factorialButton = document.getElementById("btn_op_factorial");
    const memoryAddButton = document.getElementById("btn_op_memory_add");
    const memorySubButton = document.getElementById("btn_op_memory_sub");
    const colorButton = document.getElementById("btn_op_color");
    const personalButton = document.getElementById("btn_op_personal");

    function updateDisplay(value) {
        outputElement.innerHTML = value;
    }

    function onDigitButtonClicked(digit) {
        if (digit === '000') {
            if (selectedOperation === null) {
                if (a === '0' || a === '') {
                    a = '0';
                } else {
                    a += '000';
                }
                updateDisplay(a);
            } else {
                if (b === '0' || b === '') {
                    b = '0';
                } else {
                    b += '000';
                }
                updateDisplay(b);
            }
            lastInputWasOperation = false;
            return;
        }

        if (selectedOperation === null) {
            if (digit === '.') {
                if (!a.includes('.')) {
                    if (a === '' || a === '0') {
                        a = '0.';
                    } else {
                        a += '.';
                    }
                }
            } else {
                if (a === '0') {
                    a = digit;
                } else {
                    a += digit;
                }
            }
            updateDisplay(a || '0');
        }
        else {
            if (digit === '.') {
                if (!b.includes('.')) {
                    if (b === '' || b === '0') {
                        b = '0.';
                    } else {
                        b += '.';
                    }
                }
            } else {
                if (b === '0' && digit !== '.') {
                    b = digit;
                } else {
                    b += digit;
                }
            }
            updateDisplay(b || '0');
        }
        lastInputWasOperation = false;
    }


    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        };
    });

    if (dotButton) {
        dotButton.onclick = function() {
            onDigitButtonClicked('.');
        };
    }

    function handleOperation(op) {
        if (selectedOperation !== null && b !== '') {
            calculateResult();
        }

        if (a === '' || a === '0') {
            a = outputElement.innerHTML;
            if (a === '0') return;
        }

        selectedOperation = op;
        b = '';
        lastInputWasOperation = true;
    }

    if (divButton) {
        divButton.onclick = function() {
            handleOperation('/');
        };
    }

    if (multButton) {
        multButton.onclick = function() {
            handleOperation('×');
        };
    }

    if (minusButton) {
        minusButton.onclick = function() {
            handleOperation('−');
        };
    }

    if (plusButton) {
        plusButton.onclick = function() {
            handleOperation('+');
        };
    }

    if (clearButton) {
        clearButton.onclick = function() {
            a = '';
            b = '';
            selectedOperation = null;
            expressionResult = '';
            memoryValue = 0;
            lastInputWasOperation = false;
            updateDisplay('0');
        };
    }

    function calculateResult() {
        if (a === '' || b === '' || selectedOperation === null) {
            return false;
        }

        const num1 = parseFloat(a);
        const num2 = parseFloat(b);

        switch(selectedOperation) {
            case '×':
                expressionResult = num1 * num2;
                break;
            case '+':
                expressionResult = num1 + num2;
                break;
            case '−':
                expressionResult = num1 - num2;
                break;
            case '/':
                if (num2 === 0) {
                    expressionResult = 'Ошибка';
                } else {
                    expressionResult = num1 / num2;
                }
                break;
            default:
                return false;
        }

        if (expressionResult !== 'Ошибка') {
            a = expressionResult.toString();
        } else {
            a = '';
        }
        b = '';
        selectedOperation = null;

        return true;
    }

    if (equalButton) {
        equalButton.onclick = function() {
            if (calculateResult()) {
                updateDisplay(a);
            }
            lastInputWasOperation = false;
        };
    }


    if (signButton) {
        signButton.onclick = function() {
            if (selectedOperation === null) {
                if (a !== '' && a !== '0') {
                    a = a.startsWith('-') ? a.substring(1) : '-' + a;
                    updateDisplay(a);
                }
            } else {
                if (b !== '' && b !== '0') {
                    b = b.startsWith('-') ? b.substring(1) : '-' + b;
                    updateDisplay(b);
                } else if (b === '' && lastInputWasOperation) {
                    b = '-';
                    updateDisplay('-');
                }
            }
        };
    }

    if (percentButton) {
        percentButton.onclick = function() {
            if (selectedOperation === null) {
                if (a !== '') {
                    a = (parseFloat(a) / 100).toString();
                    updateDisplay(a);
                }
            } else {
                if (b !== '') {
                    b = (parseFloat(b) / 100).toString();
                    updateDisplay(b);
                }
            }
        };
    }

    if (backButton) {
        backButton.onclick = function() {
            if (selectedOperation === null) {
                if (a.length > 0) {
                    a = a.slice(0, -1);
                    updateDisplay(a || '0');
                }
            } else {
                if (b.length > 0) {
                    b = b.slice(0, -1);
                    updateDisplay(b || '0');
                }
            }
        };
    }

    if (sqrtButton) {
        sqrtButton.onclick = function() {
            if (selectedOperation === null) {
                if (a !== '') {
                    const num = parseFloat(a);
                    if (num < 0) {
                        updateDisplay('Ошибка');
                    } else {
                        a = Math.sqrt(num).toString();
                        updateDisplay(a);
                    }
                }
            } else {
                if (b !== '') {
                    const num = parseFloat(b);
                    if (num < 0) {
                        updateDisplay('Ошибка');
                    } else {
                        b = Math.sqrt(num).toString();
                        updateDisplay(b);
                    }
                }
            }
        };
    }

    if (squareButton) {
        squareButton.onclick = function() {
            if (selectedOperation === null) {
                if (a !== '') {
                    const num = parseFloat(a);
                    a = (num * num).toString();
                    updateDisplay(a);
                }
            } else {
                if (b !== '') {
                    const num = parseFloat(b);
                    b = (num * num).toString();
                    updateDisplay(b);
                }
            }
        };
    }

    if (factorialButton) {
        factorialButton.onclick = function() {
            let numStr = selectedOperation === null ? a : b;
            if (numStr !== '' && numStr !== '0') {
                let num = parseInt(numStr);
                if (num < 0) {
                    updateDisplay('Ошибка');
                } else {
                    let result = 1;
                    for (let i = 2; i <= num; i++) {
                        result *= i;
                    }
                    if (selectedOperation === null) {
                        a = result.toString();
                    } else {
                        b = result.toString();
                    }
                    updateDisplay(result.toString());
                }
            }
        };
    }

    if (zero000Button) {
        zero000Button.onclick = function() {
            onDigitButtonClicked('000');
        };
    }

    if (memoryAddButton) {
        memoryAddButton.onclick = function() {
            const currentValue = parseFloat(outputElement.innerHTML);
            if (!isNaN(currentValue)) {
                memoryValue += currentValue;
                console.log('M+ =', memoryValue);
            }
        };
    }

    if (memorySubButton) {
        memorySubButton.onclick = function() {
            const currentValue = parseFloat(outputElement.innerHTML);
            if (!isNaN(currentValue)) {
                memoryValue -= currentValue;
                console.log('M- =', memoryValue);
            }
        };
    }

    if (colorButton) {
        colorButton.onclick = function() {
            const colors = [
                'rgba(255, 255, 255, 0.25)',
                'rgba(173, 216, 230, 0.4)',
                'rgba(255, 182, 193, 0.4)',
                'rgba(144, 238, 144, 0.4)',
                'rgba(255, 255, 0, 0.3)'
            ];

            const display = document.querySelector('.calculator-display');
            displayColorIndex = (displayColorIndex + 1) % colors.length;
            display.style.backgroundColor = colors[displayColorIndex];
        };
    }

    if (personalButton) {
        personalButton.onclick = function() {
            let numStr = outputElement.innerHTML;
            if (numStr !== '0' && numStr !== 'Ошибка') {
                let cleanStr = numStr.replace('-', '').replace('.', '');
                let sum = 0;
                for (let digit of cleanStr) {
                    sum += parseInt(digit);
                }

                if (selectedOperation === null) {
                    a = sum.toString();
                } else {
                    b = sum.toString();
                }
                updateDisplay(sum.toString());
            }
        };
    }

    updateDisplay('0');
};
