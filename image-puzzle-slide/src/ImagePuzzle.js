export default class SlidingPuzzle {
    constructor(rows, cols, blank = 1) {
        this.BlankPoint = blank
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        let num = 1 + blank
        if (blank < 0) num = 1
        for (let i = 0; i < rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < cols; j++) {
                if (0 == i && 0 == j) this.grid[i][j] = blank
                else this.grid[i][j] = num++
            }
        }
    }
    // Trả về danh sách các vị trí có thể di chuyển ô trống đến
    getPossibleMoves() {
        let point = this.getPoint()
        let blankI = point[0], blankJ = point[1];
        const moves = [];
        const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // xuống, phải, lên, trái
        for (let [di, dj] of dirs) {
            const ni = blankI + di;
            const nj = blankJ + dj;
            if (0 <= ni && ni < this.rows && 0 <= nj && nj < this.cols) {
                moves.push([ni, nj]);
            }
        }
        return moves;
    }
    getPoint(value = this.BlankPoint) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (value == this.grid[i][j]) {
                    return [i, j]
                }
            }
        }
    }
    // Di chuyển ô trống đến vị trí (targetI, targetJ)
    moveTo(targetI, targetJ) {
        let point = this.getPoint()
        let blankI = point[0], blankJ = point[1];
        // Swap
        [this.grid[blankI][blankJ], this.grid[targetI][targetJ]] = [this.grid[targetI][targetJ], this.grid[blankI][blankJ]];
    }
    // Xáo trộn bằng cách di chuyển ngẫu nhiên numMoves lần
    scramble(numMoves = 21) {
        for (let i = 0; i <= numMoves + 1; i++) {
            const moves = this.getPossibleMoves();
            if (moves.length === 0) continue;
            const [ni, nj] = moves[Math.floor(Math.random() * moves.length)];
            this.moveTo(ni, nj);
        }
        return this.grid
    }
}