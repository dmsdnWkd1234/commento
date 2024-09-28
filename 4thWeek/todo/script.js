document.addEventListener('DOMContentLoaded', () => {
    const todoEndpoint = 'http://localhost:5000/todos';

    const getDate = () => {
        const today = document.querySelector('.today');
        const date = new Date();
        const year = String(date.getFullYear()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        today.innerHTML = `${year}년 ${month}월 ${day}일`;
    };

    const getJsonData = () => {
        fetch(todoEndpoint, {
            method: 'GET',
            headers: {
                'content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                data.forEach((item) => {
                    createElement(item);
                });
            })
            .catch((err) => console.log(err));
    };

    const pushJsonData = () => {
        const todoValue = document.querySelector('.text-area').value;
        if (todoValue.length > 0 && todoValue.length <= 30) {
            fetch(todoEndpoint, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ value: todoValue, complete: false }),
            });
            console.log(todoValue.length);
        } else if (todoValue.length > 30) {
            alert('30자 이하로 입력해주세요');
        } else {
            alert('할 일을 입력하세요.');
        }
    };

    const deleteJsonData = (todoId) => {
        fetch(`${todoEndpoint}/${todoId}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ id: todoId }),
        });
    };

    const patchTodoCheckd = (todoId, isCheckd) => {
        fetch(`${todoEndpoint}/${todoId}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ complete: isCheckd }),
        });
    };

    const patchTodoValue = (todoId, value) => {
        fetch(`${todoEndpoint}/${todoId}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ value: value }),
        });
    };

    const createElement = (todoItem) => {
        // 할 일 리스트를 담을 섹션 선택
        const todoSection = document.querySelector('.todo-list');

        // 새로운 할 일 항목을 감쌀 div 생성
        const newTodoBox = document.createElement('div');
        newTodoBox.className = 'todo'; // 할 일 항목 div에 class 추가

        // 할 일의 텍스트를 표시할 div 생성
        const checkComplete = () => {
            const todoBoxValue = document.createElement('div');
            if (!todoItem.complete) {
                todoBoxValue.className = 'todo-value';
            } else {
                todoBoxValue.className = 'todo-value-completed';
            }

            todoBoxValue.textContent = todoItem.value;
            newTodoBox.appendChild(todoBoxValue); // 텍스트 추가
        };

        // 완료 여부를 표시할 체크박스 생성
        const todoCheck = document.createElement('input');
        todoCheck.type = 'checkbox';
        todoCheck.className = 'todo-checked';
        todoCheck.checked = todoItem.complete; // JSON의 complete 값에 따라 체크 여부 설정

        // 삭제 버튼 생성
        const todoDelete = document.createElement('button');
        todoDelete.className = 'todo-delete-btn';
        todoDelete.textContent = '삭제';

        // 수정 버튼 생성
        const patchTodo = document.createElement('button');
        patchTodo.className = 'todo-patch-btn';
        patchTodo.textContent = '수정';

        todoDelete.addEventListener('click', () => deleteJsonData(todoItem.id));
        todoCheck.addEventListener('change', (e) => {
            const isCheckd = e.target.checked;
            patchTodoCheckd(todoItem.id, isCheckd);
        });
        patchTodo.addEventListener('click', () => {
            patchTodo.className = 'todo-patch-btn patch-complete';
            patchTodo.textContent = '완료';
            const createPatchInput = createElement('input');
            createPatchInput.className = 'patch-todo-value';
        });

        // 항목을 newTodoBox에 추가
        newTodoBox.appendChild(todoCheck); // 체크박스 추가
        newTodoBox.appendChild(todoDelete); // 삭제 버튼 추가
        newTodoBox.appendChild(patchTodo); // 수정 버튼 추가
        // newTodoBox를 todoSection에 추가
        todoSection.appendChild(newTodoBox);

        checkComplete();
    };

    // dom이 로드 된 후에 버튼에 이벤트 추가
    window.onload = () => {
        const addBtn = document.querySelector('.add-Btn');
        addBtn.addEventListener('click', pushJsonData);
    };

    getJsonData();
    getDate();
});
