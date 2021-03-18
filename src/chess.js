let EMPTY = -1;
let WHITE = 0;
let BLACK = 8;
let PAWN = 0;
let KNIGHT = 1;
let BISHOP = 2;
let ROOK = 3;
let QUEEN = 4;
let KING = 5;

export default class Board {
    constructor()
    {
        this.board = this.create_board();
        this.historyBoards = [JSON.parse(JSON.stringify(this.board)),JSON.parse(JSON.stringify(this.board)),JSON.parse(JSON.stringify(this.board)),JSON.parse(JSON.stringify(this.board))];
        this.uglyMoveStates = [];
        
        this.current_color = WHITE;
        this.isWhiteCheck = false;
        this.isBlackCheck = false;
        //Überprüft ob und in welche Richtung jeweils weiß und schwarz castlen können
        //Erster Eintrag Weiß, zweiter Schwarz
        //Im Array: Lang rochieren, kurz rochieren
        this.castlePossible = [[true,true],[true,true]];
        //Ob man gerade am Rochieren ist
        this.staleMate = false;
        this.checkMate = false;
        this.moveRepitition = 0;
        this.moveHistoryIndex = -1;
        this.moveHistory = [];
    }
    
    reset()
    {
        this.board = this.create_board();
        this.historyBoards = [JSON.parse(JSON.stringify(this.board)),JSON.parse(JSON.stringify(this.board)),JSON.parse(JSON.stringify(this.board)),JSON.parse(JSON.stringify(this.board))];
        this.uglyMoveStates = [];
        
        this.current_color = WHITE;
        this.isWhiteCheck = false;
        this.isBlackCheck = false;
        //Überprüft ob und in welche Richtung jeweils weiß und schwarz castlen können
        //Erster Eintrag Weiß, zweiter Schwarz
        //Im Array: Lang rochieren, kurz rochieren
        this.castlePossible = [[true,true],[true,true]];
        //Ob man gerade am Rochieren ist
        this.staleMate = false;
        this.checkMate = false;
        this.moveRepitition = 0;
        this.moveHistoryIndex = -1;
        this.moveHistory = [];
    }
    
    getPossibleNodes(depth, state)
    {
        console.log("Started with depth: "+ depth);
        var testBoard = new Board();
        var baseBoard = new Board();
        if(state != null)
        {
            baseBoard.board = JSON.parse(JSON.stringify(state[0]));
            baseBoard.historyBoards = [JSON.parse(JSON.stringify(baseBoard.board)),JSON.parse(JSON.stringify(baseBoard.board)),JSON.parse(JSON.stringify(baseBoard.board)),JSON.parse(JSON.stringify(baseBoard.board))];
            baseBoard.current_color = state[1];
            baseBoard.castlePossible = JSON.parse(JSON.stringify(state[2]));
            baseBoard.calculateChecks();
            
            testBoard.board = JSON.parse(JSON.stringify(state[0]));
            testBoard.historyBoards = [JSON.parse(JSON.stringify(testBoard.board)),JSON.parse(JSON.stringify(testBoard.board)),JSON.parse(JSON.stringify(testBoard.board)),JSON.parse(JSON.stringify(testBoard.board))];
            testBoard.current_color = state[1];
            testBoard.castlePossible = JSON.parse(JSON.stringify(state[2]));
            testBoard.calculateChecks();
            if(testBoard.isCheckMate())
            {
                return 0;
            }
            if(testBoard.staleMate)
            {
                return 0;
            }
        }
        
        if(depth == 0)
        {
            testBoard.printBoard(testBoard.board);
            console.log(testBoard.ugly_moves());
            return 1;
        }
        
        var nodes = 0;
        var possibleMoves = testBoard.ugly_moves();
        console.log(possibleMoves.length);
        for(var i = 0;i<possibleMoves.length;i++)
        {
            if(!testBoard.equals(baseBoard))
            {
                console.log(depth);
            }
            var possible = testBoard.ugly_move(possibleMoves[i]);
            if(!possible)
            {
                console.log(depth);
            }
            if(depth != 0)
            {
                var possibleNodes = this.getPossibleNodesHelper(depth-1, testBoard);
                if(depth >= 4)
                {
                    var col = ["a","b","c","d","e","f","g","h"][possibleMoves[i][1]];
                    console.log("Move: " + col +   (8-possibleMoves[i][0])  + ["a","b","c","d","e","f","g","h"][possibleMoves[i][3]]   + (8-possibleMoves[i][2]) + "  " + possibleMoves[i][4]  + " " + possibleNodes + " nodes");
                }
                nodes += possibleNodes;
            }
            testBoard.undo();
        }
        console.log("Depth: "+ depth + " " + nodes + " nodes");
        return nodes;
    }
    
    equals(boardObject)
    {
        for(var i =0;i<8;i++)
        {
            for(var j=0; j<8;j++)
            {
                if(this.board[i][j] !== boardObject.board[i][j])
                {
                    return false;
                }
            }
        }
        for(var k =0;k<4;k++)
        {
            for(var i =0;i<8;i++)
            {
                for(var j=0; j<8;j++)
                {
                    if(this.historyBoards[k][i][j] !== boardObject.historyBoards[k][i][j])
                    {
                        return false;
                    }
                }
            }
        }
        if(this.castlePossible[0][0] !== boardObject.castlePossible[0][0] || this.castlePossible[0][1] !== boardObject.castlePossible[0][1] ||  this.castlePossible[1][0] !== boardObject.castlePossible[1][0] || this.castlePossible[1][1] !== boardObject.castlePossible[1][1])
        {
            return false;
        }
        return true;
    }
    
    getPossibleNodesHelper(depth, testBoard)
    {
        var nodes = 0;
        var possibleMoves = testBoard.ugly_moves();
        if(depth == 0)
        {
            return 1;
        }
        for(var i = 0;i<possibleMoves.length;i++)
        {
            var possible = testBoard.ugly_move(possibleMoves[i]); 
            if(!possible)
            {
                console.log(depth);
            }
            if(depth != 0)
            {
                var possibleNodes = this.getPossibleNodesHelper(depth-1, testBoard);
                // if(depth == 1)
                // {
                //     var col = ["a","b","c","d","e","f","g","h"][possibleMoves[i][1]];
                //     console.log("Move: " + col +   (8-possibleMoves[i][0])  + ["a","b","c","d","e","f","g","h"][possibleMoves[i][3]]   + (8-possibleMoves[i][2])   + " " + possibleNodes + " nodes");
                // }
                nodes += possibleNodes;
            }
            testBoard.undo();
        }
        return nodes;
    }
    
    printBoard(arr)
    {
        for(var i = 0;i < 8; i++)
        {
            console.log(arr.slice(i*8,i*8+8));
        }
    }
    
    printStatus(move)
    {
        this.printBoard(this.board);
        console.log("Move: " + move);
        console.log("Depth: " + this.uglyMoveStates.length);
        console.log("Current Color: "  + this.current_color)
        console.log("White Check: "  + this.isWhiteCheck)
        console.log("Black Check: "  + this.isBlackCheck)
        console.log("Castle Possible: "  + this.castlePossible);
        console.log("Checkmate: "  + this.checkMate);
        console.log("Stalemate: "  + this.staleMate);
        console.log("Move Repition Count: "  + this.moveRepitition);
        console.log("History Index: "  + this.moveHistoryIndex);
        console.log(this.moveHistory);
    }
    
    arrayColumn = (arr, n) => [arr[n],arr[n+8],arr[n+16],arr[n+24],arr[n+32],arr[n+40],arr[n+48],arr[n+56]];
    
    create_board()
    {
        var board = [];
        board.push(BLACK + ROOK, BLACK + KNIGHT, BLACK + BISHOP, BLACK + QUEEN, BLACK + KING, BLACK + BISHOP, BLACK + KNIGHT, BLACK + ROOK)
        for(var i = 0;i<8;i++)
        {
            board.push(BLACK + PAWN);
        }
        for(var i = 0; i<4;i++)
        {
            board.push(EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY)
        }
        for(var i = 0;i<8;i++)
        {
            board.push(WHITE + PAWN);
        }
        board.push(WHITE + ROOK, WHITE + KNIGHT, WHITE + BISHOP, WHITE + QUEEN, WHITE + KING, WHITE + BISHOP, WHITE + KNIGHT, WHITE + ROOK)

        return board;
    }
    
    movePiece(startRow, startCol, destinationRow, destinationCol, promotionPiece)
    {
        if(this.checkMate === true || this.staleMate === true)
        {
            console.log("Checkmate:" + this.checkMate + " Stalemate: " + this.staleMate);
            return [false,false,false,false];
        }
        var [isPossible,isCastling, isEnPassant, isPromotion] = this.isMovePossible(startRow,startCol,destinationRow,destinationCol);
        console.log([startRow,startCol,destinationRow,destinationCol])
        console.log(isPossible);
        if(isPossible)
        {
            this.addToMoveHistory(startRow, startCol, destinationRow, destinationCol, promotionPiece, isPossible, isCastling, isEnPassant, isPromotion);
            this.historyBoards.push(JSON.parse(JSON.stringify(this.board)));
            this.historyBoards = this.historyBoards.slice(1);
            this.board[destinationRow*8+destinationCol] = this.board[startRow*8+startCol]
            if(this.board[startRow*8+startCol]%8 === KING)
            {
                this.castlePossible[this.current_color/8] = [false,false];
            }
            else if(this.board[startRow*8+startCol]%8 === ROOK)
            {
                this.castlePossible[this.current_color/8][startCol === 7 ? 1 : 0] = false;
            }
            this.board[startRow*8+startCol] = EMPTY;
            //Workaround damit man rochieren kann
            if(isCastling)
            {
                this.castlePossible[this.current_color/8] = [false,false];
                var rookRow = startRow;
                var rookCol = destinationCol === 6 ? 7 : 0;
                var castleCol = rookCol === 7 ? 5 : 3;
                this.board[rookRow*8+castleCol] = this.board[rookRow*8+rookCol]
                this.board[rookRow*8+rookCol] = EMPTY;
            }
            if(isEnPassant)
            {
                var passantRow = startRow;
                var passantCol = destinationCol;
                this.board[passantRow*8+passantCol] = EMPTY;
            }
            if(isPromotion)
            {
                this.promotePiece(destinationCol, this.current_color, promotionPiece);
            }
            this.calculateChecks();
            this.current_color = this.current_color === WHITE ? BLACK : WHITE;
            if(this.isCheckMate())
            {
                this.checkMate = true;
            }
            var boardsAreEqual = true;
            for(var i = 0; i< 8;i++)
            {
                for(var j = 0;j<8;j++)
                {  
                    if(this.historyBoards[0][j*8+i] !== this.board[j*8+i])
                    {
                        boardsAreEqual = false;
                    }
                }
            }
            this.moveRepitition = boardsAreEqual ? this.moveRepitition +1 : 0;
            return [true, isCastling, isEnPassant, isPromotion];
        }
        return [false,false, false, false];
    }
    
    addToMoveHistory(startY, startX, endY, endX, promotionPiece,isPossible, isCastling, isEnPassant, isPromotion)
    {
        if(isPossible)
        {
            if(isCastling)
            {
                if(endX - startX < 0)
                {
                    //Lange Rochade
                    this.moveHistory.push([
                        [startY, startX, endY, endX, this.board[startY*8+startX], EMPTY], 
                        [startY, 0, endY, 3, this.board[startY*8], EMPTY]
                    ]);
                }
                else
                {
                    //Kurze Rochade
                    this.moveHistory.push([
                        [startY, startX, endY, endX,this.board[startY*8+startX], EMPTY], 
                        [startY, 7, endY, 5,this.board[startY*8+7], EMPTY]
                    ]);
                }
            }
            else if(isEnPassant)
            {
                //En Passant
                this.moveHistory.push([
                    [startY, startX, endY, endX, this.board[startY*8+startX], this.board[endY*8+endX]],
                    [startY, endX, startY, endX, EMPTY,this.board[startY*8+endX]]
                    
                ]);
            }
            else if(isPromotion)
            {
                //Promtion
                this.moveHistory.push([
                    
                    [startY, startX, endY, endX, this.board[startY*8+startX], this.board[endY*8+endX]],
                    [endY, endX, endY, endX, promotionPiece+this.current_color, this.board[endY*8+endX] ]
                ]);
            }
            else{
                this.moveHistory.push([[startY, startX, endY, endX, this.board[startY*8+startX], this.board[endY*8+endX]]]);
            }
            this.moveHistoryIndex++;
        }
    }
    
    isInReverse()
    {
        return this.moveHistory.length-1 !== this.moveHistoryIndex;
    }
    
    isValidDestination(row, column)
    {
        return this.board[row*8+column]>>>3 !== this.current_color>>>3;
    }
    
    calculateChecks()
    {
        this.isWhiteCheck = this.isCheck(WHITE, this.board);
        this.isBlackCheck = this.isCheck(BLACK, this.board);
    }
    
    simulateMove(startRow,startCol,destinationRow, destinationCol)
    {
        //Überprüft ob man sich selbst Schach setzt durch den Zug, um illegale Züge zu verhindern
        var simBoard = JSON.parse(JSON.stringify(this.board));
        simBoard[destinationRow*8+destinationCol] = simBoard[startRow*8+startCol]
        simBoard[startRow*8+startCol] = EMPTY;
        return !this.isCheck(this.current_color,simBoard);
    }
    
    isMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        //Überprüft ob der Zug nach allen Schachregeln legal ist
        //Returned [Zug möglich, Rochiert?, enPassant?, Promotion?]
        if(startRow < 0 || startRow > 7 || destinationRow < 0 || destinationRow > 7)
        {
            return [false,false,false,false];
        }
        if(startCol < 0 || startCol > 7 || destinationCol < 0 || destinationCol > 7 )
        {
            return [false,false,false,false];
            
        }
        if(destinationRow === startRow && destinationCol === startCol)
        {
            return [false,false,false,false];
            
        }
        switch(this.board[startRow*8+startCol]%8)
        {
            case PAWN:
            var [isPossible , isEnPassant, isPromotion] =  this.isPawnMovePossible(startRow,startCol,destinationRow,destinationCol);
            if(isPossible)
            {
                return [this.simulateMove(startRow,startCol,destinationRow,destinationCol),false, isEnPassant, isPromotion];
            }
            else{
                return [false,false,false,false];
            }
            case KING:
            var [isPossible, isCastling] = this.isKingMovePossible(startRow,startCol,destinationRow,destinationCol);
            if(isPossible)
            {
                return [this.simulateMove(startRow,startCol,destinationRow,destinationCol), isCastling, false, false];
            }
            else{
                return [false,false,false,false];
            }
            case QUEEN:
            if(this.isQueenMovePossible(startRow,startCol,destinationRow,destinationCol))
            {
                return [this.simulateMove(startRow,startCol,destinationRow,destinationCol), false, false, false];   
            }
            else{
                return [false,false,false,false];
            }
            case ROOK:
            if(this.isRookMovePossible(startRow,startCol,destinationRow,destinationCol))
            {
                return [this.simulateMove(startRow,startCol,destinationRow,destinationCol), false, false, false];
            }
            else{
                return [false,false,false,false];
            }
            
            case KNIGHT:
            if(this.isKnightMovePossible(startRow,startCol,destinationRow,destinationCol)){
                return [this.simulateMove(startRow,startCol,destinationRow,destinationCol), false, false, false];
            }
            else{
                return [false,false,false,false];
            }
            case BISHOP:
            if(this.isBishopMovePossible(startRow,startCol,destinationRow,destinationCol))
            {
                return [this.simulateMove(startRow,startCol,destinationRow,destinationCol), false, false, false];
            }
            else{
                return [false,false,false,false];
            }
            default:
            console.log("Default Case bei Move Possible");
            console.log([startRow, startCol, destinationRow, destinationCol]);
            return [false,false,false,false];
        }
    }
    
    ugly_moves()
    {
        var possibleMoves = [];
        for(var y = 0;y < 8;y++)
        {
            for(var x =0; x<8;x++)
            {
                if(this.board[y*8+x]>>>3 === this.current_color>>>3)
                {
                    this.getPossibleMoves(x,y).forEach((move) => (possibleMoves.push([y,x,move[0],move[1], move[2]])));
                }
            }
        }
        return possibleMoves;
    }
    
    ugly_move(move)
    {
        var [startY, startX, endY, endX, promotionPiece] = move;
        this.uglyMoveStates.push([JSON.parse(JSON.stringify(this.historyBoards[0])),JSON.parse(JSON.stringify(this.castlePossible)), this.moveRepitition]);
        
        var initial = this.movePiece(startY,startX,endY,endX, promotionPiece);
        if(!initial[0])
        {
            console.log(move);
            console.log(this.current_color);
            console.log("Initial: " + initial);
            console.log(this.isMovePossible(startY,startX,endY, endX));
            console.log(this.simulateMove(startY,startX,endY, endX));
            this.printBoard(this.board);
            
        }
        if(initial[3])
        {
            this.promotePiece(endX, (1-this.current_color), QUEEN);
        }
        this.calculateChecks();
        return initial[0];
    }
    
    goBackInHistory()
    {
        if(this.moveHistoryIndex >= 0)
        {
            for(var i = 0; i<this.moveHistory[this.moveHistoryIndex].length;i++)
            {
                this.revertMove(this.moveHistory[this.moveHistoryIndex][i])
            }
            this.calculateChecks();
            this.moveHistoryIndex--;
        }
    }
    
    goForwardInHistory()
    {
        if(this.moveHistoryIndex < this.moveHistory.length -1)
        {
            for(var i = 0; i<this.moveHistory[this.moveHistoryIndex+1].length;i++)
            {
                this.makeMove(this.moveHistory[this.moveHistoryIndex+1][i])
            }
            this.moveHistoryIndex++;
            this.calculateChecks();
        }
    }
    
    undo()
    {
        //Geht zurück und löscht den letzten Zug
        this.historyBoards.unshift(this.uglyMoveStates[this.uglyMoveStates.length-1][0]);
        this.historyBoards = this.historyBoards.slice(0,this.historyBoards.length-1);
        this.castlePossible = this.uglyMoveStates[this.uglyMoveStates.length-1][1];
        this.current_color = this.current_color === WHITE ? BLACK : WHITE;
        this.checkMate = false;
        this.staleMate = false;
        this.moveRepitition = this.uglyMoveStates[this.uglyMoveStates.length-1][2];
        this.goBackInHistory();
        this.moveHistory = this.moveHistory.slice(0, this.moveHistory.length-1);
        this.uglyMoveStates = this.uglyMoveStates.slice(0, this.uglyMoveStates.length-1);
    }
    
    revertMove(move)
    {
        var [startY, startX , endY, endX, piece, pieceBefore] = move;
        this.board[startY*8+startX] = piece;
        this.board[endY*8+endX] = pieceBefore;
    }
    
    makeMove(move)
    {
        var [startY, startX , endY, endX, piece, pieceBefore] = move;
        this.board[startY*8+startX] = EMPTY;
        this.board[endY*8+endX] = piece;
    }
    
    
    promotePiece(column, color, promotionPiece)
    {
        if(promotionPiece === KING || promotionPiece === PAWN )
        {
            return false;
        }
        if(this.board[color*7*8+column]%8 === PAWN)
        {
            this.board[color*7*8+column] = color + promotionPiece;
            return true;
        }
        return false;
    }
    
    getKingPosition(color,board)
    {
        var kingX = -1;
        var kingY = -1;
        for(var i = 0; i<64;i++)
        {
            if(board[Math.floor(i/8)*8+i%8] === color + KING)
            {
                kingX = i%8;
                kingY = Math.floor(i/8);
            }
        }
        return [kingX,kingY]
    }
    
    isCheck(color, board)
    {
        /*
        Überprüft ob der König der jeweiligen Schach gesetzt ist, indem man den König zu einer Art Gottfigur macht und schaut, ob er eine gegnerische Figur
        schlagen mit den eigenen Waffen schlagen könnte.
        Bspw:
        Ob eine Dame in der gleichen Diagonale oder Reihe ist
        Ob ein Turm in der gleichen Reihe oder Spalte ist
        Ob ein Bauer ein Feld von ihm in der Diagonale ist
        Ob ein Läufer in einer ununterbrochenen Diagonale ist
        Ob ein Springer ihn schlagen könnte
        */
        var kingX = -1;
        var kingY = -1;
        //Findet den König der Farbe
        [kingX,kingY] = this.getKingPosition(color,board);
        if(kingX === -1 || kingY === -1)
        {
            return true;
        }
        
        var otherKingX = this.getKingPosition(1-color,board)[0];
        var otherKingY = this.getKingPosition(1-color,board)[1];
        
        if(Math.abs(kingX-otherKingX) <= 1 && Math.abs(kingY-otherKingY) <= 1)
        {
            return true;
        }
        
        //Zeile und Spalte checken
        //Zeile
        var row = board.slice(kingY*8,kingY*8 + 8);
        
        //Rechtsseitig vom König in der Zeile
        for(var i = kingX+1; i<8;i++)
        {
            if(row[i]>>>3 === color>>>3)
            {
                break;
            }
            else if(row[i]%8 === QUEEN || row[i]%8 === ROOK)
            {
                return true;
            }
            else if(row[i] !== EMPTY)
            {
                break;
            }
            
        }
        //Linksseitig vom König in der Zeile
        for(i = kingX-1; i>=0;i--)
        {
            if(row[i]>>> 3 === color>>>3)
            {
                break;
            }
            else if(row[i]%8 === QUEEN || row[i]%8 === ROOK)
            {
                return true;
            }
            else if(row[i] !== EMPTY)
            {
                break;
            }
            
        }
        
        //Spalte
        //Unterhalb vom König in der Spalte
        var column = this.arrayColumn(board,kingX)
        for(i = kingY+1; i<8;i++)
        {
            if(column[i]>>>3 === color>>>3)
            {
                break;
            }
            else if(column[i]%8 === QUEEN || column[i]%8 === ROOK)
            {
                return true;
            }
            else if(column[i] !== EMPTY)
            {
                break;
            }
            
        }
        //Oberhalb vom König in der Spalte
        for( i = kingY-1; i>=0;i--)
        {
            if(column[i]>>>3 === color>>>3)
            {
                break;
            }
            else if(column[i]%8 === QUEEN || column[i]%8 === ROOK)
            {
                return true;
            }
            else if(column[i] !== EMPTY)
            {
                break;
            }
            
        }
        
        //Diagonale checken + Bauern checken
        //Von Links oben nach Rechts unten Diagonale
        //Unterhalb des Köngis
        var counter = 1;
        for(i = kingY * 8+ kingX + 9; i < 64;i += 9)
        {
            if(board[i]>>>3 === color>>>3)
            {
                break;
            }
            else if(board[i]%8 === QUEEN || board[i]%8 === BISHOP)
            {
                return true;
            }
            else if(board[i] === WHITE + PAWN && counter === 1 && color === BLACK)
            {
                return true;
            }
            else if(board[i] !== EMPTY)
            {
                break;
            }
            
            counter++;
        }
        //Oberhalb des Köngis
        counter = 1;
        for( i = kingY*8+kingX-9; i >= 0;i -= 9)
        {
            if(board[i]>>>3 === color>>>3)
            {
                break;
            }
            else if(board[i]%8 === QUEEN || board[i]%8 === BISHOP)
            {
                return true;
            }
            else if(board[i] === BLACK + PAWN && counter === 1  && color === WHITE)
            {
                return true;
            }
            else if(board[i] !== EMPTY)
            {
                break;
            }
            
            counter++;
        }
        //Von Rechts oben nach Links unten Diagonale
        //Unterhalb des Königs
        counter = 1;
        
        for( i = kingY*8+kingX+7; i < 64;i += 7)
        {
            if(board[i]>>>3 === color>>>3)
            {
                break;
            }
            else if(board[i]%8 === QUEEN || board[i]%8 === BISHOP)
            {
                return true;
            }
            else if(board[i] === WHITE + PAWN && counter === 1 && color === BLACK)
            {
                return true;
            }
            else if(board[i] !== EMPTY)
            {
                break;
            }
            counter++;
        }
        //Oberhalb des Köngis
        counter = 1;
        for( i = kingY*8+kingX-7; i >= 0 ;i -= 7)
        {
            if(board[i]>>>3 === color>>>3)
            {
                break;
            }
            else if(board[i]%8 === QUEEN || board[i]%8 === BISHOP)
            {
                return true;
            }
            else if(board[i] === BLACK + PAWN && counter === 1  && color === WHITE)
            {
                return true;
            }
            else if(board[i] !== EMPTY)
            {
                break;
            }
            
            counter++;
        }
        
        //Springer checken
        var knightMoves = this.getInboundKnightMoves(kingX,kingY);
        for( i = 0; i<knightMoves.length;i++)
        {
            var jumpX = knightMoves[i][0] + kingX;
            var jumpY = knightMoves[i][1] + kingY;
            
            if(board[jumpY*8+jumpX]%8 === KNIGHT && board[jumpY*8+jumpX]>>>3 !== color>>>3)
            {
                return true;
            }
        }
        
        return false;
    }
    
    
    isCheckMate()
    {
        //Überprüft, ob die aktuelle Farbe Matt gesetzt ist
        if(this.moveRepitition >= 6)
        {
            this.staleMate = true;
            return false;
        }
        for(var i =0; i<8;i++)
        {
            for(var j =0;j<8;j++)
            {
                if(this.board[i*8+j]>>>3 === this.current_color>>>3)
                {
                    if(this.getPossibleMoves(j,i).length !== 0)
                    {
                        return false;
                    }
                }           
            }
            
            
        }
        
        if(!this.isCheck(this.current_color,this.board))
        {
            this.staleMate = true;
            return false;
        }
        
        return true;
    }
    
    getInboundKnightMoves(x,y)
    {
        var knightPattern = [[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]];
        var possibleMoves = [];
        for(var i=0;i<knightPattern.length;i++)
        {
            if(x+knightPattern[i][0] < 8 && x+knightPattern[i][0] >= 0 && y+knightPattern[i][1] < 8  && y+knightPattern[i][1] >= 0)
            {
                possibleMoves.push(knightPattern[i]);
            }
        }
        return possibleMoves;
    }
    

    //TODO von hier weiter machen
    isPawnMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        /*
        Es gibt 4 Fälle für den Bauern:
        1 oder 2 nach Vorne
        Schlagen
        En passant
        */
        //Bauer läuft nach vorne
        // colorShift ist dafür da um eine Reihe weiter zu gehen aus Sicht der jeweiligen Farbe also für weiß(=0) -1 und schwarz(1) +1
        var colorShiftRow = (-1)**((this.current_color>>>3)+1)
        var promotion = false;
        var enPassant = false;
        //Überprüft ob der ausgewählte Bauer die zu spielende Farbe hat und in die richtige Richtung will
        if(this.board[startRow*8+startCol]>>>3 !== this.current_color>>>3 || Math.abs(destinationRow-startRow) !== (destinationRow-startRow)*colorShiftRow )
        {
            return [false,false,false];
            
        }
        if(startCol === destinationCol)
        {
            var distanceForward = -1*colorShiftRow*(startRow-destinationRow);
            //Läuft ein Feld
            if(this.board[destinationRow*8+destinationCol] === EMPTY && distanceForward === 1)
            {
                if(destinationRow === (this.current_color/8) * 7)
                {
                    promotion = true;
                }
                return [true, enPassant, promotion];
            }
            //Läuft 2 Felder
            if(startRow === 6-(this.current_color/8)*5 && distanceForward === 2)
            {
                if(this.board[destinationRow*8+destinationCol] === EMPTY && this.board[(destinationRow-colorShiftRow)*8+destinationCol] === EMPTY)
                {
                    
                    return [true, enPassant, promotion];
                    
                    
                }
            }
        }
        else
        {
            //Bauer schlägt und soll maximal 1 Feld laufen können
            if(Math.abs(startRow-destinationRow) === 1 && Math.abs(startCol-destinationCol) === 1)
            {
                if(this.board[destinationRow*8+destinationCol]>>>3 !== this.current_color>>>3 && this.board[destinationRow*8+destinationCol] !== EMPTY)
                {
                    if(destinationRow === (this.current_color/8) * 7)
                    {
                        promotion = true;
                    }
                    return [true, enPassant, promotion];
                    
                    
                }
                //Überprüft en passant
                //Ist das Zielfeld leer und es entweder Reihe 2 oder 6
                if(this.board[destinationRow*8+destinationCol] === EMPTY && destinationRow === 5-((BLACK-this.current_color)/8)*3)
                {
                    //Ist ein En Passant Bauer direkt neben dem Bauern
                    if(this.board[(destinationRow+colorShiftRow)*8+destinationCol] === EMPTY && this.board[startRow*8+destinationCol] === PAWN + (BLACK-this.current_color))
                    {
                        //Ist der Bauer neben einem im letzten Zug gesprungen
                        if(this.historyBoards[3][(destinationRow+colorShiftRow)*8+destinationCol] === PAWN + (BLACK-this.current_color))
                        {
                            enPassant = true;
                            return [true, enPassant, promotion];
                        }
                    }
                }
            }
        }
        return [false,false,false];
    }
    
    isKingMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        if(this.board[destinationRow*8+destinationCol]>>>3 === this.current_color>>>3)
        {
            return [false, false];
            
        }
        //Entweder er läuft 1 Feld oder rochiert
        var rowDifference = Math.abs(destinationRow-startRow);
        var colDifference = Math.abs(destinationCol-startCol);
        if(rowDifference > 1)
        {
            return [false, false];
            
        }        
        
        if(colDifference <= 1)
        {
            if(this.board[destinationRow*8+destinationCol] === EMPTY || this.board[destinationRow*8+destinationCol]>>>3 !== this.current_color>>>3 )
            {
                
                return [true, false];
            }
        }
        //Lange oder kurze Rochade überprüfen
        var shortCastle = (colDifference === destinationCol-startCol);
        if(this.castlePossible[this.current_color/8][shortCastle ? 1 : 0])
        {
            if(shortCastle)
            {
                //Kurze Rochade
                if(this.isCheck(this.current_color, this.board))
                {
                    return [false,false];
                }       
                for(var i = 1;i<3;i++)
                {
                    if(this.board[destinationRow*8+startCol+i] !== EMPTY || !this.simulateMove(startRow,startCol,destinationRow,startCol+i))
                    {
                        return [false, false];
                    }
                }
                if(this.board[destinationRow*8+7]%8 !== ROOK  + this.current_color)
                {
                    return [false,false];
                }
                return [true, true];
            }
            //Lange Rochade
            if(this.isCheck(this.current_color, this.board))
            {
                return [false,false];
            } 
            for( i = 1;i<4;i++)
            {
                if(i< 3)
                {
                    if(this.board[destinationRow*8+startCol-i] !== EMPTY || !this.simulateMove(startRow,startCol,destinationRow,startCol-i))
                    {
                        return [false, false];
                        
                    }
                }
                else if(this.board[destinationRow*8+startCol-i] !== EMPTY)
                {
                    return [false,false];
                }
                
            }
            if(this.board[destinationRow*8] !== ROOK + this.current_color)
            {
                return [false,false];
            }
            return [true, true];
            
        }
        
        return [false, false];
        
        
    }
    
    isQueenMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        if(startRow === destinationRow || startCol === destinationCol)
        {
            return this.isRookMovePossible(startRow, startCol, destinationRow, destinationCol);
        }
        else
        {
            return this.isBishopMovePossible(startRow, startCol, destinationRow, destinationCol);
        }
    }
    
    isRookMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        if(this.board[destinationRow*8+destinationCol]>>>3 === this.current_color>>>3)
        {
            return false;
        }
        
        if(startRow === destinationRow)
        {
            var startX = Math.min(startCol,destinationCol);
            var endX = Math.max(startCol,destinationCol);
            for(var i = startX+1; i < endX; i++)
            {
                if(this.board[startRow*8+i] !== EMPTY)
                {
                    return false;
                }
            }
            return true;
        }
        if(startCol === destinationCol)
        {
            var startY = Math.min(startRow,destinationRow);
            var endY = Math.max(startRow,destinationRow);
            for( i = startY+1; i < endY; i++)
            {
                if(this.board[i*8+startCol] !== EMPTY)
                {
                    return false;
                }
            }
            return true;
        }
        
        return false;
    }
    
    isBishopMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        if(Math.abs(startRow-destinationRow) !== Math.abs(startCol-destinationCol))
        {
            return false;
        }
        if(this.board[destinationRow*8+destinationCol]>>>3 === this.current_color>>>3)
        {
            return false;
        }
        //Überprüft ob der obere Punkt weiter links ist als der unterste Punkt und damit ob die Diagonale von links nach rechts verläuft
        if([startCol,destinationCol][[destinationRow,startRow].indexOf(Math.min.apply(Math, [startRow,destinationRow]))] === Math.max(startCol,destinationCol) )
        {
            //Von Links oben nach Rechts unten
            var startX = Math.min(startCol,destinationCol);
            var startY = Math.min(startRow,destinationRow);
            var distance = Math.abs(startRow-destinationRow);
            for(var i = 1; i<distance;i++)
            {
                if(this.board[startY*8+startX+i*7] !== EMPTY)
                {
                    return false;
                }
            }
        }
        else
        {
            //Von Rechts oben nach Links unten
            startX = Math.min(7-startCol,7-destinationCol);
            startY = Math.min(startRow,destinationRow);
            distance = Math.abs(startRow-destinationRow);
            for( i = 1; i < distance ;i++)
            {
                if(this.board[startY*8+startX-7*i] !== EMPTY)
                {
                    
                    return false;
                }
            }
        }
        
        return true;
        
    }
    
    
    isKnightMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        var knightMoves = this.getInboundKnightMoves(startRow,startCol);
        var rowDifference = destinationRow-startRow;
        var colDifference = destinationCol-startCol;
        for(var i = 0; i<knightMoves.length;i++)
        {   
            if(rowDifference === knightMoves[i][0] && colDifference === knightMoves[i][1])
            {
                if(this.board[destinationRow*8+destinationCol]>>>3 !== this.current_color>>>3)
                {
                    return true;
                }
            }
        }
        return false;
    }
    
    getPossibleMoves(startX, startY)
    {
        var colorShift = (-1)**((this.current_color>>>3)+1)
        var piece = this.board[startY*8+startX]%8;
        var possibleMoves = []
        
        switch(piece)
        {
            case PAWN:
            var moves = [[colorShift,0],[colorShift*2,0],[colorShift,-1],[colorShift,1]]
            for(var k = 0; k<moves.length; k++)
            {
                if(this.isMovePossible(startY,startX,startY+moves[k][0],startX+moves[k][1])[0])
                {
                    if(startY+moves[k][0] == 7 ||startY+moves[k][0] == 0 )
                    {
                        possibleMoves.push([startY+moves[k][0],startX+moves[k][1], QUEEN+this.current_color]);
                        possibleMoves.push([startY+moves[k][0],startX+moves[k][1], ROOK+this.current_color]);
                        possibleMoves.push([startY+moves[k][0],startX+moves[k][1], KNIGHT + this.current_color]);
                        possibleMoves.push([startY+moves[k][0],startX+moves[k][1], BISHOP + this.current_color]);
                    }
                    else{
                        possibleMoves.push([startY+moves[k][0],startX+moves[k][1], EMPTY]);
                    }
                }
            }
            break;
            case KING:
            moves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1],[0,-2],[0,2]]
            for( k = 0; k<moves.length; k++)
            {
                if(this.isMovePossible(startY,startX,startY+moves[k][0],startX+moves[k][1])[0])
                {
                    possibleMoves.push([startY+moves[k][0],startX+moves[k][1], EMPTY]);
                }
            }
            break;
            case QUEEN:
            var rookMoves = this.getRookMoves(startX,startY);
            var bishopMoves = this.getBishopMoves(startX,startY);
            
            for(var i = 0;i<rookMoves.length;i++)
            {
                possibleMoves.push([rookMoves[i][0],rookMoves[i][1], rookMoves[i][2], rookMoves[i][3], EMPTY]);
            }
            for(i = 0;i<bishopMoves.length;i++)
            {
                possibleMoves.push([bishopMoves[i][0],bishopMoves[i][1],bishopMoves[i][2],bishopMoves[i][3],EMPTY]);
            }
            
            break;
            case ROOK:
            possibleMoves = this.getRookMoves(startX,startY).map(rookMove => [rookMove[0],rookMove[1], rookMove[2], rookMove[3], EMPTY]);
            break;
            case KNIGHT:
            moves = this.getInboundKnightMoves(startY,startX);
            for( k = 0; k<moves.length ; k++)
            {
                if(this.isMovePossible(startY,startX,startY+moves[k][0],startX+moves[k][1])[0])
                {
                    possibleMoves.push([startY+moves[k][0],startX+moves[k][1], EMPTY]);
                }
            }
            break;
            case BISHOP:
            possibleMoves = this.getBishopMoves(startX,startY).map(bishopMove => [bishopMove[0],bishopMove[1],bishopMove[2],bishopMove[3],EMPTY]);
            break;
            default:
            console.log("Fehler bei Switch für getMoves");
            return null;
        }
        return possibleMoves;
    }
    
    getRookMoves(startX,startY)
    {
        var possibleMoves = [];
        for(var k = 1; k<8;k++)
        {
            if(this.isMovePossible(startY,startX,startY+k,startX)[0])
            {
                possibleMoves.push([startY+k,startX]);
            }
            if(this.isMovePossible(startY,startX,startY-k,startX)[0])
            {
                possibleMoves.push([startY-k,startX]);
            }
            if(this.isMovePossible(startY,startX,startY,startX+k)[0])
            {
                possibleMoves.push([startY,startX+k]);
            }
            if(this.isMovePossible(startY,startX,startY,startX-k)[0])
            {
                possibleMoves.push([startY,startX-k]);
            }
        }
        return possibleMoves;
    }
    
    getBishopMoves(startX,startY)
    {
        var possibleMoves = []
        for(var k = 1; k<8;k++)
        {
            if(this.isMovePossible(startY,startX,startY+k,startX+k)[0])
            {
                possibleMoves.push([startY+k,startX+k]);
            }
            if(this.isMovePossible(startY,startX,startY+k,startX-k)[0])
            {
                possibleMoves.push([startY+k,startX-k]);
            }
            if(this.isMovePossible(startY,startX,startY-k,startX+k)[0])
            {
                possibleMoves.push([startY-k,startX+k]);
            }
            if(this.isMovePossible(startY,startX,startY-k,startX-k)[0])
            {
                possibleMoves.push([startY-k,startX-k]);
            }
        }
        return possibleMoves;
    }
    
}