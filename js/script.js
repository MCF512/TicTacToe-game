let cells = document.querySelectorAll('.cell');
let field = document.querySelector('.field');
let namesForm = document.forms.players;
let namesInputs = document.querySelectorAll('.playername');
let playerToStep = document.querySelector('.player-steps');

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
let gameStarted = false;
let results;

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
  }
  if (gameStarted) {
    namesForm.submitBtn.innerHTML = 'Перезапустить'
    namesForm.submitBtn.addEventListener('click', reloadGame)
    whoSteps(stepCount)
  }
});

namesInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.style.borderColor == 'red') {
      input.style.borderColor = 'rgb(24, 163, 163)'
    }
  })
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
        namesForm.submitBtn.innerHTML = 'Сыграть еще';
        gameStarted = false;
        console.log(gameResult);
        return
      } else if (zeroWin) {
        field.removeEventListener('click', handleClick);
        gameResult = `Победил(а) ${namesForm.player2.value}`;
        namesForm.submitBtn.innerHTML = 'Сыграть еще';
        gameStarted = false;
        console.log(gameResult);
        return
      } else if ((i == winConditions.length - 1) && stepCount == 10 && !crossWin && !zeroWin) {
        gameResult = 'Ничья';
        namesForm.submitBtn.innerHTML = 'Сыграть еще';
        gameStarted = false;
        console.log(gameResult)
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
}

function whoSteps(count) {
  if (count % 2 == 0) {
    playerToStep.innerHTML = `Ходит ${namesForm.player2.value}`
  } else {
    playerToStep.innerHTML = `Ходит ${namesForm.player1.value}`
  }
}

function stats() {
  let player1 = namesForm.player1.value;
  let player2 = namesForm.player2.value;

  if (localStorage.results == null) {
    localStorage.setItem('results', JSON.stringify([results]))
  }
}