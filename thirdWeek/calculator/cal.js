document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const resultArea = document.querySelector('.result');
    const resultHistory = document.querySelector('.result-history');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value === '=') {
                try {
                    const result = calculateExpression(resultArea.value);
                    resultArea.value = result;
                    addToHistory(resultArea.value);
                } catch (error) {
                    resultArea.value = 'Error';
                }
            } else if (value === 'C') {
                resultArea.value = '';
            } else {
                resultArea.value += value;
            }
        });
    });

    function calculateExpression(expression) {
        const output = [];
        const operators = [];
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

        const tokens = expression.match(/(\d+|\+|\-|\*|\/)/g);

        tokens.forEach((token) => {
            if (!isNaN(token)) {
                output.push(parseFloat(token));
            } else if (token in precedence) {
                while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                    output.push(operators.pop());
                }
                operators.push(token);
            }
        });

        while (operators.length) {
            output.push(operators.pop());
        }

        return evaluateRPN(output);
    }

    function evaluateRPN(tokens) {
        const stack = [];

        tokens.forEach((token) => {
            if (typeof token === 'number') {
                stack.push(token);
            } else {
                const b = stack.pop();
                const a = stack.pop();
                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        stack.push(a / b);
                        break;
                }
            }
        });

        return stack[0];
    }

    function addToHistory(result) {
        const historyItem = document.createElement('div');
        historyItem.textContent = result;
        resultHistory.appendChild(historyItem);
    }
});
