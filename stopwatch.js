let timer = JSON.parse(localStorage.getItem('timer')) || {
  hours: 0,
  minutes: 0,
  seconds: 0,
  one_hundredth_second: 0
};

let laps = JSON.parse(localStorage.getItem('laps')) || [];

let startTime = JSON.parse(localStorage.getItem('startTime')) || {
  hours: 0,
  minutes: 0,
  seconds: 0,
  one_hundredth_second: 0
};

let total = JSON.parse(localStorage.getItem('total')) || {
  hours: 0,
  minutes: 0,
  seconds: 0,
  one_hundredth_second: 0
};

timerDisplay();
lapsDisplay();


let intervalId;
let isRunning = false;

document.querySelector('.js-start-button').addEventListener('click', () => {
  if (!isRunning) {
    const startButton = document.querySelector('.start-button');
    if (startButton) {
      startButton.classList.add('stop-button');
      startButton.classList.remove('start-button');
    }
    start();
  }
  else {
    const stopButton = document.querySelector('.stop-button');
    if (stopButton) {
      stopButton.classList.add('start-button');
      stopButton.classList.remove('stop-button');
    }
    stop();
  }
});

document.querySelector('.js-reset-button').addEventListener('click', reset);

function start() {
  isRunning = true;

  document.querySelector('.js-start-button').innerText = 'STOP';
  
  const resetButton = document.querySelector('.init-timer');

  if (resetButton) {
    resetButton.classList.remove('init-timer');
  }

  document.querySelector('.js-lap-button').innerHTML = `      <button class="lap-button">LAP</button>
  `;
  document.querySelector('.lap-button').classList.add('lap-button-display');
  document.querySelector('.lap-button').addEventListener('click', takeLap);

  intervalId = setInterval(() => {
    timer.one_hundredth_second++;
    if (timer.one_hundredth_second == 100) {
      timer.one_hundredth_second = 0;
      timer.seconds++;
      if (timer.seconds == 60) {
        timer.seconds = 0;
        timer.minutes++;
        if (timer.minutes == 60) {
          timer.minutes = 0;
          timer.hours++;
        }
      }
    }

    timerDisplay();

    localStorage.setItem('timer', JSON.stringify(timer));

  }, 10);
}

function stop() {
  isRunning = false;
  clearInterval(intervalId);
  document.querySelector('.js-start-button').innerText = 'START';
  document.querySelector('.js-lap-button').innerHTML = '';
}

function reset() {
  stop();
  timer.hours = 0;
  timer.minutes = 0;
  timer.seconds = 0;
  timer.one_hundredth_second = 0;
  localStorage.setItem('timer', JSON.stringify(timer));
  timerDisplay();
  document.title = 'Stopwatch App';
  const stopButton = document.querySelector('.stop-button');
  if (stopButton) {
    stopButton.classList.add('start-button');
    stopButton.classList.remove('stop-button');
  }
  document.querySelector('.js-reset-button').classList.add('init-timer');

  document.querySelector('.js-laps-title').innerHTML = '';
  document.querySelector('.js-laps').innerHTML = '';
  startTime = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    one_hundredth_second: 0
  };
  
  total = Object.assign({}, startTime);
  laps.length = 0;

  const lapTitle = document.querySelector('.laps-title-display');
  if (lapTitle) {
    document.querySelector('.js-laps-title').classList.remove('laps-title-display');
  }
}

function timerDisplay() {
  const hours = timer.hours < 10? '0' + timer.hours: timer.hours;
  const minutes = timer.minutes < 10? '0' + timer.minutes: timer.minutes;
  const seconds = timer.seconds < 10? '0' + timer.seconds: timer.seconds;

  document.querySelector('.js-timer').innerHTML = `${hours}h:${minutes}m:${seconds}s.${timer.one_hundredth_second}`;

  document.title = `${hours}h:${minutes}m:${seconds}s.${timer.one_hundredth_second}`;

  if (hours == 0 && minutes == 0 && seconds == 0 && timer.one_hundredth_second == 0) {
    document.querySelector('.js-reset-button').classList.add('init-timer');
  }
}

function lapsDisplay() {
  if (laps.length) {
    document.querySelector('.js-laps-title').innerHTML = `
      <div class="lap-index">Lap</div>
      <div class="lap-time">Time</div>
      <div class="lap-total">Total</div>
    `;
    const lapTitle = document.querySelector('.laps-title-display');
    if (!lapTitle) {
      document.querySelector('.js-laps-title').classList.add('laps-title-display');
    }

    const lapDisplay = document.querySelector('.js-laps');
    let html = '';
    for (let i = laps.length - 1; i >= 0; i--) {
      html += `
        <div>${i + 1}</div>
        <div>${formatTime(laps[i].time)}</div>
        <div>${formatTime(laps[i].total)}</div>
      `; 
    }
    lapDisplay.innerHTML = html;
  }
}

function formatTime(time) {
  const hours = time.hours < 10? '0' + time.hours: time.hours;
  const minutes = time.minutes < 10? '0' + time.minutes: time.minutes;
  const seconds = time.seconds < 10? '0' + time.seconds: time.seconds;
  return `${hours}h:${minutes}m:${seconds}s.${timer.one_hundredth_second}`;
}

function subtractTime(time1, time2) {
  let one_hundredth_second = 0, seconds = 0, minutes = 0, hours = 0;
  if (time1.one_hundredth_second < time2.one_hundredth_second) {
    one_hundredth_second = time1.one_hundredth_second + 100 - time2.one_hundredth_second;
    time1.seconds--;
  }
  else {
    one_hundredth_second = time1.one_hundredth_second - time2.one_hundredth_second;
  }
  if (time1.seconds < time2.seconds) {
    seconds = time1.seconds + 60 - time2.seconds;
    time1.minutes--;
  }
  else {
    seconds = time1.seconds - time2.seconds;
  }
  if (time1.minutes < time2.minutes) {
    minutes = time1.minutes + 60 - time2.minutes;
    time1.hours--;
  }
  else {
    minutes = time1.minutes - time2.minutes;
  }
  hours = time1.hours - time2.hours;
  return {hours, minutes, seconds, one_hundredth_second};
}

function takeLap() {
  document.querySelector('.js-laps-title').innerHTML = `
    <div class="lap-index">Lap</div>
    <div class="lap-time">Time</div>
    <div class="lap-total">Total</div>
  `;
  const lapTitle = document.querySelector('.laps-title-display');
  if (!lapTitle) {
    document.querySelector('.js-laps-title').classList.add('laps-title-display');
  }

  total = Object.assign({}, timer);
  laps.push({
    time: subtractTime(total, startTime),
    total
  });
  startTime = Object.assign({}, total);
  localStorage.setItem('laps', JSON.stringify(laps));
  localStorage.setItem('total', JSON.stringify(total));
  localStorage.setItem('startTime', JSON.stringify(startTime));

  const lapDisplay = document.querySelector('.js-laps');
  let html = '';
  for (let i = laps.length - 1; i >= 0; i--) {
    html += `
      <div>${i + 1}</div>
      <div>${formatTime(laps[i].time)}</div>
      <div>${formatTime(laps[i].total)}</div>
    `; 
  }
  lapDisplay.innerHTML = html;
}

