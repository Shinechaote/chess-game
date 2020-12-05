import React from 'react';
import ReactDOM from 'react-dom';
import Board from "./chess.js";
import './index.css';



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
    this.state = {
      "board" : props.board,
      "movingPiece": false,
      "startingPiece" : "aa",
      "squareColors" : colors
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
      this.state.squareColors[startY*8 + startX] = (startX+startY) % 2 === 0 ? "black" : "white";
      if(this.state.board.checkMate === true)
      {
        alert("Checkmate!");
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
        console.log(String(targetY*10+targetX));
        this.state.squareColors[targetY*8 + targetX] = "selected";
      }
    }
    
  }
  
  render()
  {
    let pieceDictionary = {"  ": null,"p0" : "pawn_white", "b0" : "bishop_white", "n0": "knight_white", "r0" : "rook_white", "q0" : "queen_white", "k0" : "king_white",
    "p1" : "pawn_black", "b1" : "bishop_black", "n1": "knight_black", "r1" : "rook_black", "q1" : "queen_black", "k1" : "king_black"};
    return <div>
<div className="row">
<Square onPress={this.movePiece} id="00" name="00"color={this.state.squareColors[0]} piece = {pieceDictionary[this.state.board.board[0][0]]}/>
<Square onPress={this.movePiece} id="01" name="01"color={this.state.squareColors[1]} piece = {pieceDictionary[this.state.board.board[0][1]]}/>
<Square onPress={this.movePiece} id="02" name="02"color={this.state.squareColors[2]} piece = {pieceDictionary[this.state.board.board[0][2]]}/>
<Square onPress={this.movePiece} id="03" name="03"color={this.state.squareColors[3]} piece = {pieceDictionary[this.state.board.board[0][3]]}/>
<Square onPress={this.movePiece} id="04" name="04"color={this.state.squareColors[4]} piece = {pieceDictionary[this.state.board.board[0][4]]}/>
<Square onPress={this.movePiece} id="05" name="05"color={this.state.squareColors[5]} piece = {pieceDictionary[this.state.board.board[0][5]]}/>
<Square onPress={this.movePiece} id="06" name="06"color={this.state.squareColors[6]} piece = {pieceDictionary[this.state.board.board[0][6]]}/>
<Square onPress={this.movePiece} id="07" name="07"color={this.state.squareColors[7]} piece = {pieceDictionary[this.state.board.board[0][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} id="10" name="10"color={this.state.squareColors[8]} piece = {pieceDictionary[this.state.board.board[1][0]]}/>
<Square onPress={this.movePiece} id="11" name="11"color={this.state.squareColors[9]} piece = {pieceDictionary[this.state.board.board[1][1]]}/>
<Square onPress={this.movePiece} id="12" name="12"color={this.state.squareColors[10]} piece = {pieceDictionary[this.state.board.board[1][2]]}/>
<Square onPress={this.movePiece} id="13" name="13"color={this.state.squareColors[11]} piece = {pieceDictionary[this.state.board.board[1][3]]}/>
<Square onPress={this.movePiece} id="14" name="14"color={this.state.squareColors[12]} piece = {pieceDictionary[this.state.board.board[1][4]]}/>
<Square onPress={this.movePiece} id="15" name="15"color={this.state.squareColors[13]} piece = {pieceDictionary[this.state.board.board[1][5]]}/>
<Square onPress={this.movePiece} id="16" name="16"color={this.state.squareColors[14]} piece = {pieceDictionary[this.state.board.board[1][6]]}/>
<Square onPress={this.movePiece} id="17" name="17"color={this.state.squareColors[15]} piece = {pieceDictionary[this.state.board.board[1][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} id="20" name="20"color={this.state.squareColors[16]} piece = {pieceDictionary[this.state.board.board[2][0]]}/>
<Square onPress={this.movePiece} id="21" name="21"color={this.state.squareColors[17]} piece = {pieceDictionary[this.state.board.board[2][1]]}/>
<Square onPress={this.movePiece} id="22" name="22"color={this.state.squareColors[18]} piece = {pieceDictionary[this.state.board.board[2][2]]}/>
<Square onPress={this.movePiece} id="23" name="23"color={this.state.squareColors[19]} piece = {pieceDictionary[this.state.board.board[2][3]]}/>
<Square onPress={this.movePiece} id="24" name="24"color={this.state.squareColors[20]} piece = {pieceDictionary[this.state.board.board[2][4]]}/>
<Square onPress={this.movePiece} id="25" name="25"color={this.state.squareColors[21]} piece = {pieceDictionary[this.state.board.board[2][5]]}/>
<Square onPress={this.movePiece} id="26" name="26"color={this.state.squareColors[22]} piece = {pieceDictionary[this.state.board.board[2][6]]}/>
<Square onPress={this.movePiece} id="27" name="27"color={this.state.squareColors[23]} piece = {pieceDictionary[this.state.board.board[2][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} id="30" name="30"color={this.state.squareColors[24]} piece = {pieceDictionary[this.state.board.board[3][0]]}/>
<Square onPress={this.movePiece} id="31" name="31"color={this.state.squareColors[25]} piece = {pieceDictionary[this.state.board.board[3][1]]}/>
<Square onPress={this.movePiece} id="32" name="32"color={this.state.squareColors[26]} piece = {pieceDictionary[this.state.board.board[3][2]]}/>
<Square onPress={this.movePiece} id="33" name="33"color={this.state.squareColors[27]} piece = {pieceDictionary[this.state.board.board[3][3]]}/>
<Square onPress={this.movePiece} id="34" name="34"color={this.state.squareColors[28]} piece = {pieceDictionary[this.state.board.board[3][4]]}/>
<Square onPress={this.movePiece} id="35" name="35"color={this.state.squareColors[29]} piece = {pieceDictionary[this.state.board.board[3][5]]}/>
<Square onPress={this.movePiece} id="36" name="36"color={this.state.squareColors[30]} piece = {pieceDictionary[this.state.board.board[3][6]]}/>
<Square onPress={this.movePiece} id="37" name="37"color={this.state.squareColors[31]} piece = {pieceDictionary[this.state.board.board[3][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} id="40" name="40"color={this.state.squareColors[32]} piece = {pieceDictionary[this.state.board.board[4][0]]}/>
<Square onPress={this.movePiece} id="41" name="41"color={this.state.squareColors[33]} piece = {pieceDictionary[this.state.board.board[4][1]]}/>
<Square onPress={this.movePiece} id="42" name="42"color={this.state.squareColors[34]} piece = {pieceDictionary[this.state.board.board[4][2]]}/>
<Square onPress={this.movePiece} id="43" name="43"color={this.state.squareColors[35]} piece = {pieceDictionary[this.state.board.board[4][3]]}/>
<Square onPress={this.movePiece} id="44" name="44"color={this.state.squareColors[36]} piece = {pieceDictionary[this.state.board.board[4][4]]}/>
<Square onPress={this.movePiece} id="45" name="45"color={this.state.squareColors[37]} piece = {pieceDictionary[this.state.board.board[4][5]]}/>
<Square onPress={this.movePiece} id="46" name="46"color={this.state.squareColors[38]} piece = {pieceDictionary[this.state.board.board[4][6]]}/>
<Square onPress={this.movePiece} id="47" name="47"color={this.state.squareColors[39]} piece = {pieceDictionary[this.state.board.board[4][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} id="50" name="50"color={this.state.squareColors[40]} piece = {pieceDictionary[this.state.board.board[5][0]]}/>
<Square onPress={this.movePiece} id="51" name="51"color={this.state.squareColors[41]} piece = {pieceDictionary[this.state.board.board[5][1]]}/>
<Square onPress={this.movePiece} id="52" name="52"color={this.state.squareColors[42]} piece = {pieceDictionary[this.state.board.board[5][2]]}/>
<Square onPress={this.movePiece} id="53" name="53"color={this.state.squareColors[43]} piece = {pieceDictionary[this.state.board.board[5][3]]}/>
<Square onPress={this.movePiece} id="54" name="54"color={this.state.squareColors[44]} piece = {pieceDictionary[this.state.board.board[5][4]]}/>
<Square onPress={this.movePiece} id="55" name="55"color={this.state.squareColors[45]} piece = {pieceDictionary[this.state.board.board[5][5]]}/>
<Square onPress={this.movePiece} id="56" name="56"color={this.state.squareColors[46]} piece = {pieceDictionary[this.state.board.board[5][6]]}/>
<Square onPress={this.movePiece} id="57" name="57"color={this.state.squareColors[47]} piece = {pieceDictionary[this.state.board.board[5][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} id="60" name="60"color={this.state.squareColors[48]} piece = {pieceDictionary[this.state.board.board[6][0]]}/>
<Square onPress={this.movePiece} id="61" name="61"color={this.state.squareColors[49]} piece = {pieceDictionary[this.state.board.board[6][1]]}/>
<Square onPress={this.movePiece} id="62" name="62"color={this.state.squareColors[50]} piece = {pieceDictionary[this.state.board.board[6][2]]}/>
<Square onPress={this.movePiece} id="63" name="63"color={this.state.squareColors[51]} piece = {pieceDictionary[this.state.board.board[6][3]]}/>
<Square onPress={this.movePiece} id="64" name="64"color={this.state.squareColors[52]} piece = {pieceDictionary[this.state.board.board[6][4]]}/>
<Square onPress={this.movePiece} id="65" name="65"color={this.state.squareColors[53]} piece = {pieceDictionary[this.state.board.board[6][5]]}/>
<Square onPress={this.movePiece} id="66" name="66"color={this.state.squareColors[54]} piece = {pieceDictionary[this.state.board.board[6][6]]}/>
<Square onPress={this.movePiece} id="67" name="67"color={this.state.squareColors[55]} piece = {pieceDictionary[this.state.board.board[6][7]]}/>
</div>
<div className="row">
<Square onPress={this.movePiece} id="70" name="70"color={this.state.squareColors[56]} piece = {pieceDictionary[this.state.board.board[7][0]]}/>
<Square onPress={this.movePiece} id="71" name="71"color={this.state.squareColors[57]} piece = {pieceDictionary[this.state.board.board[7][1]]}/>
<Square onPress={this.movePiece} id="72" name="72"color={this.state.squareColors[58]} piece = {pieceDictionary[this.state.board.board[7][2]]}/>
<Square onPress={this.movePiece} id="73" name="73"color={this.state.squareColors[59]} piece = {pieceDictionary[this.state.board.board[7][3]]}/>
<Square onPress={this.movePiece} id="74" name="74"color={this.state.squareColors[60]} piece = {pieceDictionary[this.state.board.board[7][4]]}/>
<Square onPress={this.movePiece} id="75" name="75"color={this.state.squareColors[61]} piece = {pieceDictionary[this.state.board.board[7][5]]}/>
<Square onPress={this.movePiece} id="76" name="76"color={this.state.squareColors[62]} piece = {pieceDictionary[this.state.board.board[7][6]]}/>
<Square onPress={this.movePiece} id="77" name="77"color={this.state.squareColors[63]} piece = {pieceDictionary[this.state.board.board[7][7]]}/>
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
  