document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisCanvas');
    const context = canvas.getContext('2d');

    const GRID_SIZE = 30;
    const WIDTH = 10;
    const HEIGHT = 20;
    const COLORS = ['#000', '#00f', '#0f0', '#f00', '#ff0', '#f0f', '#0ff', '#f80'];

    const SHAPES = [
        [[1, 1, 1, 1]],                // I
        [[1, 1, 1], [1, 0, 0]],        // J
        [[1, 1, 1], [0, 0, 1]],        // L
        [[1, 1], [1, 1]],              // O
        [[0, 1, 1], [1, 1, 0]],        // S
        [[1, 1, 1], [0, 1, 0]],        // T
        [[1, 1, 0], [0, 1, 1]]         // Z
    ];

    let grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    let currentPiece = generateRandomPiece();
    let currentX = Math.floor(WIDTH / 2) - Math.floor(currentPiece.shape[0].length / 2);
    let currentY = 0;
    let score = 0;

    const fallSpeed = 500;  // Adjust the falling speed in milliseconds

    function generateRandomPiece() {
        const randomIndex = Math.floor(Math.random() * SHAPES.length);
        const shape = SHAPES[randomIndex];
        const color = randomIndex + 1;
        return { shape: shape.map(row => row.map(cell => cell * color)), color };
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the grid
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (grid[y][x]) {
                    context.fillStyle = COLORS[grid[y][x]];
                    context.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                    context.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
            }
        }

        // Draw the current piece
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    context.fillStyle = COLORS[currentPiece.shape[y][x]];
                    context.fillRect((currentX + x) * GRID_SIZE, (currentY + y) * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                    context.strokeRect((currentX + x) * GRID_SIZE, (currentY + y) * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
            }
        }

        // Draw the score
        context.fillStyle = '#fff';
        context.font = '20px Arial';
        context.fillText(`Score: ${score}`, 10, 20);
    }

    function collide(offsetX = 0, offsetY = 0) {
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const newX = currentX + x + offsetX;
                    const newY = currentY + y + offsetY;
                    if (newX < 0 || newX >= WIDTH || newY >= HEIGHT || (newY >= 0 && grid[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function mergePiece() {
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    grid[currentY + y][currentX + x] = currentPiece.shape[y][x];
                }
            }
        }
    }

    function rotatePiece() {
        const rotatedShape = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i])).reverse();
        if (!collide(0, 0, rotatedShape)) {
            currentPiece.shape = rotatedShape;
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
                currentX = Math.floor(WIDTH / 2) - Math.floor(currentPiece.shape[0].length / 2);
                currentY = 0;
                if (collide()) {
                    grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
                    score = 0;  // Reset score on game over
                }
            }
        }
    }

    function removeCompletedLines() {
        for (let y = HEIGHT - 1; y >= 0; y--) {
            if (grid[y].every(cell => cell !== 0)) {
                grid.splice(y, 1);
                grid.unshift(Array(WIDTH).fill(0));
                score += 10;  // Increase score by 10 for each completed line
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
        draw();
    }

    document.addEventListener('keydown', handleKeyPress);

    function gameLoop() {
        movePiece(0, 1);
        removeCompletedLines();
        draw();
    }

    setInterval(gameLoop, fallSpeed);
});
