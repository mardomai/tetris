document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisCanvas');
    const context = canvas.getContext('2d');

    const GRID_SIZE = 30;
    const WIDTH = 10;
    const HEIGHT = 20;
    const COLORS = ['#000', '#00f', '#0f0', '#f00', '#f80', '#f0f', '#0ff', '#888'];

    let grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    let currentPiece = generateRandomPiece();
    let currentX = Math.floor(WIDTH / 2) - Math.floor(currentPiece[0].length / 2);
    let currentY = 0;

    const fall_speed = 1;  // Adjust the falling speed

    function generateRandomPiece() {
        const pieces = [
            [[1, 1, 1, 1]],
            [[1, 1, 1], [1]],
            [[1, 1, 1], [0, 0, 1]],
            [[1, 1, 1], [0, 1]],
            [[1, 1], [1, 1]],
        ];
        const randomIndex = Math.floor(Math.random() * pieces.length);
        return pieces[randomIndex];
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the grid
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (grid[y][x]) {
                    context.fillStyle = COLORS[grid[y][x]];
                    context.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
            }
        }

        // Draw the current piece
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x]) {
                    context.fillStyle = COLORS[currentPiece[y][x]];
                    context.fillRect((currentX + x) * GRID_SIZE, (currentY + y) * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
            }
        }
    }

    function collide() {
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x] && (grid[currentY + y] && grid[currentY + y][currentX + x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function mergePiece() {
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x]) {
                    grid[currentY + y][currentX + x] = currentPiece[y][x];
                }
            }
        }
    }

    function rotatePiece() {
        const rotatedPiece = currentPiece[0].map((_, i) => currentPiece.map(row => row[i])).reverse();
        if (!collide(currentX, currentY, rotatedPiece)) {
            currentPiece = rotatedPiece;
        }
    }

    function movePiece(dx, dy) {
        currentX += dx;
        currentY += dy;
        if (collide()) {
            currentX -= dx;
            currentY -= dy;
            if (dy !== 0) {
                mergePiece();
                currentPiece = generateRandomPiece();
                currentX = Math.floor(WIDTH / 2) - Math.floor(currentPiece[0].length / 2);
                currentY = 0;
            }
        }
    }

    function removeCompletedLines() {
        for (let y = HEIGHT - 1; y >= 0; y--) {
            if (grid[y].every(cell => cell !== 0)) {
                grid.splice(y, 1);
                grid.unshift(Array(WIDTH).fill(0));
            }
        }
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowLeft':
                movePiece(-1, 0);
                break;
            case 'ArrowRight':
                movePiece(1, 0);
                break;
            case 'ArrowDown':
                movePiece(0, 1);
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
        }
    }

    document.addEventListener('keydown', handleKeyPress);

    function gameLoop() {
        movePiece(0, 1);

        if (collide()) {
            currentX -= 0;
            currentY -= 1;
            mergePiece();
            currentPiece = generateRandomPiece();
            currentX = Math.floor(WIDTH / 2) - Math.floor(currentPiece[0].length / 2);
            currentY = 0;
        }

        removeCompletedLines();
        draw();
    }

    setInterval(gameLoop, 1000 / fall_speed);
});
