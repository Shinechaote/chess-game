let EMPTY = "  ";
let WHITE = 0;
let BLACK = 1;

class Board {
    constructor()
    {
        this.board = this.create_board();
        this.lastBoard = JSON.parse(JSON.stringify(this.board));
        
        this.current_color = WHITE;
        this.isWhiteCheck = false;
        this.isBlackCheck = false;
        //Überprüft ob und in welche Richtung jeweils weiß und schwarz castlen können
        //Erster Eintrag Weiß, zweiter Schwarz
        //Im Array: Lang rochieren, kurz rochieren
        this.castlePossible = [[true,true],[true,true]];
        //Ob man gerade am Rochieren ist
        this.castling = false;
        this.enPassant = false;
        this.checkMate = false;
    }
    
    printBoard(arr)
    {
        for(var i = 0;i < arr.length; i++)
        {
            console.log(arr[i]);
        }
    }
    
    arrayColumn = (arr, n) => arr.map(x => x[n]);
    
    create_board()
    {
        var board = [];
        board.push(["r1","n1","b1","q1","k1","b1","n1","r1"])
        board.push(["p1","p1","p1","p1","p1","p1","p1","p1"])
        for(var i = 0; i<4;i++)
        {
            board.push([EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY])
        }
        board.push(["p0","p0","p0","p0","p0","p0","p0","p0"]);
        board.push(["r0","n0","b0","q0","k0","b0","n0","r0"])
        return board;
    }
    
    movePiece(startRow, startCol, destinationRow, destinationCol)
    {
        if(this.checkMate == true)
        {
            return false;
        }
        if(this.isMovePosible(startRow,startCol,destinationRow,destinationCol))
        {
            this.lastBoard = JSON.parse(JSON.stringify(this.board));
            this.board[destinationRow][destinationCol] = this.board[startRow][startCol]
            this.board[startRow][startCol] = EMPTY;
            //Workaround damit man rochieren kann
            if(this.castling)
            {
                rookRow = startRow;
                rookCol = destinationCol == 6 ? 7 : 0;
                castleCol = rookCol == 7 ? 5 : 3;
                this.board[rookRow][castleCol] = this.board[rookRow][rookCol]
                this.board[rookRow][rookCol] = EMPTY;
                this.castling = false;
                this.castlePossible[this.current_color] = [false,false];
            }
            if(this.enPassant)
            {
                var passantRow = startRow;
                var passantCol = destinationCol;
                this.board[passantRow][passantCol] = EMPTY;
                this.enPassant = false;
                
            }
            this.isWhiteCheck = this.isCheck(WHITE, this.board);
            this.isBlackCheck = this.isCheck(BLACK, this.board);
            this.current_color = this.current_color == WHITE ? BLACK : WHITE;
            return true;
        }
        return false;
    }
    
    simulateMove(startRow,startCol,destinationRow, destinationCol)
    {
        //Überprüft ob man sich selbst Schach setzt durch den Zug, um illegale Züge zu verhindern
        var simBoard = JSON.parse(JSON.stringify(this.board));
        simBoard[destinationRow][destinationCol] = simBoard[startRow][startCol]
        simBoard[startRow][startCol] = EMPTY;
        return !this.isCheck(this.current_color,simBoard);
    }
    
    isMovePosible(startRow, startCol, destinationRow, destinationCol)
    {
        //Überprüft ob der Zug nach allen Schachregeln legal ist
        if(!(0 <= startRow < 8) || !(0 <= startCol < 8) || !(0 <= destinationRow < 8) || !(0 <= destinationCol < 8) )
        {
            return false;
        }
        if(destinationRow == startRow && destinationCol == startCol)
        {
            return false;
        }
        switch(this.board[startRow][startCol].slice(0,1))
        {
            case "p":
            return (this.isPawnMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            case "k":
            var canMove = (this.isKingMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            if(canMove)
            {
                this.castlePossible[this.current_color] = [false,false];
            }
            return canMove;
            case "q":
            return (this.isQueenMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            
            break;
            case "r":
            return (this.isRookMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            
            break;
            case "n":
            return (this.isKnightMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            case "b":
            return (this.isBishopMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            break;
            default:
            
            console.log("Default Case bei Move Possible");
            return false;
        }
        return false;
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
        for(var i = 0; i<64;i++)
        {
            if(board[Math.floor(i/8)][i%8] == "k" + String(color))
            {
                kingX = i%8;
                kingY = Math.floor(i/8);
            }
        }
        
        //Zeile und Spalte checken
        //Zeile
        var row = board[kingY];
        //Rechtsseitig vom König in der Zeile
        for(var i = kingX+1; i<8;i++)
        {
            
            if(parseInt(row[i].slice(1,2)) == color)
            {
                break;
            }
            else if(row[i].slice(0,1) == "q" || row[i].slice(0,1) == "r")
            {
                return true;
            }
            
        }
        //Linksseitig vom König in der Zeile
        for(var i = kingX-1; i>=0;i--)
        {
            if(parseInt(row[i].slice(1,2)) == color)
            {
                break;
            }
            else if(row[i].slice(0,1) == "q" || row[i].slice(0,1) == "r")
            {
                return true;
            }
            
        }
        
        //Spalte
        //Unterhalb vom König in der Spalte
        var column = this.arrayColumn(board,kingX)
        for(var i = kingY+1; i<8;i++)
        {
            if(parseInt(column[i].slice(1,2)) == color)
            {
                break;
            }
            else if(column[i].slice(0,1) == "q" || column[i].slice(0,1) == "r")
            {
                return true;
            }
            
        }
        //Oberhalb vom König in der Spalte
        for(var i = kingY-1; i>=0;i--)
        {
            if(parseInt(column[i].slice(1,2)) == color)
            {
                break;
            }
            else if(column[i].slice(0,1) == "q" || column[i].slice(0,1) == "r")
            {
                return true;
            }
            
        }
        
        //Diagonale checken + Bauern checken
        var diagonals = this.getDiagonals(kingX,kingY);
        //Von Links oben nach Rechts unten Diagonale
        //Unterhalb des Köngis
        var counter = 1;
        for(var i = Math.min(kingX,kingY)+1; i < diagonals[0].length;i++)
        {
            if(parseInt(diagonals[0][i].slice(1,2)) == color)
            {
                break;
            }
            else if(diagonals[0][i].slice(0,1) == "q" || diagonals[0][i].slice(0,1) == "b")
            {
                return true;
            }
            else if(diagonals[0][i].slice(0,1) == "p" && counter == 1 && color == WHITE)
            {
                return true;
            }
            
            counter++;
        }
        //Oberhalb des Köngis
        counter = 1;
        for(var i = Math.min(kingX,kingY)-1; i >= 0;i--)
        {
            if(parseInt(diagonals[0][i].slice(1,2)) == color)
            {
                break;
            }
            else if(diagonals[0][i].slice(0,1) == "q" || diagonals[0][i].slice(0,1) == "b")
            {
                return true;
            }
            else if(diagonals[0][i].slice(0,1) == "p" && counter == 1  && color == BLACK)
            {
                return true;
            }
            
            counter++;
        }
        //Von Rechts oben nach Links unten Diagonale
        //Unterhalb des Königs
        counter = 1;
        
        for(var i = Math.min(7-kingX,kingY)+1; i < diagonals[1].length;i++)
        {
            if(parseInt(diagonals[1][i].slice(1,2)) == color)
            {
                break;
            }
            else if(diagonals[1][i].slice(0,1) == "q" || diagonals[1][i].slice(0,1) == "b")
            {
                return true;
            }
            else if(diagonals[1][i].slice(0,1) == "p" && counter == 1 && color == WHITE)
            {
                return true;
            }
            
            counter++;
        }
        //Oberhalb des Köngis
        counter = 1;
        for(var i = Math.min(7-kingX,kingY)-1; i >= 0;i--)
        {
            if(parseInt(diagonals[1][i].slice(1,2)) == color)
            {
                break;
            }
            else if(diagonals[1][i].slice(0,1) == "q" || diagonals[1][i].slice(0,1) == "b")
            {
                return true;
            }
            else if(diagonals[1][i].slice(0,1) == "p" && counter == 1  && color == BLACK)
            {
                return true;
            }
            
            counter++;
        }
        
        //Springer checken
        var knightMoves = this.getInboundKnightMoves(kingX,kingY);
        for(var i = 0; i<knightMoves.length;i++)
        {
            var jumpX = knightMoves[i][0] + kingX;
            var jumpY = knightMoves[i][1] + kingY;
            
            if(board[jumpY][jumpX].slice(0,1) == "n" && parseInt(board[jumpY][jumpX].slice(1,2)) != color)
            {
                return true;
            }
        }
        
        return false;
    }
    
    
    isCheckMate()
    {
        //Überprüft, ob die aktuelle Farbe Matt gesetzt ist
        var colorShift = (-1)**(this.current_color+1)
        for(var i =0; i<8;i++)
        {
            for(var j =0;j<8;j++)
            {
                if(parseInt(this.board[i][j].slice(1,2)) == this.current_color)
                {
                    switch(this.board[i][j].slice(0,1))
                    {
                        case "p":
                        //Kann ein Bauer das Matt abwehren
                        moves = [[colorShift,0],[colorShift*2,0],[colorShift,-1],[colorShift,1]]
                        for(var k = 0; k<moves.length; k++)
                        {
                            if(this.isMovePosible(i,j,i+moves[k][0],j+moves[k][1]))
                            {
                                return false;
                            }
                        }
                        break;
                        case "k":
                        moves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]]
                        for(var k = 0; k<moves.length; k++)
                        {
                            if(this.isMovePosible(i,j,i+moves[k][0],j+moves[k][1]))
                            {
                                return false;
                            }
                        }
                        break;
                        case "q":
                        for(var k = 0; k<8;k++)
                        {
                            if(this.isMovePosible(i,j,i+k,j) || this.isMovePosible(i,j,i-k,j) || this.isMovePosible(i,j,i,j+k) || this.isMovePosible(i,j,i,j-k))
                            {
                                return false;
                            }
                            if(this.isMovePosible(i,j,i+k,j+k) || this.isMovePosible(i,j,i+k,j-k) || this.isMovePosible(i,j,i-k,j+k) || this.isMovePosible(i,j,i-k,j-k))
                            {
                                return false;
                            }
                        }
                        break;
                        case "r":
                        for(var k = 0; k<8;k++)
                        {
                            if(this.isMovePosible(i,j,i+k,j) || this.isMovePosible(i,j,i-k,j || this.isMovePosible(i,j,i,j+k) || this.isMovePosible(i,j,i,j-k)))
                            {
                                return false;
                            }
                        }
                        break;
                        case "n":
                        moves = this.getInboundKnightMoves(i,j);
                        for(var k = 0; k<moves.length ; k++)
                        {
                            if(this.isMovePosible(i,j,i+moves[k][0],j+moves[k][1]))
                            {
                                return false;
                            }
                        }
                        break;
                        case "b":
                        for(var k = 0; k<8;k++)
                        {
                            if(this.isMovePosible(i,j,i+k,j+k) || this.isMovePosible(i,j,i+k,j-k) || this.isMovePosible(i,j,i-k,j+k) || this.isMovePosible(i,j,i-k,j-k))
                            {
                                return false;
                            }
                        }
                        break;
                        default:
                        console.log("Fehler bei Switch für checkmate");
                        return true;
                    }
                }           
            }
            
            
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
    
    getDiagonals(x,y)
    {
        var diagonals = [];
        //Von Links oben nach Rechts unten Diagonale
        var curX = x -  Math.min(x,y);
        var curY = y -  Math.min(x,y);
        var firstDiagonal = [];
        while(curX < 8 && curY < 8)
        {
            firstDiagonal.push(this.board[curY][curX])
            curY++;
            curX++;
        }
        diagonals.push(firstDiagonal);
        //Rechts oben nach Links unten
        var curX = x +  Math.min(7-x,y);
        var curY = y -  Math.min(7-x,y);
        var secondDiagonal = [];
        while(curX >= 0 && curY < 8)
        {
            secondDiagonal.push(this.board[curY][curX])
            curY++;
            curX--;
        }
        diagonals.push(secondDiagonal);
        return diagonals;
        
    }
    
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
        var colorShiftRow = (-1)**(this.current_color+1)
        if(parseInt(this.board[startRow][startCol].slice(1,2)) != this.current_color || Math.abs(destinationRow-startRow) != (destinationRow-startRow)*colorShiftRow )
        {
            return false;
        }
        if(startCol == destinationCol)
        {
            var distanceForward = Math.abs(startRow-destinationRow);
            //Läuft ein Feld
            if(this.board[destinationRow][destinationCol] == EMPTY && distanceForward == 1)
            {
                return true;
            }
            //Läuft 2 Felder
            if(startRow == 6-this.current_color*5 && distanceForward == 2)
            {
                if(this.board[destinationRow][destinationCol] == EMPTY && this.board[destinationRow+colorShiftRow][destinationCol+colorShiftRow] == EMPTY)
                {
                    return true;
                }
            }
        }
        else
        {
            //Bauer schlägt und soll maximal 1 Feld laufen können
            if(Math.abs(startRow-destinationRow) == 1 && Math.abs(startCol-destinationCol) == 1)
            {
                if(parseInt(this.board[destinationRow][destinationCol][1]) != this.current_color && this.board[destinationRow][destinationCol] != EMPTY )
                {
                    return true;
                }
                //Überprüft en passant
                //Ist das Zielfeld leer und es entweder Reihe 2 oder 6
                if(this.board[destinationRow][destinationCol] == EMPTY && destinationRow == 6-(1-this.current_color)*4)
                {
                    //Ist ein En Passant Bauer direkt neben dem Bauern
                    if(this.board[destinationRow-colorShiftRow][destinationCol] != EMPTY && parseInt(this.board[destinationRow-colorShiftRow][destinationCol][1]) != this.current_color )
                    {
                        //Ist der Bauer neben einem im letzten Zug gesprungen
                        if(this.lastBoard[destinationRow+colorShiftRow][destinationCol] == "p" + String(1-this.current_color))
                        {
                            this.enPassant = true;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    isKingMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        //Entweder er läuft 1 Feld oder rochiert
        var rowDifference = Math.abs(destinationRow-startRow);
        var colDifference = Math.abs(destinationCol-startCol);
        if(rowDifference > 1)
        {
            return false;
        }        
        
        if(colDifference <= 1)
        {
            if(this.board[destinationRow][destinationCol] == EMPTY || parseInt(this.board[destinationRow][destinationCol].slice(1,2)) != this.current_color )
            {
                
                return true;
            }
        }
        //Lange oder kurze Rochade überprüfen
        var shortCastle = colDifference == destinationCol-startCol
        if(this.castlePossible[this.current_color][shortCastle ? 1 : 0])
        {
            if(shortCastle)
            {
                for(var i = 1;i<3;i++)
                {
                    if(this.board[destinationRow][startCol+i] != EMPTY || !this.simulateMove(startRow,startCol,destinationRow,destinationCol+k))
                    {
                        return false;
                    }
                }
                return true;
            }
            for(var i = 1;i<4;i++)
            {
                if(this.board[destinationRow][startCol-i] != EMPTY || !this.simulateMove(startRow,startCol,destinationRow,destinationCol-k))
                {
                    return false;
                }
            }
            return true;
        }
        
        return false;
        
    }
    
    isQueenMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        if(startRow == destinationRow || startCol == destinationCol)
        {
            return isRookMovePossible(startRow, startCol, destinationRow, destinationCol);
        }
        else
        {
            return this.isBishopMovePossible(startRow, startCol, destinationRow, destinationCol);
        }
    }
    
    isRookMovePossible(startRow, startCol, destinationRow, destinationCol)
    {
        
        if(startRow == destinationRow)
        {
            var row = this.board[startRow];
            var startX = Math.min(startCol,destinationCol);
            var endX = Math.min(startCol,destinationCol);
            for(var i = startX; i < endX; i++)
            {
                if(row[i] != EMPTY)
                {
                    return false;
                }
            }
            return true;
        }
        if(startCol == destinationCol)
        {
            var column = this.arrayColumn(this.board, startCol);
            var startY = Math.min(startRow,destinationRow);
            var endY = Math.min(startRow,destinationRow);
            for(var i = startY; i < endY; i++)
            {
                if(column[i] != EMPTY)
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
        var diagonals = this.getDiagonals(startRow,startCol);
        if(Math.abs(startRow-destinationRow) != Math.abs(startCol-destinationCol))
        {
            return false;
        }
        //Überprüft ob der obere Punkt weiter links ist als der unterste Punkt und damit ob die Diagonale von links nach rechts verläuft
        if([startCol,destinationCol][[destinationRow,startRow].indexOf(Math.min.apply(Math, [startRow,destinationRow]))] == Math.max(startCol,destinationCol) )
        {
            //Von Links oben nach Rechts unten
            var startX = Math.min(startCol,destinationCol);
            var startY = Math.min(startRow,destinationRow);
            var distance = Math.abs(startRow-destinationRow);
            for(var i = 1; i<distance;i++)
            {
                if(this.board[startY+i][startX+i] != EMPTY)
                {
                    return false;
                }
            }
        }
        else
        {
            //Von Rechts oben nach Links unten
            var startX = Math.min(7-startCol,7-destinationCol);
            var startY = Math.min(startRow,destinationRow);
            var distance = Math.abs(startRow-destinationRow);
            for(var i = 1; i < distance ;i++)
            {
                if(this.board[startY+i][7-startX-i] != EMPTY)
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
            if(rowDifference == knightMoves[i][0] && colDifference == knightMoves[i][1])
            {
                if(parseInt(this.board[destinationRow][destinationCol].slice(1,2)) != this.current_color)
                {
                    return true;
                }
            }
        }
        return false;
    }
}

function fieldEquals(arr,arr2)
{
    for(var i = 0;i<arr.length;i++)
    {
        for(var j = 0; j < arr[i].length;j++)
        {
            if(arr[i][j] != arr2[i][j])
            {
                return false;
            }
        }
    }
    return true;
}

function equals(arr,arr2)
{
    for(var i = 0; i<arr.length;i++)
    {
        if(arr[i] != arr2[i])
        {
            return false;
        }
    }
    return true;
}

var board = new Board();
var printDebug = [false,false,false,false];
var testBoard = [["r1", "n1", "b1", "q1", "k1", "b1", "n1", "r1"],
["p1", "p1", "p1", "  ", "  ", "  ", "p1", "p1"],
["  ", "  ", "  ", "  ", "p1", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
["p0", "p0", "  ", "p0", "p0", "p0", "p0", "p0"],
["r0", "n0", "b0", "q0", "k0", "b0", "n0", "r0"]]
var moves = [[6,2,4,2],[1,3,3,3],[4,2,3,3],[1,4,3,4],[3,3,2,4],[1,5,2,4]]

//Unit Tests

//Bauer Unit
for(var i = 0; i<moves.length;i++)
{
    if(printDebug[0])
    {
        board.printBoard(board.board);
        console.log(" ")
    }
    startX = moves[i][0];
    startY = moves[i][1];
    endX = moves[i][2];
    endY = moves[i][3];
    board.movePiece(startX,startY,endX,endY);
}
if(printDebug[0])
{
    board.printBoard(board.board);
    console.log(" ")
}
console.log("Bauer Unit Test: " + String(fieldEquals(board.board,testBoard)));


//Springer Unit
board = new Board();
moves = [[7,1,5,2],[1,3,3,3],[5,2,3,3],[1,0,2,0],[3,3,1,2]]
testBoard = [["r1", "n1", "b1", "q1", "k1", "b1", "n1", "r1"],
["  ", "p1", "n0", "  ", "p1", "p1", "p1", "p1"],
["p1", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
["p0", "p0", "p0", "p0", "p0", "p0", "p0", "p0"],
["r0", "  ", "b0", "q0", "k0", "b0", "n0", "r0"]]
for(var i = 0; i<moves.length;i++)
{
    if(printDebug[1])
    {
        board.printBoard(board.board);
        console.log(" ")
    }
    startX = moves[i][0];
    startY = moves[i][1];
    endX = moves[i][2];
    endY = moves[i][3];
    board.movePiece(startX,startY,endX,endY);
}
if(printDebug[1])
{
    board.printBoard(board.board);
    console.log(" ")
}
console.log("Springer Unit Test: " + String(fieldEquals(board.board,testBoard)));

// Läufer Unit
board = new Board();
moves = [[6,4,5,4],[1,4,3,4],[7,5,3,1],[0,5,4,1],[3,1,2,2],[4,1,5,0],[2,2,5,5],[5,0,2,3],[5,5,2,2]]
testBoard = [["r1", "n1", "b1", "q1", "k1", "  ", "n1", "r1"],
["p1", "p1", "p1", "p1", "  ", "p1", "p1", "p1"],
["  ", "  ", "b0", "b1", "  ", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "p1", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "p0", "  ", "  ", "  "],
["p0", "p0", "p0", "p0", "  ", "p0", "p0", "p0"],
["r0", "n0", "b0", "q0", "k0", "  ", "n0", "r0"]];
for(var i = 0; i<moves.length;i++)
{
    if(printDebug[2])
    {
        board.printBoard(board.board);
        console.log(" ")
    }
    startX = moves[i][0];
    startY = moves[i][1];
    endX = moves[i][2];
    endY = moves[i][3];
    board.movePiece(startX,startY,endX,endY);
}
if(printDebug[2])
{
    board.printBoard(board.board);
    console.log(" ")
}
console.log("L\u00E4ufer Unit Test: " + String(fieldEquals(board.board,testBoard)));

//Schach Unit
board = new Board();
testBoard = [["r1", "n1", "b1", "q1", "  ", "b1", "n1", "r1"],
["p1", "p1", "p1", "  ", "k1", "p1", "p1", "p1"],
["  ", "  ", "  ", "p1", "  ", "  ", "  ", "  "],
["  ", "b0", "  ", "  ", "p1", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "p0", "  ", "  ", "  "],
["  ", "  ", "  ", "  ", "  ", "n0", "  ", "  "],
["p0", "p0", "p0", "p0", "  ", "p0", "p0", "p0"],
["r0", "n0", "b0", "q0", "k0", "  ", "  ", "r0"]]
moves = [[6,4,4,4],[1,4,3,4],[7,6,5,5],[1,3,2,3],[7,5,3,1],[1,0,1,1],[0,4,1,4]];
var moveAcceptionExpected = [true,true,true,true,true,false,true];
var moveAcception = [];
for(var i = 0; i<moves.length;i++)
{
    if(printDebug[3])
    {
        board.printBoard(board.board);
        console.log(" ")
    }
    startX = moves[i][0];
    startY = moves[i][1];
    endX = moves[i][2];
    endY = moves[i][3];
    moveAcception.push(board.movePiece(startX,startY,endX,endY));
}
if(printDebug[3])
{
    board.printBoard(board.board);
    console.log(" ")
}
console.log("Schach Unit Test Feldgleichheit: " + String(fieldEquals(board.board,testBoard)));
console.log("Schach Unit Test Angenommene Z\u00FCge: " + String(equals(moveAcception,moveAcceptionExpected)));




