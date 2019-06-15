const board = [];
const boardWidth = 28,
    boardHeight = 16;
const specalNumbers = [111,222,333,444,555,666,777,888,999,24,2,242,8,3,803,19,198,14,148]; 
var snakeX;
var snakeY;
var snakeDirection;
var snakeLength;
var score = 0;
var isPlay = false;
var namePlayer;
var bestScore = 0;

document.addEventListener('DOMContentLoaded', function () {
    var db = firebase.firestore();


    function setBestScore() {
        db.collection('best_score').get().then(function (snap) {
            var player_max_score = max(snap.docs);
            $('#best-score').text(`${player_max_score.data().name} : ${player_max_score.data().score}`);
            bestScore = player_max_score.data().score;
        })
    }
    function max(items) {
        return items.reduce((acc, val) => {
            if(acc.data().score < val.data().score){
                acc = val;
            }
            return acc;
        },items[0]);
    }
    
    function setNumberPlayer(){
        db.collection('player').get().then(function (snap) {
            $('#number-player').text(snap.docs.length);
        })
    }

    function addNewScore(score) {
        db.collection("best_score").add({
            name: namePlayer,
            score: score,
        })
        setBestScore();
        bestScore = score;
    }

    function addPlayer() {
        db.collection("player").add({
            name: namePlayer,
        })
    }

    function startGame() {
        if (score > bestScore) {
            addNewScore(score);
        }
        for (var y = 0; y < boardHeight; ++y) {
            for (var x = 0; x < boardWidth; ++x) {
                board[y][x].snake = 0;
                board[y][x].apple = 0;
                board[y][x].gold = 0;
            }
        }

        // Default position for the snake in the middle of the board.
        snakeX = Math.floor(boardWidth / 2);
        snakeY = Math.floor(boardHeight / 2);
        snakeLength = 5;
        snakeDirection = 'Up';
        score = 0;

        // Set the center of the board to contain a snake
        board[snakeY][snakeX].snake = snakeLength;
        placeApple();
    }

    function initGame() {
        const boardElement = document.getElementById('board');
        for (var y = 0; y < boardHeight; ++y) {
            var row = [];
            for (var x = 0; x < boardWidth; ++x) {
                var cell = {
                    snake: 0
                };
                cell.element = document.createElement('div');
                boardElement.appendChild(cell.element);
                row.push(cell);
            }
            board.push(row);
        }
        startGame();
        // $(document).keypress(function(e) {
        //     if(e.which == 32) {
        //         if(!isPlay)
        //             gameLoop();
        //     }
        // });
        $('#play').click(function (e) {
            if (!isPlay) {
                namePlayer = $('#input-name').val();
                if (namePlayer) {
                    $('#form-input').css('display', 'none');
                    addPlayer();
                    gameLoop();
                }
            }

        });
    }

    function gameLoop() {
        document.getElementById('score').innerText = score.toString();
        isPlay = true;
        switch (snakeDirection) {
            case 'Up':
                snakeY--;
                break;
            case 'Down':
                snakeY++;
                break;
            case 'Left':
                snakeX--;
                break;
            case 'Right':
                snakeX++;
                break;
        }
        if (snakeX < 0 || snakeY < 0 || snakeX >= boardWidth || snakeY >= boardHeight) {
            startGame()
        }

        if (board[snakeY][snakeX].snake > 0) {
            startGame();
        }
        // Collect apples
        if (board[snakeY][snakeX].apple === 1) {
            snakeLength++;
            board[snakeY][snakeX].apple = 0;
            placeApple()
            score++;
        }
        if (board[snakeY][snakeX].gold === 1) {
            snakeLength--;
            board[snakeY][snakeX].gold = 0;
            placeApple()
            score+=5;
        }

        // Update the board at the new snake position
        board[snakeY][snakeX].snake = snakeLength;

        for (var y = 0; y < boardHeight; ++y) {
            for (var x = 0; x < boardWidth; ++x) {
                var cell = board[y][x];
                if (cell.apple === 1) {
                    if(cell.snake > 0 ){
                        cell.apple = 0;
                        placeApple(); 
                    }
                    cell.element.className = 'apple';
                } else if (cell.snake > 0) {
                    cell.element.className = 'snake';
                    cell.snake -= 1;
                }
                else if (cell.gold === 1) {
                    if(cell.snake > 0){
                        cell.gold = 0;
                        placeApple(); 
                    }
                    cell.element.className = 'gold';
                }
                else {
                    cell.element.className = '';
                }

            }
        }
        // This function calls itself, with a timeout of 1000 milliseconds
        setTimeout(gameLoop, 1000 / (snakeLength/2));
    }

    function placeApple() {
        // A random coordinate for the apple
        var appleX = Math.floor(Math.random() * boardWidth);
        var appleY = Math.floor(Math.random() * boardHeight);
        var rndYellowPoint = Math.floor(Math.random() * 1000);
        if(specalNumbers.some(function(element){
            console.log(rndYellowPoint);
            return element == rndYellowPoint || (rndYellowPoint > 300 && rndYellowPoint < 350);
        })){
            var goldX = Math.floor(Math.random() * boardWidth);
            var goldy = Math.floor(Math.random() * boardHeight);
            board[goldy][goldX].gold = 1;
        }
        board[appleY][appleX].apple = 1;
    }

    $('#left').click(function (e) {
        if(snakeDirection == 'Right'){
            break;
        }
        snakeDirection = 'Left';
    });
    $('#right').click(function (e) {
        if(snakeDirection == 'Left'){
            break;
        }
        snakeDirection = 'Right';
    });
    $('#up').click(function (e) {
        if(snakeDirection == 'Down'){
            return;
        }
        snakeDirection = 'Up';
    });
    $('#down').click(function (e) {
        if(snakeDirection == 'Up'){
            return;
        }
        snakeDirection = 'Down';
    });
    initGame();
    setNumberPlayer();
    setBestScore();
});

function enterKey(event) {
    switch (event.key) {
        case 'ArrowUp':
            if(snakeDirection == 'Down'){
                break;
            }
            snakeDirection = 'Up';
            break;
        case 'ArrowDown':
            if(snakeDirection == 'Up'){
                break;
            }
            snakeDirection = 'Down';
            break;
        case 'ArrowLeft':
            if(snakeDirection == 'Right'){
                break;
            }
            snakeDirection = 'Left';
            break;
        case 'ArrowRight':
            if(snakeDirection == 'Left'){
                break;
            }
            snakeDirection = 'Right';
            break;
        default:
            return;
    }
}