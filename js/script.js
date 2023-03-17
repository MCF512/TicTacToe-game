let cells = document.querySelectorAll('.cell');
let field = document.querySelector('.field');
let namesForm = document.forms.players;
let namesInputs = document.querySelectorAll('.playername');
let playerToStep = document.querySelector('.player-steps');
let timer = document.querySelector('.timer');
let statsList = document.querySelector('.stats__results');
let clearStats = document.querySelector('.stats__clear');
let stepCount = 1;
let cross = [];
let zero = [];
let winConditions = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
];
let gameResult = '';
let gameTime = '';
let gameStarted = false;
let results = [];
let seconds = 0;
showStats()
namesForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!namesForm.player1.value) {
    namesForm.player1.style.borderColor = 'red';
    namesForm.player1.placeholder = 'Введите имя первого игрока'
  }
  if (!namesForm.player2.value) {
    namesForm.player2.style.borderColor = 'red';
    namesForm.player2.placeholder = 'Введите имя второго игрока'
  }
  if (namesForm.player1.value && namesForm.player2.value && !gameStarted) {
    field.addEventListener('click', handleClick);
    gameStarted = true;
    timerInner()
  }
  if (gameStarted) {
    namesForm.submitBtn.innerHTML = 'Игра началась!'
    namesForm.submitBtn.addEventListener('click', reloadGame)
    namesForm.submitBtn.setAttribute('disabled', '');
    whoSteps(stepCount)
  }
});

namesInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.style.borderColor == 'red') {
      input.style.borderColor = 'rgb(24, 163, 163)'
    }
  })
});

clearStats.addEventListener('click', () => {
  localStorage.clear();
  results = [];
  showStats()
})

function handleClick(e) {
  let cell;
  if (e.target.classList.contains('cell')) {
    cell = e.target
  }
  if (cell.classList.contains('cross') || cell.classList.contains('zero')) {
    return
  }
  else {
    if (stepCount % 2 == 0) {
      cell.classList.add('zero');
      zero.push(+cell.dataset.value)
      stepCount++
    } else {
      cell.classList.add('cross')
      cross.push(+cell.dataset.value)
      stepCount++
    }

    for (let i = 0; i < winConditions.length; i++) {
      let cond = winConditions[i];
      let crossWin = cond.every(num => cross.includes(num));
      let zeroWin = cond.every(num => zero.includes(num));
      if (crossWin) {
        field.removeEventListener('click', handleClick);
        gameResult = `Победил(а) ${namesForm.player1.value}`
        namesForm.submitBtn.removeAttribute('disabled', '')
        namesForm.submitBtn.innerHTML = 'Сыграть еще?';
        gameStarted = false;
        timerInner()
        whoWins()
        return
      } else if (zeroWin) {
        field.removeEventListener('click', handleClick);
        gameResult = `Победил(а) ${namesForm.player2.value}`;
        namesForm.submitBtn.removeAttribute('disabled', '')
        namesForm.submitBtn.innerHTML = 'Сыграть еще?';
        gameStarted = false;
        timerInner()
        whoWins()
        return
      } else if ((i == winConditions.length - 1) && stepCount == 10 && !crossWin && !zeroWin) {
        gameResult = 'Ничья';
        namesForm.submitBtn.removeAttribute('disabled', '')
        namesForm.submitBtn.innerHTML = 'Сыграть еще?';
        gameStarted = false;
        timerInner()
        whoWins()
        return
      }
    }
    whoSteps(stepCount)
  }
}

function reloadGame() {
  cells.forEach(cell => {
    if (cell.classList.contains('cross')) cell.classList.remove('cross');
    if (cell.classList.contains('zero')) cell.classList.remove('zero');
  });
  stepCount = 1;
  cross = [];
  zero = [];
  gameStarted = false;
}

function whoSteps(count) {
  if (count % 2 == 0 && gameStarted) {
    playerToStep.innerHTML = `Ходит ${namesForm.player2.value}`
  } else if (count % 2 != 0 && gameStarted) {
    playerToStep.innerHTML = `Ходит ${namesForm.player1.value}`
  }
}

function whoWins() {
  if (!gameStarted && gameResult != null) {
    playerToStep.innerHTML = gameResult;
    let resultItem = {
      players: `${namesForm.player1.value} vs ${namesForm.player2.value}`,
      whoWins: gameResult,
      time: gameTime,
    };

    stats(resultItem);
  }
}

function stats(resultItem) {
  if (localStorage.results == null) {
    results.push(resultItem);
    localStorage.setItem('results', JSON.stringify(results))
    showStats()
  } else {
    results = JSON.parse(localStorage.getItem('results'));
    results.push(resultItem);
    localStorage.setItem('results', JSON.stringify(results));
    showStats()
  }
}

function timerInner() {
  seconds++;
  timer.innerHTML = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  if (gameStarted) {
    setTimeout(timerInner, 1000)
  } else if (!gameStarted && gameResult != null) {
    gameTime = timer.innerHTML;
    timer.innerHTML = '00:00';
    seconds = 0;
  }
}

function showStats() {
  if (localStorage.results != null) {
    results = JSON.parse(localStorage.getItem('results'));
    statsList.innerHTML = ''
    for (let result of results) {
      console.log(result)
      statsList.innerHTML += `<li class="stats__item">
      <p class="stats__players">${result.players}</p>
      <p class="stats__winner">${result.whoWins} | ${result.time}</p>
      </li>`
    }
  } else {
    statsList.innerHTML = '<p class="empty">Тут будут ваши результаты</p>'
  }
}
