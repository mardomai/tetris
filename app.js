document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const GRID_SIZE = 30, WIDTH = 10, HEIGHT = 20, COLORS = ['#000', '#00f', '#0f0', '#f00', '#ff0', '#f0f', '#0ff', '#f80'];
    const SHAPES = [[[1, 1, 1, 1]], [[1, 1, 1], [1, 0, 0]], [[1, 1, 1], [0, 0, 1]], [[1, 1], [1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 1, 1], [0, 1, 0]], [[1, 1, 0], [0, 1, 1]]];

    let grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0)), 
    
    piece = randomPiece(), 
    
    x = WIDTH / 2 - 1,
    
    y = 0,
    
    score = 0, 
    
    fallSpeed = 500;

    function randomPiece() {
        let idx = Math.floor(Math.random() * SHAPES.length);
        return { 
            shape: SHAPES[idx].map(r => r.map(c => c * (idx + 1))), 
            color: idx + 1 
        };
    }
 
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        grid.forEach((row, i) => row.forEach((c, j) => c && drawRect(j, i, COLORS[c])));
     
        piece.shape.forEach((r, i) => r.forEach((c, j) => c && drawRect(x + j, y + i, COLORS[c])));
        
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 20);
    }

    function drawRect(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }

    function collide(dx = 0, dy = 0) {
        return piece.shape.some((r, i) => r.some((c, j) => c && (x + j + dx < 0 || x + j + dx >= WIDTH || y + i + dy >= HEIGHT || grid[y + i + dy]?.[x + j + dx])));
    }

    function merge() {
        piece.shape.forEach((r, i) => r.forEach((c, j) => c && (grid[y + i][x + j] = c)));
        removeCompletedLines();
    }

    function removeCompletedLines() {
        for (let row = HEIGHT - 1; row >= 0; row--) {
            if (grid[row].every(c => c !== 0)) {
                grid.splice(row, 1);
                grid.unshift(Array(WIDTH).fill(0));
                score += 10;  
                row++; 
            }
        }
    }

    function rotate() {
        let rotated = piece.shape[0].map((_, i) => piece.shape.map(r => r[i])).reverse();
        if (!collide(0, 0, rotated)) piece.shape = rotated;
    }

    function move(dx = 0, dy = 1) {
        
        if (!collide(dx, 0)) x += dx;

       
        if (!collide(0, dy)) {
            y += dy;
        } else if (dy > 0) { 
            merge();
            piece = randomPiece();
            x = WIDTH / 2 - 1;
            y = 0;
            if (collide()) reset(); 
        }
    }

    function reset() {
        grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
        score = 0;
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') move(-1);  
        if (e.key === 'ArrowRight') move(1); 
        if (e.key === 'ArrowDown') move(0, 1);  
        if (e.key === 'ArrowUp') rotate();  
        draw();  
    });

    setInterval(() => { move(); draw(); }, fallSpeed);
});
