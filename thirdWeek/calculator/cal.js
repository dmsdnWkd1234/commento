document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const resultArea = document.querySelector('.result');
    const resultHistory = document.querySelector('.result-history'); // 결과 기록 div 선택

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value === '=') {
                try {
                    const result = calculateExpression(resultArea.value);
                    resultArea.value = result; // 계산 결과 표시
                    addToHistory(resultArea.value); // 결과를 기록에 추가
                } catch (error) {
                    resultArea.value = 'Error'; // 계산 오류 처리
                }
            } else if (value === 'C') {
                resultArea.value = ''; // 수식 초기화
            } else {
                resultArea.value += value; // textarea에 버튼 값 추가
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

    // 계산 결과를 기록하는 함수
    function addToHistory(result) {
        const historyItem = document.createElement('div');
        historyItem.textContent = result; // 계산 결과를 div에 추가
        resultHistory.appendChild(historyItem); // 기록 div에 추가
    }
});
