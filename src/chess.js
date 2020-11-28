let EMPTY = "  ";
let WHITE = 0;
let BLACK = 1;

class Board {
    constructor()
    {
        this.board = create_board();
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
        this.checkMate = false;
    }
    
    arrayColumn = (arr, n) => arr.map(x => x[n]);
    
    create_board()
    {
        var board = [];
        board.append(["r1","n1","b1","q1","k1","b1","n1","r1"])
        board.append(["p1","p1","p1","p1","p1","p1","p1","p1"])
        for(i = 0; i<4;i++)
        {
            board.append(EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,)
        }
        board.append(["p0","p0","p0","p0","p0","p0","p0","p0"]);
        board.append(["r0","n0","b0","q0","k0","b0","n0","r0"])
    }
    
    movePiece(startRow, startCol, destinationRow, destinatonCol)
    {
        if(this.checkMate)
        {
            return false;
        }
        if(this.isMovePosible(startRow,startCol,destinationRow,destinatonCol))
        {
            this.lastBoard = JSON.parse(JSON.stringify(this.board));
            this.board[destinationRow][destinatonCol] = this.board[startRow][startCol]
            this.board[startRow][startCol] = EMPTY;
            //Workaround damit man rochieren kann
            if(this.castling)
            {
                rookRow = startRow;
                rookCol = destinatonCol == 6 ? 7 : 0;
                castleCol = rookCol == 7 ? 5 : 3;
                this.board[rookRow][castleCol] = this.board[rookRow][rookCol]
                this.board[rookRow][rookCol] = EMPTY;
                this.castling = false;
                this.castlePossible[this.current_color] = [false,false];
            }
            this.isWhiteCheck = isCheck(WHITE, this.board);
            this.isBlackCheck = isCheck(BLACK, this.board);
            this.current_color = this.current_color == WHITE ? BLACK : WHITE;
            return true;
        }
    }
    
    simulateMove(startRow,startCol,destinationRow, destinatonCol)
    {
        //Überprüft ob man sich selbst Schach setzt durch den Zug, um illegale Züge zu verhindern
        var simBoard = JSON.parse(JSON.stringify(this.board));
        simBoard[destinationRow][destinatonCol] = simBoard[startRow][startCol]
        simBoard[startRow][startCol] = EMPTY;
        return !this.isCheck(this.current_color,simBoard);
    }
    
    isMovePosible(startRow, startCol, destinationRow, destinatonCol)
    {
        //Überprüft ob der Zug nach allen Schachregeln legal ist
        switch(this.board[startRow][startCol].slice(0))
        {
            case "p":
            return (this.isPawnMovePossible(startRow,startCol,destinationRow,destinatonCol) && this.simulateMove(startRow,startCol,destinationRow,destinatonCol));
            case "k":
            return (this.isKingMovePossible(startRow,startCol,destinationRow,destinatonCol) && this.simulateMove(startRow,startCol,destinationRow,destinatonCol));
            case "q":
            
            break;
            case "r":
            
            break;
            case "n":
            return (this.isKnightMovePossible(startRow,startCol,destinationRow,destinatonCol) && this.simulateMove(startRow,startCol,destinationRow,destinatonCol));
            case "b":
            
            break;
            default:
            return false;
        }
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
        for(i = 0; i<64;i++)
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
        for(i = kingX+1; i<8;i++)
        {

                if(parseInt(row[i].slice(1)) == color)
                {
                    break;
                }
                else if(row[i].slice(0) == "q" || row[i].slice(0) == "r")
                {
                    return true;
                }
            
        }
        //Linksseitig vom König in der Zeile
        for(i = kingX-1; i>=0;i--)
        {
                if(parseInt(row[i].slice(1)) == color)
                {
                    break;
                }
                else if(row[i].slice(0) == "q" || row[i].slice(0) == "r")
                {
                    return true;
                }
            
        }
        
        //Spalte
        //Unterhalb vom König in der Spalte
        var column = this.arrayColumn(board,kingX)
        for(i = kingY+1; i<8;i++)
        {
                if(parseInt(column[i].slice(1)) == color)
                {
                    break;
                }
                else if(column[i].slice(0) == "q" || column[i].slice(0) == "r")
                {
                    return true;
                }
            
        }
        //Oberhalb vom König in der Spalte
        for(i = kingY-1; i>=0;i--)
        {
                if(parseInt(column[i].slice(1)) == color)
                {
                    break;
                }
                else if(column[i].slice(0) == "q" || column[i].slice(0) == "r")
                {
                    return true;
                }
            
        }
        
        //Diagonale checken + Bauern checken
        var diagonals = getDiagonals(kingX,kingY);
        //Von Links oben nach Rechts unten Diagonale
        //Unterhalb des Köngis
        var counter = 1;
        for(i = min(kingX,kingY)+1; i < 8;i++)
        {
                if(parseInt(diagonals[0][i].slice(1)) == color)
                {
                    break;
                }
                else if(diagonals[0][i].slice(0) == "q" || diagonals[0][i].slice(0) == "b")
                {
                    return true;
                }
                else if(diagonals[0][i].slice(0) == "p" && counter == 1 && color == WHITE)
                {
                    return true;
                }
            
            counter++;
        }
        //Oberhalb des Köngis
        counter = 1;
        for(i = min(kingX,kingY)-1; i >= 0;i--)
        {
                if(parseInt(diagonals[0][i].slice(1)) == color)
                {
                    break;
                }
                else if(diagonals[0][i].slice(0) == "q" || diagonals[0][i].slice(0) == "b")
                {
                    return true;
                }
                else if(diagonals[0][i].slice(0) == "p" && counter == 1  && color == BLACK)
                {
                    return true;
                }
            
            counter++;
        }
        //Von Rechts oben nach Links unten Diagonale
        //Unterhalb des Königs
        counter = 1;
        for(i = min(7-kingX,kingY)+1; i < 8;i++)
        {
                if(parseInt(diagonals[1][i].slice(1)) == color)
                {
                    break;
                }
                else if(diagonals[0][i].slice(0) == "q" || diagonals[0][i].slice(0) == "b")
                {
                    return true;
                }
                else if(diagonals[0][i].slice(0) == "p" && counter == 1 && color == WHITE)
                {
                    return true;
                }
            
            counter++;
        }
        //Oberhalb des Köngis
        counter = 1;
        for(i = min(7-kingX,kingY)-1; i >= 0;i--)
        {
                if(parseInt(diagonals[1][i].slice(1)) == color)
                {
                    break;
                }
                else if(diagonals[0][i].slice(0) == "q" || diagonals[0][i].slice(0) == "b")
                {
                    return true;
                }
                else if(diagonals[0][i].slice(0) == "p" && counter == 1  && color == BLACK)
                {
                    return true;
                }
            
            counter++;
        }
        
        //Springer checken
        var knightMoves = this.getInboundKnightMoves(kingX,kingY);
        for(i = 0; i<knightMoves.length;i++)
        {
            var jumpX = knightMoves[i][0] + kingX;
            var jumpY = knightMoves[i][1] + kingY;
            
            if(board[jumpY][jumpX].slice(0) == "n" && parseInt(board[jumpY][jumpX]) != color)
            {
                return true;
            }
        }
        
        return false;
    }
    
    getInboundKnightMoves(x,y)
    {
        var knightPattern = [[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]];
        var possibleMoves = [];
        for(i=0;i<knightPattern.length;i++)
        {
            if(x+knightPattern[i][0] < 8 && x+knightPattern[i][0] >= 0 && y+knightPattern[i][1] < 8  && y+knightPattern[i][1] >= 0)
            {
                possibleMoves.append(knightPattern[i]);
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
            firstDiagonal.append(this.board[curY][curX])
            curY++;
            curX++;
        }
        diagonals.append(firstDiagonal);
        //Rechts oben nach Links unten
        var curX = x +  Math.min(7-x,y);
        var curY = y -  Math.min(7-x,y);
        var secondDiagonal = [];
        while(curX >= 0 && curY < 8)
        {
            secondDiagonal.append(this.board[curY][curX])
            curY++;
            curX--;
        }
        diagonals.append(secondDiagonal);
        return diagonals;
        
    }
    
    isPawnMovePossible(startRow, startCol, destinationRow, destinatonCol)
    {
        /*
        Es gibt 4 Fälle für den Bauern:
        1 oder 2 nach Vorne
        Schlagen
        En passant
        */
        //Bauer läuft nach vorne
        // colorSihft ist dafür da um eine Reihe weiter zu gehen aus Sicht der jeweiligen Farbe also für weiß(=0) -1 und schwarz(1) +1
        var colorShiftRow = (-1)**(this.current_color+1)
        if(startCol == destinatonCol)
        {
            distanceForward = Math.abs(startRow-destinationRow);
            //Läuft ein Feld
            if(this.board[destinationRow][destinatonCol] == EMPTY && distanceForward == 1)
            {
                return true;
            }
            //Läuft 2 Felder
            if(startRow == 7-this.current_color*6 && distanceForward == 2)
            {
                if(this.board[destinationRow][destinatonCol] == EMPTY && this.board[destinationRow+colorShiftRow][destinatonCol+colorShiftRow] == EMPTY)
                {
                    return true;
                }
            }
        }
        else
        {
            //Bauer schlägt und soll maximal 1 Feld laufen können
            if(Math.abs(startRow-destinationRow) == 1 && Math.abs(startCol-destinatonCol) == 1)
            {
                if(parseInt(this.board[destinationRow][destinatonCol][1]) != this.current_color && this.board[destinationRow][destinatonCol] != EMPTY )
                {
                    return true;
                }
                //Überprüft en passant
                //Ist das Zielfeld leer und es entweder Reihe 2 oder 6
                if(this.board[destinationRow][destinatonCol] == EMPTY && destinationRow == 6-this.current_color*4)
                {
                    //Ist ein En Passant Bauer direkt neben dem Bauern
                    if(this.board[destinationRow-colorShiftRow][destinatonCol] != EMPTY && parseInt(this.board[destinationRow-colorShiftRow][destinatonCol][1]) != this.current_color )
                    {
                        //Ist der Bauer neben einem im letzten Zug gesprungen
                        if(this.lastBoard[destinationRow+colorShiftRow*2][destinatonCol] == "p" + String(1-this.current_color))
                        {
                            return true;
                        }
                    }
                }
            }
        }
    }
    
    isKnightMovePossible(startRow, startCol, destinationRow, destinatonCol)
    {
        var knightMoves = this.getInboundKnightMoves(startRow,startCol);
        var rowDifference = destinationRow-startRow;
        var colDifference = destinationCol-startCol;
        for(i = 0; i<knightMoves.length;i++)
        {   
            if(rowDifference == knightMoves[i][0] && colDifference == knightMoves[i][1])
            {
                if(parseInt(this.board[destinationRow][destinatonCol].slice(1)) != this.current_color)
                {
                    return true;
                }
            }
        }
        return false;
    }
}


var board = Board();