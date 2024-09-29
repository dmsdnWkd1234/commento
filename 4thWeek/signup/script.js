document.addEventListener('DOMContentLoaded', () => {
    const usersEndpoint = 'http://localhost:5000/users';
    const idRegex = /^[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    const pwregex = /^(?!.*(\d)\1{2})(?=.*[!@#$%^&*])(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,16}$/;
    const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const signUpBtn = document.querySelector('.signup-btn');
    const deleteAll = document.querySelector('.delete-btn');

    const getUserInfo = () => {
        fetch(usersEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                data.forEach((userInfo) => {
                    checkOverlap(userInfo);
                });
                console.log(data);
            });
    };

    const checkOverlap = (userInfo) => {
        deleteAll.addEventListener('click', () => deleteAllUsers(userInfo.id));
    };

    const postUsersinfo = () => {
        const idValue = document.querySelector('.id').value;
        const pwValue = document.querySelector('.password').value;
        const emailValue = document.querySelector('.email').value;
        if (!idRegex.test(idValue)) {
            alert('아이디는 숫자와 영어가 포함된 8자 이상 16자 이하여야합니다');
        } else if (!pwregex.test(pwValue)) {
            alert(
                '비밀번호는 8자 이상 16자 이하이고 특수문자가 반드시 하나 이상 포함된 숫자와 영어의 조합이여야 합니다'
            );
        } else {
            fetch(usersEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: idValue,
                    password: pwValue,
                    email: emailValue,
                }),
            });
        }
    };

    const deleteAllUsers = (id) => {
        fetch(`${usersEndpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    signUpBtn.addEventListener('click', postUsersinfo);
    getUserInfo();
});
