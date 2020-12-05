import React from 'react';
import ReactDOM from 'react-dom';
import Board from "./chess.js";
import './index.css';



class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      "board" : props.board,
      "movingPiece": false,
      "startingPiece" : "aa"
    };
    this.movePiece = this.movePiece.bind(this);
  }
  
  movePiece(name)
  {
    if(this.state.movingPiece === true)
    {
      var startY = parseInt(this.state.startingPiece.slice(0,1));
      var startX = parseInt(this.state.startingPiece.slice(1,2));
      
      var endY = parseInt(name.slice(0,1));
      var endX = parseInt(name.slice(1,2));
      this.state.board.movePiece(startY,startX,endY,endX)
      this.setState({"movingPiece": false});
      console.log(this.state.board.checkMate);
        this.setState({"startingPiece":"aa"});
        if(this.state.board.checkMate === true)
        {
          console.log("Checkmate!")
          console.log(this.state.board.current_color + "lost");
        }
    }
    else
    {
      var targetY = parseInt(name.slice(0,1));
      var targetX = parseInt(name.slice(1,2));


      if(this.state.board.board[targetY][targetX] !== "  " && parseInt(this.state.board.board[targetY][targetX].slice(1,2)) === this.state.board.current_color)
      {
        this.setState({"movingPiece": true});
        this.setState({"startingPiece":name});
      }
    }
    
  }
  
  render()
  {
    let pieceDictionary = {"  ": null,"p0" : "pawn_white", "b0" : "bishop_white", "n0": "knight_white", "r0" : "rook_white", "q0" : "queen_white", "k0" : "king_white",
    "p1" : "pawn_black", "b1" : "bishop_black", "n1": "knight_black", "r1" : "rook_black", "q1" : "queen_black", "k1" : "king_black"};
    return <div >
<div className="row">
<Square onPress={this.movePiece} name="00"color="black" piece = {pieceDictionary[this.state.board.board[0][0]]}/>
<Square onPress={this.movePiece} name="01"color="white" piece = {pieceDictionary[this.state.board.board[0][1]]}/>
<Square onPress={this.movePiece} name="02"color="black" piece = {pieceDictionary[this.state.board.board[0][2]]}/>
<Square onPress={this.movePiece} name="03"color="white" piece = {pieceDictionary[this.state.board.board[0][3]]}/>
<Square onPress={this.movePiece} name="04"color="black" piece = {pieceDictionary[this.state.board.board[0][4]]}/>
<Square onPress={this.movePiece} name="05"color="white" piece = {pieceDictionary[this.state.board.board[0][5]]}/>
<Square onPress={this.movePiece} name="06"color="black" piece = {pieceDictionary[this.state.board.board[0][6]]}/>
<Square onPress={this.movePiece} name="07"color="white" piece = {pieceDictionary[this.state.board.board[0][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} name="10"color="white" piece = {pieceDictionary[this.state.board.board[1][0]]}/>
<Square onPress={this.movePiece} name="11"color="black" piece = {pieceDictionary[this.state.board.board[1][1]]}/>
<Square onPress={this.movePiece} name="12"color="white" piece = {pieceDictionary[this.state.board.board[1][2]]}/>
<Square onPress={this.movePiece} name="13"color="black" piece = {pieceDictionary[this.state.board.board[1][3]]}/>
<Square onPress={this.movePiece} name="14"color="white" piece = {pieceDictionary[this.state.board.board[1][4]]}/>
<Square onPress={this.movePiece} name="15"color="black" piece = {pieceDictionary[this.state.board.board[1][5]]}/>
<Square onPress={this.movePiece} name="16"color="white" piece = {pieceDictionary[this.state.board.board[1][6]]}/>
<Square onPress={this.movePiece} name="17"color="black" piece = {pieceDictionary[this.state.board.board[1][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} name="20"color="black" piece = {pieceDictionary[this.state.board.board[2][0]]}/>
<Square onPress={this.movePiece} name="21"color="white" piece = {pieceDictionary[this.state.board.board[2][1]]}/>
<Square onPress={this.movePiece} name="22"color="black" piece = {pieceDictionary[this.state.board.board[2][2]]}/>
<Square onPress={this.movePiece} name="23"color="white" piece = {pieceDictionary[this.state.board.board[2][3]]}/>
<Square onPress={this.movePiece} name="24"color="black" piece = {pieceDictionary[this.state.board.board[2][4]]}/>
<Square onPress={this.movePiece} name="25"color="white" piece = {pieceDictionary[this.state.board.board[2][5]]}/>
<Square onPress={this.movePiece} name="26"color="black" piece = {pieceDictionary[this.state.board.board[2][6]]}/>
<Square onPress={this.movePiece} name="27"color="white" piece = {pieceDictionary[this.state.board.board[2][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} name="30"color="white" piece = {pieceDictionary[this.state.board.board[3][0]]}/>
<Square onPress={this.movePiece} name="31"color="black" piece = {pieceDictionary[this.state.board.board[3][1]]}/>
<Square onPress={this.movePiece} name="32"color="white" piece = {pieceDictionary[this.state.board.board[3][2]]}/>
<Square onPress={this.movePiece} name="33"color="black" piece = {pieceDictionary[this.state.board.board[3][3]]}/>
<Square onPress={this.movePiece} name="34"color="white" piece = {pieceDictionary[this.state.board.board[3][4]]}/>
<Square onPress={this.movePiece} name="35"color="black" piece = {pieceDictionary[this.state.board.board[3][5]]}/>
<Square onPress={this.movePiece} name="36"color="white" piece = {pieceDictionary[this.state.board.board[3][6]]}/>
<Square onPress={this.movePiece} name="37"color="black" piece = {pieceDictionary[this.state.board.board[3][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} name="40"color="black" piece = {pieceDictionary[this.state.board.board[4][0]]}/>
<Square onPress={this.movePiece} name="41"color="white" piece = {pieceDictionary[this.state.board.board[4][1]]}/>
<Square onPress={this.movePiece} name="42"color="black" piece = {pieceDictionary[this.state.board.board[4][2]]}/>
<Square onPress={this.movePiece} name="43"color="white" piece = {pieceDictionary[this.state.board.board[4][3]]}/>
<Square onPress={this.movePiece} name="44"color="black" piece = {pieceDictionary[this.state.board.board[4][4]]}/>
<Square onPress={this.movePiece} name="45"color="white" piece = {pieceDictionary[this.state.board.board[4][5]]}/>
<Square onPress={this.movePiece} name="46"color="black" piece = {pieceDictionary[this.state.board.board[4][6]]}/>
<Square onPress={this.movePiece} name="47"color="white" piece = {pieceDictionary[this.state.board.board[4][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} name="50"color="white" piece = {pieceDictionary[this.state.board.board[5][0]]}/>
<Square onPress={this.movePiece} name="51"color="black" piece = {pieceDictionary[this.state.board.board[5][1]]}/>
<Square onPress={this.movePiece} name="52"color="white" piece = {pieceDictionary[this.state.board.board[5][2]]}/>
<Square onPress={this.movePiece} name="53"color="black" piece = {pieceDictionary[this.state.board.board[5][3]]}/>
<Square onPress={this.movePiece} name="54"color="white" piece = {pieceDictionary[this.state.board.board[5][4]]}/>
<Square onPress={this.movePiece} name="55"color="black" piece = {pieceDictionary[this.state.board.board[5][5]]}/>
<Square onPress={this.movePiece} name="56"color="white" piece = {pieceDictionary[this.state.board.board[5][6]]}/>
<Square onPress={this.movePiece} name="57"color="black" piece = {pieceDictionary[this.state.board.board[5][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} name="60"color="black" piece = {pieceDictionary[this.state.board.board[6][0]]}/>
<Square onPress={this.movePiece} name="61"color="white" piece = {pieceDictionary[this.state.board.board[6][1]]}/>
<Square onPress={this.movePiece} name="62"color="black" piece = {pieceDictionary[this.state.board.board[6][2]]}/>
<Square onPress={this.movePiece} name="63"color="white" piece = {pieceDictionary[this.state.board.board[6][3]]}/>
<Square onPress={this.movePiece} name="64"color="black" piece = {pieceDictionary[this.state.board.board[6][4]]}/>
<Square onPress={this.movePiece} name="65"color="white" piece = {pieceDictionary[this.state.board.board[6][5]]}/>
<Square onPress={this.movePiece} name="66"color="black" piece = {pieceDictionary[this.state.board.board[6][6]]}/>
<Square onPress={this.movePiece} name="67"color="white" piece = {pieceDictionary[this.state.board.board[6][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} name="70"color="white" piece = {pieceDictionary[this.state.board.board[7][0]]}/>
<Square onPress={this.movePiece} name="71"color="black" piece = {pieceDictionary[this.state.board.board[7][1]]}/>
<Square onPress={this.movePiece} name="72"color="white" piece = {pieceDictionary[this.state.board.board[7][2]]}/>
<Square onPress={this.movePiece} name="73"color="black" piece = {pieceDictionary[this.state.board.board[7][3]]}/>
<Square onPress={this.movePiece} name="74"color="white" piece = {pieceDictionary[this.state.board.board[7][4]]}/>
<Square onPress={this.movePiece} name="75"color="black" piece = {pieceDictionary[this.state.board.board[7][5]]}/>
<Square onPress={this.movePiece} name="76"color="white" piece = {pieceDictionary[this.state.board.board[7][6]]}/>
<Square onPress={this.movePiece} name="77"color="black" piece = {pieceDictionary[this.state.board.board[7][7]]}/>
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
      </div>
    }
    return <div onClick = {this.handleClick} className={this.props.color}>
    <img className="piece" src= {require('../public/pieces/'+this.props.piece+".png").default} />
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
  