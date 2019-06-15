const board = [];
const boardWidth = 26, boardHeight = 16;
var snakeX;
var snakeY;
var snakeDirection;
var snakeLength;
var score = 0;
var isPlay = false;

function startGame() {

    for (var y = 0; y < boardHeight; ++y) {
        for (var x = 0; x < boardWidth; ++x) {
            board[y][x].snake = 0;
            board[y][x].apple = 0;
        }
    }

    // Default position for the snake in the middle of the board.
    snakeX = Math.floor(boardWidth / 2);
    snakeY = Math.floor(boardHeight / 2);
    snakeLength = 5;
    snakeDirection = 'Up';
    score  = 0 ;

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
    $(document).keypress(function(e) {
        if(e.which == 32) {
            if(!isPlay)
                gameLoop();
        }
    });
    $('#play').click(function (e) { 
        if(!isPlay)
            gameLoop();
    });
}

function gameLoop() {
    document.getElementById('score').innerText = score.toString();
    isPlay = true;
    switch (snakeDirection) {
        case 'Up':    snakeY--; break;
        case 'Down':  snakeY++; break;
        case 'Left':  snakeX--; break;
        case 'Right': snakeX++; break;
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

    // Update the board at the new snake position
    board[snakeY][snakeX].snake = snakeLength;

    for (var y = 0; y < boardHeight; ++y) {
        for (var x = 0; x < boardWidth; ++x) {
            var cell = board[y][x];
            if (cell.apple === 1) {
                cell.element.className = 'apple';
            }
            else if (cell.snake > 0) {
                cell.element.className = 'snake';
                cell.snake -= 1;
            }
            else {
                cell.element.className = '';
            }
            
        }
    }
    // This function calls itself, with a timeout of 1000 milliseconds
    setTimeout(gameLoop, 1000/snakeLength);
    
}

function enterKey(event){
    switch (event.key) {
        case 'ArrowUp': snakeDirection = 'Up'; break;
        case 'ArrowDown': snakeDirection = 'Down'; break;
        case 'ArrowLeft': snakeDirection = 'Left'; break;
        case 'ArrowRight': snakeDirection = 'Right'; break;
        default: return;
    }
}
function placeApple() {
    // A random coordinate for the apple
    var appleX = Math.floor(Math.random() * boardWidth);
    var appleY = Math.floor(Math.random() * boardHeight);

    board[appleY][appleX].apple = 1;
}

$('#left').click(function (e) { 
    snakeDirection = 'Left';
});
$('#right').click(function (e) { 
    snakeDirection = 'Right';
});
$('#up').click(function (e) { 
    snakeDirection = 'Up';
});
$('#down').click(function (e) { 
    snakeDirection = 'Down';
});
