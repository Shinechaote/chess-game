let EMPTY = "  ";
let WHITE = 0;
let BLACK = 1;

export default class Board {
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
        this.staleMate = false;
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
        if(this.checkMate === true || this.staleMate == true)
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
                this.castlePossible[this.current_color] = [false,false];
                var rookRow = startRow;
                var rookCol = destinationCol === 6 ? 7 : 0;
                var castleCol = rookCol === 7 ? 5 : 3;
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
            this.current_color = this.current_color === WHITE ? BLACK : WHITE;
            if(this.isCheckMate())
            {
                this.checkMate = true;
            }
            
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
        if(startRow < 0 || startRow > 7 || destinationRow < 0 || destinationRow > 7)
        {
            return false;
        }
        if(startCol < 0 || startCol > 7 || destinationCol < 0 || destinationCol > 7 )
        {
            return false;
        }
        if(destinationRow === startRow && destinationCol === startCol)
        {
            return false;
        }
        switch(this.board[startRow][startCol].slice(0,1))
        {
            case "p":
            return (this.isPawnMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            case "k":
            var canMove = (this.isKingMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            console.log(this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            return canMove;
            case "q":
            return (this.isQueenMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            
            case "r":
            return (this.isRookMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            
            case "n":
            return (this.isKnightMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            case "b":
            return (this.isBishopMovePossible(startRow,startCol,destinationRow,destinationCol) && this.simulateMove(startRow,startCol,destinationRow,destinationCol));
            default:
            
            console.log("Default Case bei Move Possible");
            return false;
        }
    }
    
    getKingPosition(color,board)
    {
        var kingX = -1;
        var kingY = -1;
        for(var i = 0; i<64;i++)
        {
            if(board[Math.floor(i/8)][i%8] === "k" + String(color))
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
        //Zeile und Spalte checken
        //Zeile
        var row = board[kingY];
        //Rechtsseitig vom König in der Zeile
        for(var i = kingX+1; i<8;i++)
        {
            if(parseInt(row[i].slice(1,2)) === color)
            {
                break;
            }
            else if(row[i].slice(0,1) === "q" || row[i].slice(0,1) === "r")
            {
                return true;
            }
            else if(row[i] != EMPTY)
            {
                break;
            }
            
        }
        //Linksseitig vom König in der Zeile
        for(var i = kingX-1; i>=0;i--)
        {
            if(parseInt(row[i].slice(1,2)) === color)
            {
                break;
            }
            else if(row[i].slice(0,1) === "q" || row[i].slice(0,1) === "r")
            {
                return true;
            }
            else if(row[i] != EMPTY)
            {
                break;
            }
            
        }
        
        //Spalte
        //Unterhalb vom König in der Spalte
        var column = this.arrayColumn(board,kingX)
        for(var i = kingY+1; i<8;i++)
        {
            if(parseInt(column[i].slice(1,2)) === color)
            {
                break;
            }
            else if(column[i].slice(0,1) === "q" || column[i].slice(0,1) === "r")
            {
                return true;
            }
            else if(column[i] != EMPTY)
            {
                break;
            }
            
        }
        //Oberhalb vom König in der Spalte
        for(var i = kingY-1; i>=0;i--)
        {
            if(parseInt(column[i].slice(1,2)) === color)
            {
                break;
            }
            else if(column[i].slice(0,1) === "q" || column[i].slice(0,1) === "r")
            {
                return true;
            }
            else if(column[i] != EMPTY)
            {
                break;
            }
            
        }
        
        //Diagonale checken + Bauern checken
        var diagonals = this.getDiagonals(kingX,kingY, board);
        //Von Links oben nach Rechts unten Diagonale
        //Unterhalb des Köngis
        var counter = 1;
        for(var i = Math.min(kingX,kingY)+1; i < diagonals[0].length;i++)
        {
            if(parseInt(diagonals[0][i].slice(1,2)) === color)
            {
                break;
            }
            else if(diagonals[0][i].slice(0,1) === "q" || diagonals[0][i].slice(0,1) === "b")
            {
                return true;
            }
            else if(diagonals[0][i].slice(0,1) === "p" && counter === 1 && color === WHITE)
            {
                return true;
            }
            else if(diagonals[0][i] != EMPTY)
            {
                break;
            }
            
            counter++;
        }
        //Oberhalb des Köngis
        counter = 1;
        for(var i = Math.min(kingX,kingY)-1; i >= 0;i--)
        {
            if(parseInt(diagonals[0][i].slice(1,2)) === color)
            {
                break;
            }
            else if(diagonals[0][i].slice(0,1) === "q" || diagonals[0][i].slice(0,1) === "b")
            {
                return true;
            }
            else if(diagonals[0][i].slice(0,1) === "p" && counter === 1  && color === BLACK)
            {
                return true;
            }
            else if(diagonals[0][i] != EMPTY)
            {
                break;
            }
            
            counter++;
        }
        //Von Rechts oben nach Links unten Diagonale
        //Unterhalb des Königs
        counter = 1;
        
        for(var i = Math.min(7-kingX,kingY)+1; i < diagonals[1].length;i++)
        {
            if(parseInt(diagonals[1][i].slice(1,2)) === color)
            {
                break;
            }
            else if(diagonals[1][i].slice(0,1) === "q" || diagonals[1][i].slice(0,1) === "b")
            {
                return true;
            }
            else if(diagonals[1][i].slice(0,1) === "p" && counter === 1 && color === BLACK)
            {
                return true;
            }
            else if(diagonals[1][i] != EMPTY)
            {
                break;
            }
            counter++;
        }
        //Oberhalb des Köngis
        counter = 1;
        for(var i = Math.min(7-kingX,kingY)-1; i >= 0;i--)
        {
            if(parseInt(diagonals[1][i].slice(1,2)) === color)
            {
                break;
            }
            else if(diagonals[1][i].slice(0,1) === "q" || diagonals[1][i].slice(0,1) === "b")
            {
                return true;
            }
            else if(diagonals[1][i].slice(0,1) === "p" && counter === 1  && color === WHITE)
            {
                return true;
            }
            else if(diagonals[1][i] != EMPTY)
            {
                break;
            }
            
            counter++;
        }
        
        //Springer checken
        var knightMoves = this.getInboundKnightMoves(kingX,kingY);
        for(var i = 0; i<knightMoves.length;i++)
        {
            var jumpX = knightMoves[i][0] + kingX;
            var jumpY = knightMoves[i][1] + kingY;
            
            if(board[jumpY][jumpX].slice(0,1) === "n" && parseInt(board[jumpY][jumpX].slice(1,2)) !== color)
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
                if(parseInt(this.board[i][j].slice(1,2)) === this.current_color)
                {
                    if(this.getPossibleMoves(j,i).length != 0)
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
    
    getDiagonals(x,y, board)
    {
        var diagonals = [];
        //Von Links oben nach Rechts unten Diagonale
        var curX = x -  Math.min(x,y);
        var curY = y -  Math.min(x,y);
        var firstDiagonal = [];
        while(curX < 8 && curY < 8)
        {
            firstDiagonal.push(board[curY][curX])
            curY++;
            curX++;
        }
        diagonals.push(firstDiagonal);
        //Rechts oben nach Links unten
        curX = x +  Math.min(7-x,y);
        curY = y -  Math.min(7-x,y);
        var secondDiagonal = [];
        while(curX >= 0 && curY < 8)
        {
            secondDiagonal.push(board[curY][curX])
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
        //Überprüft ob der ausgewählte Bauer die zu spielende Farbe hat und in die richtige Richtung will
        if(parseInt(this.board[startRow][startCol].slice(1,2)) !== this.current_color || Math.abs(destinationRow-startRow) !== (destinationRow-startRow)*colorShiftRow )
        {
            return false;
        }
        if(startCol === destinationCol)
        {
            var distanceForward = Math.abs(startRow-destinationRow);
            //Läuft ein Feld
            if(this.board[destinationRow][destinationCol] === EMPTY && distanceForward === 1)
            {
                return true;
            }
            //Läuft 2 Felder
            if(startRow === 6-this.current_color*5 && distanceForward === 2)
            {
                if(this.board[destinationRow][destinationCol] === EMPTY && this.board[destinationRow-colorShiftRow][destinationCol] === EMPTY)
                {
                    return true;
                }
            }
        }
        else
        {
            //Bauer schlägt und soll maximal 1 Feld laufen können
            if(Math.abs(startRow-destinationRow) === 1 && Math.abs(startCol-destinationCol) === 1)
            {
                if(parseInt(this.board[destinationRow][destinationCol][1]) !== this.current_color && this.board[destinationRow][destinationCol] !== EMPTY )
                {
                    return true;
                }
                //Überprüft en passant
                //Ist das Zielfeld leer und es entweder Reihe 2 oder 6
                if(this.board[destinationRow][destinationCol] === EMPTY && destinationRow === 6-(1-this.current_color)*4)
                {
                    //Ist ein En Passant Bauer direkt neben dem Bauern
                    if(this.board[destinationRow-colorShiftRow][destinationCol] !== EMPTY && parseInt(this.board[destinationRow-colorShiftRow][destinationCol][1]) !== this.current_color )
                    {
                        //Ist der Bauer neben einem im letzten Zug gesprungen
                        if(this.lastBoard[destinationRow+colorShiftRow][destinationCol] === "p" + String(1-this.current_color))
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
        if(parseInt(this.board[destinationRow][destinationCol].slice(1,2)) == this.current_color)
        {
            return false;
        }
        //Entweder er läuft 1 Feld oder rochiert
        var rowDifference = Math.abs(destinationRow-startRow);
        var colDifference = Math.abs(destinationCol-startCol);
        if(rowDifference > 1)
        {
            return false;
        }        
        
        if(colDifference <= 1)
        {
            if(this.board[destinationRow][destinationCol] === EMPTY || parseInt(this.board[destinationRow][destinationCol].slice(1,2)) !== this.current_color )
            {
                
                return true;
            }
        }
        //Lange oder kurze Rochade überprüfen
        var shortCastle = (colDifference === destinationCol-startCol);
        if(this.castlePossible[this.current_color][shortCastle ? 1 : 0])
        {
            if(shortCastle)
            {
                
                for(var i = 1;i<3;i++)
                {
                    if(this.board[destinationRow][startCol+i] !== EMPTY || !this.simulateMove(startRow,startCol,destinationRow,startCol+i))
                    {
                        console.log(i)
                        console.log(this.board[destinationRow][startCol+i]);
                        this.printBoard(this.board);
                        return false;
                    }
                }
                this.castling = true;
                return true;
            }
            for(var i = 1;i<4;i++)
            {
                if(this.board[destinationRow][startCol-i] !== EMPTY || !this.simulateMove(startRow,startCol,destinationRow,startCol-i))
                {
                    return false;
                }
            }
            this.castling = true;
            return true;
        }
        
        return false;
        
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
        if(parseInt(this.board[destinationRow][destinationCol].slice(1,2)) == this.current_color)
        {
            return false;
        }
        
        if(startRow === destinationRow)
        {
            var row = this.board[startRow];
            var startX = Math.min(startCol,destinationCol);
            var endX = Math.max(startCol,destinationCol);
            for(var i = startX; i < endX; i++)
            {
                if(row[i] !== EMPTY)
                {
                    return false;
                }
            }
            return true;
        }
        if(startCol === destinationCol)
        {
            var column = this.arrayColumn(this.board, startCol);
            var startY = Math.min(startRow,destinationRow);
            var endY = Math.max(startRow,destinationRow);
            for(var i = startY; i < endY; i++)
            {
                if(column[i] !== EMPTY)
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
        if(parseInt(this.board[destinationRow][destinationCol].slice(1,2)) == this.current_color)
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
                if(this.board[startY+i][startX+i] !== EMPTY)
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
            for(var i = 1; i < distance ;i++)
            {
                if(this.board[startY+i][7-startX-i] !== EMPTY)
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
                if(parseInt(this.board[destinationRow][destinationCol].slice(1,2)) !== this.current_color)
                {
                    return true;
                }
            }
        }
        return false;
    }
    
    getPossibleMoves(startX, startY)
    {
        var colorShift = (-1)**(this.current_color+1)
        var piece = this.board[startY][startX].slice(0,1);
        var possibleMoves = []
        
        switch(piece)
        {
            case "p":
            var moves = [[colorShift,0],[colorShift*2,0],[colorShift,-1],[colorShift,1]]
            for(var k = 0; k<moves.length; k++)
            {
                if(this.isMovePosible(startY,startX,startY+moves[k][0],startX+moves[k][1]))
                {
                    possibleMoves.push([startY+moves[k][0],startX+moves[k][1]]);
                }
            }
            break;
            case "k":
            moves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1],[0,-2],[0,2]]
            for(var k = 0; k<moves.length; k++)
            {
                if(this.isMovePosible(startY,startX,startY+moves[k][0],startX+moves[k][1]))
                {
                    possibleMoves.push([startY+moves[k][0],startX+moves[k][1]]);
                }
            }
            break;
            case "q":
                var rookMoves = this.getRookMoves(startX,startY);
                var bishopMoves = this.getBishopMoves(startX,startY);

                for(var i = 0;i<rookMoves.length;i++)
                {
                    possibleMoves.push(rookMoves[i]);
                }
                for(i = 0;i<bishopMoves.length;i++)
                {
                    possibleMoves.push(bishopMoves[i]);
                }
            
            break;
            case "r":
                possibleMoves = this.getRookMoves(startX,startY);
            break;
            case "n":
            moves = this.getInboundKnightMoves(startY,startX);
            for(var k = 0; k<moves.length ; k++)
            {
                if(this.isMovePosible(startY,startX,startY+moves[k][0],startX+moves[k][1]))
                {
                    possibleMoves.push([startY+moves[k][0],startX+moves[k][1]]);
                }
            }
            break;
            case "b":
                possibleMoves = this.getBishopMoves(startX,startY);
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
                if(this.isMovePosible(startY,startX,startY+k,startX))
                {
                    possibleMoves.push([startY+k,startX]);
                }
                if(this.isMovePosible(startY,startX,startY-k,startX))
                {
                    possibleMoves.push([startY-k,startX]);
                }
                if(this.isMovePosible(startY,startX,startY,startX+k))
                {
                    possibleMoves.push([startY,startX+k]);
                }
                if(this.isMovePosible(startY,startX,startY,startX-k))
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
                if(this.isMovePosible(startY,startX,startY+k,startX+k))
                {
                    possibleMoves.push([startY+k,startX+k]);
                }
                if(this.isMovePosible(startY,startX,startY+k,startX-k))
                {
                    possibleMoves.push([startY+k,startX-k]);
                }
                if(this.isMovePosible(startY,startX,startY-k,startX+k))
                {
                    possibleMoves.push([startY-k,startX+k]);
                }
                if(this.isMovePosible(startY,startX,startY-k,startX-k))
                {
                    possibleMoves.push([startY-k,startX-k]);
                }
            }
            return possibleMoves;
    }
    
}