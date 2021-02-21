import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Switch } from 'react-native';
import Board from "./chess.js";
import minimaxRoot from "./chess_ai.js";
import './index.css';

let EMPTY = "  ";

class App extends React.Component {
  constructor(props)
  {
    super(props);
    var colors = [];
    for(var i = 0;i<8;i++)
    {
      for(var j = 0;j<8;j++)
      {
        colors.push((i+j) % 2 === 0 ? "black" : "white");
      }
    }
    
    var pieceBackgroundColors = [];
    for(i = 0;i<8;i++)
    {
      for(j = 0;j<8;j++)
      {
        pieceBackgroundColors.push("");
      }
    }
    
    this.state = {
      "board" : props.board,
      "selectedPiece": false,
      "startingPiece" : "aa",
      "squareColors" : colors,
      "pieceBackgroundColors" : pieceBackgroundColors,
      "whiteIsComputer": false,
      "blackIsComputer": false,
    };
    this.movePiece = this.movePiece.bind(this);
    this.revertMove = this.revertMove.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
  }
  componentDidMount () {
    window.addEventListener('keydown', this.revertMove)
  }
  componentWillUnmount () {
    window.removeEventListener('keydown', this.revertMove)
  }
  
  resetBoard()
  {
    var testState = [];
  //   testState.push([["r1",EMPTY,EMPTY,EMPTY,"k1",EMPTY,EMPTY,"r1"],
  //                   ["p1",EMPTY,"p1","p1","q1","p1","b1",EMPTY],
  //                   ["b1","n1",EMPTY,EMPTY,"p1","n1","p1",EMPTY],
  //                   [EMPTY,EMPTY,EMPTY,"p0","n0",EMPTY,EMPTY,EMPTY],
  //                   [EMPTY,"p1",EMPTY,EMPTY,"p0",EMPTY,EMPTY,EMPTY],
  //                   [EMPTY,EMPTY,"n0",EMPTY,EMPTY,"q0",EMPTY,"p1"],
  //                   ["p0","p0","p0","b0","b0","p0","p0","p0"],
  //                   ["r0",EMPTY,EMPTY,EMPTY,"k0",EMPTY,EMPTY,"r0"]
  // ]);
  testState.push([["n1",EMPTY,"n1",EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
                    ["p0","p0","p0","k1",EMPTY,EMPTY,EMPTY,EMPTY],
                    [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
                    [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
                    [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
                    [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
                    [EMPTY,EMPTY,EMPTY,EMPTY,"k0","p1","p1","p1"],
                    [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,"n0",EMPTY,"n0"]
  ]);
  testState.push(1);
  testState.push([[true,true],[true,true]]);
    this.state.board.getPossibleNodes(1,testState);  
    this.state.board.getPossibleNodes(2,testState);  
    this.state.board.getPossibleNodes(3,testState);  
    this.state.board.getPossibleNodes(4,testState);  
    // this.state.board.getPossibleNodes(4,testState);  
    // this.state.board.reset();
    // this.calculateBackground();
  }
  
  Sleep(milliseconds)
  {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  
  computerMove()
  {
    if(!this.state.board.checkMate && !this.state.board.staleMate)
    {
      var [startY, startX, endY, endX] = minimaxRoot(3, this.state.board, true);
      this.state.board.movePiece(startY,startX,endY,endX, "q");  
      this.calculateBackground();
    }
  }
  
  movePiece(name)
  {
    if(!this.state.whiteIsComputer)
    {
      this.movePieceHuman(name);
      if(this.state.blackIsComputer && this.state.selectedPiece)
      {
        this.computerMove();
      }
    }
  }

  movePieceHuman(name)
  {
    if(!this.state.board.isInReverse())
    {
      if(this.state.selectedPiece === true && !this.state.board.checkMate && !this.state.board.staleMate)
      {
        //Wenn Figur ausgewählt wurde
        var startY = parseInt(this.state.startingPiece.slice(0,1));
        var startX = parseInt(this.state.startingPiece.slice(1,2));
        
        var endY = parseInt(name.slice(0,1));
        var endX = parseInt(name.slice(1,2));
        if(this.state.board.isValidDestination(endY, endX))
        { 
          //Bewegt die Figur
          
          
          var [isPossible, isCastling, isEnPassant, isPromotion] = this.state.board.movePiece(startY,startX,endY,endX, "q");
          
          for(var i =0;i<this.state.pieceBackgroundColors.length;i++)
          {
            this.state.pieceBackgroundColors[i] = "";
          }
          if(isPromotion)
          {
            this.state.board.promotePiece(endX, (1-this.state.board.current_color), "q");
            this.state.board.calculateChecks();
          }
          this.setState({"selectedPiece": false});
          this.calculateBackground();
          
          
          if(this.state.board.checkMate === true)
          {
            alert("Checkmate!");
            console.log(this.state.board.current_color + " lost!");
          }
          else if(this.state.board.staleMate === true)
          {
            alert("Stalemate!");
            console.log("Draw!");
          }
          
          
        }
        else if(startX !== endX || startY !== endY){
          //Es wurde eine eigene Figur als Ziel ausgewählt
          for(i =0;i<this.state.pieceBackgroundColors.length;i++)
          {
            this.state.pieceBackgroundColors[i] = "";
          }
          this.state.squareColors[startY*8 + startX] = (startX+startY) % 2 === 0 ? "black" : "white";
          this.state.pieceBackgroundColors[startY*8 + startX] = "";
          
          this.setState({"selectedPiece": true});
          this.setState({"startingPiece":name});
          this.state.squareColors[endY*8 + endX] = "selected";
          var possibleMoves = this.state.board.getPossibleMoves(endX,endY);
          for(i = 0; i<possibleMoves.length;i++)
          {
            this.state.pieceBackgroundColors[possibleMoves[i][0]*8 + possibleMoves[i][1]] += " possible-position";
          }
        }
        else{
          //Es wurde das gleiche Feld nochmal ausgewählt
          for(i =0;i<this.state.pieceBackgroundColors.length;i++)
          {
            this.state.pieceBackgroundColors[i] =  this.state.pieceBackgroundColors[i] !== " check" ?  "": " check";
          }
          this.state.squareColors[startY*8 + startX] = (startX+startY) % 2 === 0 ? "black" : "white";
          this.state.pieceBackgroundColors[startY*8 + startX] = this.state.pieceBackgroundColors[startY*8 + startX] !== " check" ?  "": " check";
          this.setState({"selectedPiece": false});
          this.setState({"startingPiece":"aa"});
        }
      }
      else
      {
        //Es wird eine Figur ausgewählt
        var targetY = parseInt(name.slice(0,1));
        var targetX = parseInt(name.slice(1,2));
        
        if(this.state.board.board[targetY][targetX] !== "  " && parseInt(this.state.board.board[targetY][targetX].slice(1,2)) === this.state.board.current_color)
        {
          this.setState({"selectedPiece": true});
          this.setState({"startingPiece":name});
          this.state.squareColors[targetY*8 + targetX] = "selected";
          possibleMoves = this.state.board.getPossibleMoves(targetX,targetY);
          for(i = 0; i<possibleMoves.length;i++)
          {
            this.state.pieceBackgroundColors[possibleMoves[i][0]*8 + possibleMoves[i][1]] += " possible-position";
          }
        }
      }
    }
  }
  
  calculateBackground()
  {
    var pieceBackgroundTemp = []
    for(var i = 0; i<64;i++)
    {
      pieceBackgroundTemp.push("");
    }
    if(this.state.board.isWhiteCheck)
    {
      var [kingX,kingY] = this.state.board.getKingPosition(0, this.state.board.board);
      pieceBackgroundTemp[kingY*8 + kingX] = " check";
      
    }
    if(this.state.board.isBlackCheck)
    {
      [kingX,kingY] = this.state.board.getKingPosition(1, this.state.board.board);
      pieceBackgroundTemp[kingY*8 + kingX] = " check";
    }
    
    var squareColorTemp = [];
    for(i = 0;i < 8 ;i++)
    {
      for (var j = 0; j<8;j++)
      {
        squareColorTemp.push((i+j) % 2 === 0 ? "black" : "white");
      }
    }
    this.setState({"squareColors": squareColorTemp});
    this.setState({"selectedPiece": false});
    this.setState({"startingPiece":"aa"});
    this.setState({"pieceBackgroundColors": pieceBackgroundTemp});
  }
  
  revertMove(event)
  {
    
    if(event.keyCode === 37)
    {
      this.state.board.goBackInHistory();
      this.setState({"selectedPiece": false});
      this.calculateBackground();
    }
    else if(event.keyCode === 39)
    {
      this.state.board.goForwardInHistory();
      this.setState({"selectedPiece": false});
      this.calculateBackground();
    }
    
  }
  
  
  
  render()
  {
    
    let pieceDictionary = {"  ": null,"p0" : "pawn_white", "b0" : "bishop_white", "n0": "knight_white", "r0" : "rook_white", "q0" : "queen_white", "k0" : "king_white",
    "p1" : "pawn_black", "b1" : "bishop_black", "n1": "knight_black", "r1" : "rook_black", "q1" : "queen_black", "k1" : "king_black"};
    return <div className="center-screen">
    <div className="row">
    <Square onPress={this.movePiece} id="00" name="00"pieceColor={this.state.pieceBackgroundColors[0]} color={this.state.squareColors[0]} piece = {pieceDictionary[this.state.board.board[0][0]]}/>
    <Square onPress={this.movePiece} id="01" name="01"pieceColor={this.state.pieceBackgroundColors[1]} color={this.state.squareColors[1]} piece = {pieceDictionary[this.state.board.board[0][1]]}/>
    <Square onPress={this.movePiece} id="02" name="02"pieceColor={this.state.pieceBackgroundColors[2]} color={this.state.squareColors[2]} piece = {pieceDictionary[this.state.board.board[0][2]]}/>
    <Square onPress={this.movePiece} id="03" name="03"pieceColor={this.state.pieceBackgroundColors[3]} color={this.state.squareColors[3]} piece = {pieceDictionary[this.state.board.board[0][3]]}/>
    <Square onPress={this.movePiece} id="04" name="04"pieceColor={this.state.pieceBackgroundColors[4]} color={this.state.squareColors[4]} piece = {pieceDictionary[this.state.board.board[0][4]]}/>
    <Square onPress={this.movePiece} id="05" name="05"pieceColor={this.state.pieceBackgroundColors[5]} color={this.state.squareColors[5]} piece = {pieceDictionary[this.state.board.board[0][5]]}/>
    <Square onPress={this.movePiece} id="06" name="06"pieceColor={this.state.pieceBackgroundColors[6]} color={this.state.squareColors[6]} piece = {pieceDictionary[this.state.board.board[0][6]]}/>
    <Square onPress={this.movePiece} id="07" name="07"pieceColor={this.state.pieceBackgroundColors[7]} color={this.state.squareColors[7]} piece = {pieceDictionary[this.state.board.board[0][7]]}/>
    </div>
    <div className="row">
    <Square onPress={this.movePiece} id="10" name="10"pieceColor={this.state.pieceBackgroundColors[8]} color={this.state.squareColors[8]} piece = {pieceDictionary[this.state.board.board[1][0]]}/>
    <Square onPress={this.movePiece} id="11" name="11"pieceColor={this.state.pieceBackgroundColors[9]} color={this.state.squareColors[9]} piece = {pieceDictionary[this.state.board.board[1][1]]}/>
    <Square onPress={this.movePiece} id="12" name="12"pieceColor={this.state.pieceBackgroundColors[10]} color={this.state.squareColors[10]} piece = {pieceDictionary[this.state.board.board[1][2]]}/>
    <Square onPress={this.movePiece} id="13" name="13"pieceColor={this.state.pieceBackgroundColors[11]} color={this.state.squareColors[11]} piece = {pieceDictionary[this.state.board.board[1][3]]}/>
    <Square onPress={this.movePiece} id="14" name="14"pieceColor={this.state.pieceBackgroundColors[12]} color={this.state.squareColors[12]} piece = {pieceDictionary[this.state.board.board[1][4]]}/>
    <Square onPress={this.movePiece} id="15" name="15"pieceColor={this.state.pieceBackgroundColors[13]} color={this.state.squareColors[13]} piece = {pieceDictionary[this.state.board.board[1][5]]}/>
    <Square onPress={this.movePiece} id="16" name="16"pieceColor={this.state.pieceBackgroundColors[14]} color={this.state.squareColors[14]} piece = {pieceDictionary[this.state.board.board[1][6]]}/>
    <Square onPress={this.movePiece} id="17" name="17"pieceColor={this.state.pieceBackgroundColors[15]} color={this.state.squareColors[15]} piece = {pieceDictionary[this.state.board.board[1][7]]}/>
    </div>
    <div className="row">
    <Square onPress={this.movePiece} id="20" name="20"pieceColor={this.state.pieceBackgroundColors[16]} color={this.state.squareColors[16]} piece = {pieceDictionary[this.state.board.board[2][0]]}/>
    <Square onPress={this.movePiece} id="21" name="21"pieceColor={this.state.pieceBackgroundColors[17]} color={this.state.squareColors[17]} piece = {pieceDictionary[this.state.board.board[2][1]]}/>
    <Square onPress={this.movePiece} id="22" name="22"pieceColor={this.state.pieceBackgroundColors[18]} color={this.state.squareColors[18]} piece = {pieceDictionary[this.state.board.board[2][2]]}/>
    <Square onPress={this.movePiece} id="23" name="23"pieceColor={this.state.pieceBackgroundColors[19]} color={this.state.squareColors[19]} piece = {pieceDictionary[this.state.board.board[2][3]]}/>
    <Square onPress={this.movePiece} id="24" name="24"pieceColor={this.state.pieceBackgroundColors[20]} color={this.state.squareColors[20]} piece = {pieceDictionary[this.state.board.board[2][4]]}/>
    <Square onPress={this.movePiece} id="25" name="25"pieceColor={this.state.pieceBackgroundColors[21]} color={this.state.squareColors[21]} piece = {pieceDictionary[this.state.board.board[2][5]]}/>
    <Square onPress={this.movePiece} id="26" name="26"pieceColor={this.state.pieceBackgroundColors[22]} color={this.state.squareColors[22]} piece = {pieceDictionary[this.state.board.board[2][6]]}/>
    <Square onPress={this.movePiece} id="27" name="27"pieceColor={this.state.pieceBackgroundColors[23]} color={this.state.squareColors[23]} piece = {pieceDictionary[this.state.board.board[2][7]]}/>
    </div>
    <div className="row">
    <Square onPress={this.movePiece} id="30" name="30"pieceColor={this.state.pieceBackgroundColors[24]} color={this.state.squareColors[24]} piece = {pieceDictionary[this.state.board.board[3][0]]}/>
    <Square onPress={this.movePiece} id="31" name="31"pieceColor={this.state.pieceBackgroundColors[25]} color={this.state.squareColors[25]} piece = {pieceDictionary[this.state.board.board[3][1]]}/>
    <Square onPress={this.movePiece} id="32" name="32"pieceColor={this.state.pieceBackgroundColors[26]} color={this.state.squareColors[26]} piece = {pieceDictionary[this.state.board.board[3][2]]}/>
    <Square onPress={this.movePiece} id="33" name="33"pieceColor={this.state.pieceBackgroundColors[27]} color={this.state.squareColors[27]} piece = {pieceDictionary[this.state.board.board[3][3]]}/>
    <Square onPress={this.movePiece} id="34" name="34"pieceColor={this.state.pieceBackgroundColors[28]} color={this.state.squareColors[28]} piece = {pieceDictionary[this.state.board.board[3][4]]}/>
    <Square onPress={this.movePiece} id="35" name="35"pieceColor={this.state.pieceBackgroundColors[29]} color={this.state.squareColors[29]} piece = {pieceDictionary[this.state.board.board[3][5]]}/>
    <Square onPress={this.movePiece} id="36" name="36"pieceColor={this.state.pieceBackgroundColors[30]} color={this.state.squareColors[30]} piece = {pieceDictionary[this.state.board.board[3][6]]}/>
    <Square onPress={this.movePiece} id="37" name="37"pieceColor={this.state.pieceBackgroundColors[31]} color={this.state.squareColors[31]} piece = {pieceDictionary[this.state.board.board[3][7]]}/>
    </div>
    <div className="row">
    <Square onPress={this.movePiece} id="40" name="40"pieceColor={this.state.pieceBackgroundColors[32]} color={this.state.squareColors[32]} piece = {pieceDictionary[this.state.board.board[4][0]]}/>
    <Square onPress={this.movePiece} id="41" name="41"pieceColor={this.state.pieceBackgroundColors[33]} color={this.state.squareColors[33]} piece = {pieceDictionary[this.state.board.board[4][1]]}/>
    <Square onPress={this.movePiece} id="42" name="42"pieceColor={this.state.pieceBackgroundColors[34]} color={this.state.squareColors[34]} piece = {pieceDictionary[this.state.board.board[4][2]]}/>
    <Square onPress={this.movePiece} id="43" name="43"pieceColor={this.state.pieceBackgroundColors[35]} color={this.state.squareColors[35]} piece = {pieceDictionary[this.state.board.board[4][3]]}/>
    <Square onPress={this.movePiece} id="44" name="44"pieceColor={this.state.pieceBackgroundColors[36]} color={this.state.squareColors[36]} piece = {pieceDictionary[this.state.board.board[4][4]]}/>
    <Square onPress={this.movePiece} id="45" name="45"pieceColor={this.state.pieceBackgroundColors[37]} color={this.state.squareColors[37]} piece = {pieceDictionary[this.state.board.board[4][5]]}/>
    <Square onPress={this.movePiece} id="46" name="46"pieceColor={this.state.pieceBackgroundColors[38]} color={this.state.squareColors[38]} piece = {pieceDictionary[this.state.board.board[4][6]]}/>
    <Square onPress={this.movePiece} id="47" name="47"pieceColor={this.state.pieceBackgroundColors[39]} color={this.state.squareColors[39]} piece = {pieceDictionary[this.state.board.board[4][7]]}/>
    </div>
    <div className="row">
    <Square onPress={this.movePiece} id="50" name="50"pieceColor={this.state.pieceBackgroundColors[40]} color={this.state.squareColors[40]} piece = {pieceDictionary[this.state.board.board[5][0]]}/>
    <Square onPress={this.movePiece} id="51" name="51"pieceColor={this.state.pieceBackgroundColors[41]} color={this.state.squareColors[41]} piece = {pieceDictionary[this.state.board.board[5][1]]}/>
    <Square onPress={this.movePiece} id="52" name="52"pieceColor={this.state.pieceBackgroundColors[42]} color={this.state.squareColors[42]} piece = {pieceDictionary[this.state.board.board[5][2]]}/>
    <Square onPress={this.movePiece} id="53" name="53"pieceColor={this.state.pieceBackgroundColors[43]} color={this.state.squareColors[43]} piece = {pieceDictionary[this.state.board.board[5][3]]}/>
    <Square onPress={this.movePiece} id="54" name="54"pieceColor={this.state.pieceBackgroundColors[44]} color={this.state.squareColors[44]} piece = {pieceDictionary[this.state.board.board[5][4]]}/>
    <Square onPress={this.movePiece} id="55" name="55"pieceColor={this.state.pieceBackgroundColors[45]} color={this.state.squareColors[45]} piece = {pieceDictionary[this.state.board.board[5][5]]}/>
    <Square onPress={this.movePiece} id="56" name="56"pieceColor={this.state.pieceBackgroundColors[46]} color={this.state.squareColors[46]} piece = {pieceDictionary[this.state.board.board[5][6]]}/>
    <Square onPress={this.movePiece} id="57" name="57"pieceColor={this.state.pieceBackgroundColors[47]} color={this.state.squareColors[47]} piece = {pieceDictionary[this.state.board.board[5][7]]}/>
    </div>
    <div className="row">
    <Square onPress={this.movePiece} id="60" name="60"pieceColor={this.state.pieceBackgroundColors[48]} color={this.state.squareColors[48]} piece = {pieceDictionary[this.state.board.board[6][0]]}/>
    <Square onPress={this.movePiece} id="61" name="61"pieceColor={this.state.pieceBackgroundColors[49]} color={this.state.squareColors[49]} piece = {pieceDictionary[this.state.board.board[6][1]]}/>
    <Square onPress={this.movePiece} id="62" name="62"pieceColor={this.state.pieceBackgroundColors[50]} color={this.state.squareColors[50]} piece = {pieceDictionary[this.state.board.board[6][2]]}/>
    <Square onPress={this.movePiece} id="63" name="63"pieceColor={this.state.pieceBackgroundColors[51]} color={this.state.squareColors[51]} piece = {pieceDictionary[this.state.board.board[6][3]]}/>
    <Square onPress={this.movePiece} id="64" name="64"pieceColor={this.state.pieceBackgroundColors[52]} color={this.state.squareColors[52]} piece = {pieceDictionary[this.state.board.board[6][4]]}/>
    <Square onPress={this.movePiece} id="65" name="65"pieceColor={this.state.pieceBackgroundColors[53]} color={this.state.squareColors[53]} piece = {pieceDictionary[this.state.board.board[6][5]]}/>
    <Square onPress={this.movePiece} id="66" name="66"pieceColor={this.state.pieceBackgroundColors[54]} color={this.state.squareColors[54]} piece = {pieceDictionary[this.state.board.board[6][6]]}/>
    <Square onPress={this.movePiece} id="67" name="67"pieceColor={this.state.pieceBackgroundColors[55]} color={this.state.squareColors[55]} piece = {pieceDictionary[this.state.board.board[6][7]]}/>
    </div>
    <div className="row">
    <Square onPress={this.movePiece} id="70" name="70"pieceColor={this.state.pieceBackgroundColors[56]} color={this.state.squareColors[56]} piece = {pieceDictionary[this.state.board.board[7][0]]}/>
    <Square onPress={this.movePiece} id="71" name="71"pieceColor={this.state.pieceBackgroundColors[57]} color={this.state.squareColors[57]} piece = {pieceDictionary[this.state.board.board[7][1]]}/>
    <Square onPress={this.movePiece} id="72" name="72"pieceColor={this.state.pieceBackgroundColors[58]} color={this.state.squareColors[58]} piece = {pieceDictionary[this.state.board.board[7][2]]}/>
    <Square onPress={this.movePiece} id="73" name="73"pieceColor={this.state.pieceBackgroundColors[59]} color={this.state.squareColors[59]} piece = {pieceDictionary[this.state.board.board[7][3]]}/>
    <Square onPress={this.movePiece} id="74" name="74"pieceColor={this.state.pieceBackgroundColors[60]} color={this.state.squareColors[60]} piece = {pieceDictionary[this.state.board.board[7][4]]}/>
    <Square onPress={this.movePiece} id="75" name="75"pieceColor={this.state.pieceBackgroundColors[61]} color={this.state.squareColors[61]} piece = {pieceDictionary[this.state.board.board[7][5]]}/>
    <Square onPress={this.movePiece} id="76" name="76"pieceColor={this.state.pieceBackgroundColors[62]} color={this.state.squareColors[62]} piece = {pieceDictionary[this.state.board.board[7][6]]}/>
    <Square onPress={this.movePiece} id="77" name="77"pieceColor={this.state.pieceBackgroundColors[63]} color={this.state.squareColors[63]} piece = {pieceDictionary[this.state.board.board[7][7]]}/>
    </div>
    <div className= "reset-button">
    <Button color="#f00" title = "Reset Board" onPress={this.resetBoard}/>
    </div>
    <div>
    <Switch trackColor={{false: "#0f0", true: "#f00"}} onValueChange={() => (this.setState({"whiteIsComputer": !this.state.whiteIsComputer, "blackIsComputer": false}))} value={this.state.whiteIsComputer}/>
    </div>
    <div>
    <Switch trackColor={{false: "#0f0", true: "#f00"}} onValueChange={() => (this.setState({"blackIsComputer": !this.state.blackIsComputer, "whiteIsComputer": false}))} value={this.state.blackIsComputer}/>
    </div>

    </div>
  }
  
}

class Square extends React.Component{
  constructor(props)
  {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(event)
  {
    
    this.props.onPress(this.props.name);
  }
  
  render(){
    if(this.props.piece == null)
    {
      return <div onClick = {this.handleClick}  className={this.props.color}>
      <div className={this.props.pieceColor}></div>
      </div>
    }
    var pieceClass = "piece " + this.props.pieceColor;
    return <div  onClick = {this.handleClick} className={this.props.color}>
    <img alt={this.props.piece} className={pieceClass} src= {require('../public/pieces/'+this.props.piece+".png").default} />
    </div>
  }
}

var board = new Board();

ReactDOM.render(
  <React.StrictMode>
  <App board = {board}/>
  </React.StrictMode>,
  document.getElementById('root')
  );
  