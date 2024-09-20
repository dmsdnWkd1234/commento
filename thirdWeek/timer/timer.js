let alarms = [];
console.log(alarms);
let currentBattery = 100; // 현재 배터리
const currentTime = document.querySelector('.current-time'); //현재
const currentDay = document.querySelector('.current-date');
const timeInput = document.querySelectorAll('.time-input');
let intervalId;

const battery = () => {
    const batteryElement = document.querySelector('.current-battery');
    if (intervalId) {
        clearInterval(intervalId);
    }
    const decreaseBattery = () => {
        if (currentBattery > 0) {
            currentBattery = currentBattery - 1;
            batteryElement.innerText = `${currentBattery}%`;
        } else {
            batteryElement.innerText = '배터리가 다 닳았습니다.';
            clearInterval(intervalId);
        }
    };
    intervalId = setInterval(decreaseBattery, 1000);
};

const chargingBattery = () => {
    currentBattery = 100;
    document.querySelector('.current-battery').innerText = `${currentBattery}%`;
    battery();
};

const getCurrentTime = () => {
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (currentBattery > 0) {
        currentTime.innerText = `${hour}:${minutes}:${seconds}`;
    } else {
        currentTime.innerText = '배터리가 다 닳았습니다';
    }
};

const getCurrentDay = () => {
    const now = new Date();
    const year = String(now.getFullYear()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    currentDay.innerText = `${year}년${month}월${day}일`;
};

const updateAtMidnight = () => {
    const now = new Date();

    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
        getCurrentDay();
        setInterval(getCurrentDay, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
};

const handleOnInput = (element, maxLength) => {
    if (element.value.length > maxLength) {
        element.value = element.value.substr(0, maxLength);
    }
};

const addAlarm = () => {
    const hour = document.querySelector('.hour').value;
    const min = document.querySelector('.min').value;
    const sec = document.querySelector('.sec').value;

    if (!hour || !min || !sec) return; // 모든 값이 입력되었는지 확인

    // 시/분/초 값을 객체로 만들어 배열에 추가
    const alarmTime = { id: Date.now(), hour, min, sec }; // 고유 ID 부여
    alarms.push(alarmTime);

    // 알람 목록 갱신
    renderAlarms();

    // 입력값 초기화
    document.querySelector('.hour').value = '';
    document.querySelector('.min').value = '';
    document.querySelector('.sec').value = '';
};

// 알람 목록을 출력하는 함수
const renderAlarms = () => {
    const alarmList = document.querySelector('.alarm-list');
    alarmList.innerHTML = alarms
        .map((alarm) => {
            return `
            <div class="alarm-item" data-id="${alarm.id}">
                ${alarm.hour}시 ${alarm.min}분 ${alarm.sec}초
                <button class="delete-alarm-btn" onclick="deleteAlarm(${alarm.id})">X</button>
            </div>
        `;
        })
        .join('');
};

// 알람 삭제 함수
const deleteAlarm = (id) => {
    alarms = alarms.filter((alarm) => alarm.id !== id);
    renderAlarms();
};

// 버튼 클릭 시 알람 추가
document.querySelector('.alarm-btn').addEventListener('click', addAlarm);

timeInput.forEach((ipnut) => {
    ipnut.addEventListener('input', function () {
        handleOnInput(this, 2);
    });
});

battery(); // 현재 배터리
getCurrentTime(); // 처음 실행했을때 바로 시간 불러오게 하기
setInterval(getCurrentTime, 1000); // 그 이후 1초마다 불러오게 하기
getCurrentDay(); // 현재 날짜 불러오기
updateAtMidnight(); // 그 이후 자정에서 남은 시간만큼 뺀 시간 이후에 한 번 불러오고 그 이후로는 24시간에 한번씩 불러옴
document.querySelector('.charging-battery').addEventListener('click', chargingBattery);
