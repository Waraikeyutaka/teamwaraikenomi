var canvasWidth = 360;
var canvasHeight = 600;
var blockSize = 30;
var boardWidth = canvasWidth / blockSize; //ボードの横幅
var boardHeight = canvasHeight / blockSize; //ボードの縦幅
var blockLandingSound = new Audio('audio/blockLanding.mp3');
var lineClearSound = new Audio('audio/lineClear.mp3');
//ブロックの色を指定
var tetrominoColors = [
    // "#00008b", "#4682b4", "#4169e1", "#191970", "#1e90ff", "#6495ed", "#00dfff", "#87cefa", "#afeeee", "#00ced1", "#20b2aa", "#b0e4de", "#87ceeb", "#5f9ea0", "#00ffff", "#0000ff"
    "#696969"
];
document.addEventListener('DOMContentLoaded', function () {
    var colorsArrayJson = sessionStorage.getItem('selectedColors');
    if (colorsArrayJson) {
        var colorsArray = JSON.parse(colorsArrayJson);
        if (colorsArray[0]) {
            tetrominoColors.length = 0;
            for (var i = 0; i < colorsArray.length; i++) {
                tetrominoColors.push(colorsArray[i]);
            }
        }
    }
    var gameLevel = sessionStorage.getItem("game");
    if (gameLevel === "easy") {
        tetrominoShapes = eazyTetrominoShapes;
    }
    else if (gameLevel === "hard") {
        tetrominoShapes = hardTetrominoShapes;
    }
    // ゲームを開始
    initializeCanvas();
    initializeGame();
    gameLoop(0); // ゲームループの初回呼び出し
});
//ブロックの形を指定
var eazyTetrominoShapes = [
    [[1], [1], [1], [1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0], [0, 0, 0]],
    [[1, 1, 1], [1, 0, 0], [0, 0, 0]],
    [[1, 1, 1], [0, 0, 1], [0, 0, 0]],
    [[1, 1], [0, 1]],
    [[1], [1]],
    [[1, 0], [0, 1]], // ななめ二個
];
var tetrominoShapes = eazyTetrominoShapes;
var hardTetrominoShapes = [
    [[1], [1], [1], [1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0], [0, 0, 0]],
    [[1, 1, 1], [1, 0, 0], [0, 0, 0]],
    [[1, 1, 1], [0, 0, 1], [0, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [0, 1, 0], [1, 1, 0]],
    [[1, 1], [0, 1]],
    [[1, 1, 1], [1, 0, 0], [1, 1, 1]],
    [[1]],
    [[1], [1]],
    [[1], [1], [1]],
    [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    [[1, 0, 1], [1, 1, 1], [1, 0, 1,]],
    [[1, 0, 1], [0, 1, 0], [1, 0, 1]],
    [[1, 0], [0, 1]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 1]], //階段
];
var canvas;
var ctx;
var board;
var currentTetromino;
var currentColor;
var currentRow;
var currentCol;
var score;
var gameOver;
var blockFallInterval = 600; // ブロックが自動で落ちる間隔 (ミリ秒)
function initializeCanvas() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    if (!ctx) {
        alert("キャンバスがサポートされていません。");
        throw new Error("Canvas not supported");
    }
    // ボードを画面の中央に配置
    canvas.style.margin = "auto";
    canvas.style.display = "block";
}
// ゲームの初期化
function initializeGame() {
    board = Array.from({ length: boardHeight }, function () { return Array(boardWidth).fill(0); });
    generateRandomTetromino();
    score = 0;
    gameOver = false;
}
// テトロミノの形状をランダムに選択
function getRandomTetromino() {
    var randomIndex = Math.floor(Math.random() * tetrominoShapes.length);
    return tetrominoShapes[randomIndex];
}
// テトロミノの色をランダムに選択
function getRandomColor() {
    var randomIndex = Math.floor(Math.random() * tetrominoColors.length);
    return tetrominoColors[randomIndex];
}
// 新しいテトロミノを生成
function generateRandomTetromino() {
    currentTetromino = getRandomTetromino();
    currentColor = getRandomColor();
    currentRow = 0;
    currentCol = Math.floor((boardWidth - currentTetromino[0].length) / 2);
    if (currentTetromino.some(function (row, r) {
        return row.some(function (cell, c) {
            return cell && (board[r + currentRow] && board[r + currentRow][c + currentCol]) !== 0;
        });
    })) {
        gameOver = true;
        showGameOver();
    }
}
// ゲームボードの描画
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ボードの外側の枠を描画
    ctx.lineWidth = 4; // ボーダー線の太さを設定
    ctx.strokeStyle = "#000";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // 縦線を描画
    ctx.lineWidth = 0.5;
    for (var col = 1; col < boardWidth; col++) {
        var x = col * blockSize;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (var row = 0; row < boardHeight; row++) {
        for (var col = 0; col < boardWidth; col++) {
            var cell = board[row][col];
            if (cell > 0) {
                var x = col * blockSize;
                var y = row * blockSize;
                drawBlock(x, y, tetrominoColors[cell - 1]);
            }
        }
    }
}
// ブロックを描画
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x, y, blockSize, blockSize);
}
// テトロミノを描画
function drawTetromino() {
    for (var row = 0; row < currentTetromino.length; row++) {
        for (var col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
                var x = (currentCol + col) * blockSize;
                var y = (currentRow + row) * blockSize;
                drawBlock(x, y, currentColor);
            }
        }
    }
}
// ゲームオーバー画面の表示
function showGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over", canvas.width / 2 + 50, canvas.height / 2 - 50);
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2 - 20, canvas.height / 2 + 20);
    ctx.font = "24px Arial";
    ctx.fillText("Enterでリトライ", canvas.width / 2 + 80, canvas.height / 2 + 160);
}
// ゲームオーバー条件のチェック
function checkGameOver() {
    for (var col = 0; col < boardWidth; col++) {
        if (board[0][col] !== 0) {
            gameOver = true;
            showGameOver();
            return;
        }
    }
}
// テトロミノの回転
function rotateTetromino() {
    var newTetromino = [];
    var tetrominoSize = currentTetromino.length;
    for (var row = 0; row < tetrominoSize; row++) {
        newTetromino.push([]);
        for (var col = 0; col < tetrominoSize; col++) {
            newTetromino[row][col] = currentTetromino[tetrominoSize - col - 1][row];
        }
    }
    // 回転前に回転可能かどうかをチェック
    if (canRotate(newTetromino, currentRow, currentCol)) {
        currentTetromino = newTetromino;
    }
}
// テトロミノの回転可能かどうかをチェック
function canRotate(tetromino, row, col) {
    for (var r = 0; r < tetromino.length; r++) {
        for (var c = 0; c < tetromino[r].length; c++) {
            if (tetromino[r][c]) {
                var boardRow = row + r;
                var boardCol = col + c;
                // ボードの境界外または他のブロックと衝突する場合は回転不可
                if (boardRow < 0 ||
                    boardRow >= boardHeight ||
                    boardCol < 0 ||
                    boardCol >= boardWidth ||
                    board[boardRow] &&
                        (board[boardRow][boardCol] !== 0)) {
                    return false;
                }
            }
        }
    }
    return true;
}
// スコアの表示
function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "24px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";
    ctx.textAlign = "right"; // 右寄せに設定
    ctx.fillText("Score: " + score, canvasWidth - 20, 30);
}
// テトロミノの移動
function moveTetromino(dx, dy) {
    if (!gameOver) {
        if (isValidMove(currentTetromino, currentRow + dy, currentCol + dx)) {
            currentRow += dy;
            currentCol += dx;
        }
    }
}
// テトロミノの落下
function dropTetromino() {
    if (!gameOver) {
        if (isValidMove(currentTetromino, currentRow + 1, currentCol)) {
            currentRow++;
        }
        else {
            placeTetromino();
            generateRandomTetromino();
        }
    }
}
// テトロミノをボードに配置
function placeTetromino() {
    for (var row = 0; row < currentTetromino.length; row++) {
        for (var col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
                var boardRow = row + currentRow;
                var boardCol = col + currentCol;
                board[boardRow][boardCol] = tetrominoColors.indexOf(currentColor) + 1;
            }
        }
    }
    blockLandingSound.play();
    clearLines();
}
// ラインのクリアとスコア計算
function clearLines() {
    for (var row = boardHeight - 1; row >= 0; row--) {
        if (board[row].every(function (cell) { return cell !== 0; })) {
            board.splice(row, 1);
            board.unshift(Array(boardWidth).fill(0));
            score += 100;
            lineClearSound.play();
            if (score % 200 == 0 && score <= 3000) {
                blockFallInterval -= 30;
            }
        }
    }
}
// 移動が有効かどうかをチェック
function isValidMove(tetromino, r, c) {
    for (var row = 0; row < tetromino.length; row++) {
        for (var col = 0; col < tetromino[row].length; col++) {
            if (tetromino[row][col]) {
                var boardRow = r + row;
                var boardCol = c + col;
                if (boardRow < 0 ||
                    boardRow >= boardHeight ||
                    boardCol < 0 ||
                    boardCol >= boardWidth ||
                    board[boardRow][boardCol] !== 0) {
                    return false;
                }
            }
        }
    }
    return true;
}
// ブロックの影を描画
function drawGhostTetromino() {
    var ghostRow = currentRow;
    // ゴーストの位置を計算
    while (isValidMove(currentTetromino, ghostRow + 1, currentCol)) {
        ghostRow++;
    }
    // ゴーストのテトロミノを描画
    for (var row = 0; row < currentTetromino.length; row++) {
        for (var col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
                var x = (currentCol + col) * blockSize;
                var y = (ghostRow + row) * blockSize;
                drawGhostBlock(x, y, "#333");
            }
        }
    }
}
// ゴーストブロックを描画
function drawGhostBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3; // 透明度を設定
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.globalAlpha = 1.0; // 透明度を元に戻す
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x, y, blockSize, blockSize);
}
// ゲームのループ
var lastTime = 0;
function gameLoop(currentTime) {
    if (gameOver) {
        return;
    }
    // 経過時間を計算
    var deltaTime = currentTime - lastTime;
    // 一定の時間が経過したらブロックを自動で落とす
    if (deltaTime >= blockFallInterval) {
        dropTetromino(); // ブロックを自動で落とす
        lastTime = currentTime;
    }
    // ゲームボードの描画
    drawBoard();
    // テトロミノの描画
    drawTetromino();
    // スコアの表示
    drawScore();
    // ゴーストテトロミノの描画
    drawGhostTetromino();
    // ゲームオーバー条件のチェック
    checkGameOver();
    // ゲームループを再帰呼び出し
    requestAnimationFrame(gameLoop);
}
// キーボード入力の処理
document.addEventListener("keydown", function (e) {
    if (!gameOver) {
        if (e.key === "ArrowLeft") {
            moveTetromino(-1, 0); // 左に移動
        }
        else if (e.key === "ArrowRight") {
            moveTetromino(1, 0); // 右に移動
        }
        else if (e.key === "ArrowDown") {
            dropTetromino(); // 落下
        }
        else if (e.key === "ArrowUp") {
            rotateTetromino(); // 回転
        }
    }
    else {
        if (e.key === 'Enter') {
            if (maxScore < score) {
                maxScore = score;
                scoreElement.innerHTML = "最大スコア: " + maxScore.toString();
            }
            blockFallInterval = 600;
            // ゲームを再初期化
            initializeGame();
            // ゲームオーバーフラグをリセット
            gameOver = false;
            // ゲームループを再開
            requestAnimationFrame(gameLoop);
        }
    }
});
// リトライボタン要素を生成
var retryButton = document.getElementById("retryButton");
//最大スコア
var maxScore = 0;
var scoreElement = document.getElementById("maxScore");
