const p1 = {
    button: document.querySelector('#p1button'),
    display: document.querySelector('#p1display'),
    score: 0
}

const p2 = {
    button: document.querySelector('#p2button'),
    display: document.querySelector('#p2display'),
    score: 0
}

const resetButton = document.querySelector('#resetbutton');
const goalSelector = document.querySelector('#playto');
let gameOver = false;
let winningScore = 3;

const updateScore = (player, opponent) => {
    if (!gameOver) {
        player.score++
        if (player.score === winningScore) {
            gameOver = true;
            player.button.disabled = true;
            opponent.button.disabled = true;
            player.display.classList.add('text-success');
            opponent.display.classList.add('text-danger');
        }
    }
    player.display.textContent = player.score;
    opponent.display.textContent = opponent.score;
}


p1.button.addEventListener('click', function () {
    updateScore(p1, p2);
})

p2.button.addEventListener('click', function () {
    updateScore(p2, p1);
})

goalSelector.addEventListener('change', function () {
    winningScore = parseInt(goalSelector.value);
    reset();
})

resetButton.addEventListener('click', reset);

function reset() {
    for (let p of [p1, p2]) {
        gameOver = false;
        p.button.disabled = false;
        p.score = 0;
        p.display.classList.remove('text-success', 'text-danger');
        p.display.textContent = p.score;
    }
}




// const p1button = document.querySelector('#p1button');
// const p1display = document.querySelector('#p1display');
// let p1score = 0;

// let gameOver = false;
// let winningScore = 3;

// p1button.addEventListener('click', function () {
//     if (!gameOver) {
//         p1score++
//         if (p1score === winningScore) {
//             gameOver = true;
//             p1button.disabled = true;
//             p1display.classList.add('text-success');
//         }
//     }
//     p1display.textContent = p1score;
// })

// function reset() {

// }