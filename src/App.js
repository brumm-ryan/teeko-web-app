import React from "react";
import BoardTile from "./BoardTile";
import "./BoardTile.css";
import "./App.css";

/**
 * The main application component.
 *
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        board: [[0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]], // Our game board
        aiPieces:[],
        playerPieces:[],
        inProgress:false // is the game in progress
    };
    this.playerChooseTile = this.playerChooseTile.bind(this)
  }

  getMoveFromAI() {
      //TODO implement python api using flask to return ai move

      let flatBoard = this.state.board.flat()
      let stringBoard = ""
      flatBoard.forEach((num) => stringBoard += num)
      let response = fetch(`https://teeko-ai-backend.herokuapp.com/ai-move/?board=${stringBoard}`).then((response) => response.json())
          .then((actualData) => this.playerChooseTile(2, actualData['move'][0][0], actualData['move'][0][1]))
  }

  playerChooseTile(player, xCord, yCord) {
      let tempBoard = this.state.board.map(function(arr) {
          return arr.slice();
      });
      tempBoard[xCord][yCord] = player;
      if(player === 1) {
        if(this.state.playerPieces.length > 3) {
            let removePiece = this.state.playerPieces.shift()
            tempBoard[removePiece[0]][removePiece[1]] = 0
        }
          this.state.playerPieces.push([xCord, yCord])
          this.setState({board: tempBoard});
          this.getMoveFromAI();
      } else {
          if (player === 2) {
              if(this.state.aiPieces.length > 3) {
                  let removePiece = this.state.aiPieces.shift()
                  tempBoard[removePiece[0]][removePiece[1]] = 0
              }
              this.state.aiPieces.push([xCord, yCord])
              this.setState({board: tempBoard});
          }
      }
  }

  generateBoard() {
    if(this.state.inProgress) {
        let boardTiles = []
            console.log("building board");
        console.log(this.state.board);
            this.state.board.forEach((row, x) => {
            row.forEach((tile, y) => {
                boardTiles.push(<BoardTile key={`${x},${y}`} xAxis={x} yAxis={y} chooseTileCallback={this.playerChooseTile}
                                           currentVal={this.state.board[x][y]}>tile</BoardTile>);
            })
        })
        return (<div className="grid-container">{boardTiles}</div>)
    }
  }

  render() {
    return (
        <div style={{textAlign:"center"}}>
          <h1>Can you beat this AI at Teeko?</h1>
          <button hidden={this.state.inProgress} onClick={() => this.setState({inProgress:true})}>I'll try</button>
          <div>{this.generateBoard()}</div>
        </div>
    );
  }
}

export default App;
