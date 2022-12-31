import React from "react";
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import BoardTile from "./BoardTile";
import "./BoardTile.css";
import "./App.css";

/**
 * The main application component.
 *
 */
class App extends React.Component {
    playerPiece = 'b';
    aiPiece = 'r';
    emptyPiece = 's';
    highlightPiece = 'h';
    pickedUpPiece = 'p';
  constructor(props) {
    super(props);
    this.state = {
        board: [['s','s','s','s','s'], ['s','s','s','s','s'],['s','s','s','s','s'],
            ['s','s','s','s','s'],['s','s','s','s','s']], // Our game board
        playerPieceCount:0,
        pickedUpPiece: [],
        inProgress:false,
        needPickUp:false,
        winner:this.emptyPiece,
        playerScore:0,
        aiScore:0
    };
    this.playerChooseTile = this.playerChooseTile.bind(this);
    this.notifyPickUp = this.notifyPickUp.bind(this);
    this.pickUpPiece = this.pickUpPiece.bind(this);
    this.removeAllHighlights = this.removeAllHighlights.bind(this);
  }

  // player = 'r', ai = 'b', emptySpace = 's'
  // move data comes in as [[xcord, ycord], [x-source, y-source]]
  // with the second tuple in list being optional


  startGame() {
      this.setState({inProgress:true},() => this.getRandomMoveFromAi());
  }

  playAgain() {
      this.setState({
        board: [['s','s','s','s','s'], ['s','s','s','s','s'],['s','s','s','s','s'],
            ['s','s','s','s','s'],['s','s','s','s','s']], // Our game board
        playerPieceCount:0,
        pickUpPiece: [],
        inProgress:false,
        needPickUp:false,
        winner: this.emptyPiece
      });
      this.startGame();
  }

  getRandomMoveFromAi() {
      let x = Math.floor(Math.random() * 3 + 1)
      let y = Math.floor(Math.random() * 3 + 1)
      let tempBoard = this.state.board.map(function(arr) {
          return arr.slice();
      });
      tempBoard[x][y] = this.aiPiece;
      console.log(`random move ${[x, y]}`);
      this.setState({board: tempBoard});
  }

  playerWon(winNum) {
    if(winNum === -1) {
        this.setState({winner: this.playerPiece})
        this.setState({playerScore: this.state.playerScore + 1});
    } else if(winNum === 1) {
        this.setState({winner: this.aiPiece})
        this.setState({aiScore: this.state.aiScore + 1});
    }
  }

  getMoveFromAI() {
      let stringBoard = this.boardToString()
      console.log(stringBoard)
      fetch(`https://teeko-ai-backend.herokuapp.com/ai-move/?board=${stringBoard}`).then(
          (response) => {
          response.json().then(
              (response) => {
                  console.log(response)
                  if (response['board']) {
                      let responseBoard = this.boardFromString(response['board']);
                      if(response['win'] === -1) {
                          // player won
                          this.playerWon(-1)
                      } else if(response['win'] === 1){
                          // ai won
                          this.setState({board: responseBoard});
                          this.playerWon(1);
                      } else {
                          this.setState({board: responseBoard});
                      }

                  } else {
                      console.log("Failed to get respone from AI")
                  }
              })})
  }

  boardToString(){
      let flatBoard = this.state.board.flat()
      let stringBoard = ""
      flatBoard.forEach((tileString) => stringBoard += tileString)
      return stringBoard
  }

  boardFromString(stringBoard) {
      let realBoard = Array.from(Array(5), () => new Array(5))
      for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
              realBoard[i][j] = stringBoard[(i * 5) + j]
          }
      }
      return realBoard
  }

  notifyPickUp(enable) {
      this.setState({needPickUp: enable})
  }

  pickUpPiece(piece) {
      this.setState({pickedUpPiece: piece}, () => this.highlightPieces(piece[0], piece[1]))
  }

  highlightPieces(xCord, yCord) {
      console.log('highlighting possible moves')
      let tempBoard = this.state.board.map(function(arr) {
          return arr.slice();
      });
      //left
      if(xCord > 0 && this.state.board[xCord - 1][yCord] === this.emptyPiece) {
          tempBoard[xCord - 1][yCord] = this.highlightPiece;
      }
      //right
      if(xCord < 4 && this.state.board[xCord + 1][yCord] === this.emptyPiece) {
          tempBoard[xCord + 1][yCord] = this.highlightPiece;
      }
      //up
      if(yCord > 0 && this.state.board[xCord][yCord - 1] === this.emptyPiece) {
          tempBoard[xCord][yCord - 1] = this.highlightPiece;
      }
      //down
      if(yCord < 4 && this.state.board[xCord][yCord + 1] === this.emptyPiece) {
          tempBoard[xCord][yCord + 1] = this.highlightPiece;
      }
      //up left
      if(xCord > 0 && yCord > 0 && this.state.board[xCord - 1][yCord - 1] === this.emptyPiece) {
          tempBoard[xCord - 1][yCord - 1] = this.highlightPiece;
      }
      //up right
      if(xCord < 4 && yCord > 0 && this.state.board[xCord + 1][yCord - 1] === this.emptyPiece) {
          tempBoard[xCord + 1][yCord - 1] = this.highlightPiece;
      }
      //down left
      if(xCord > 0 && yCord < 4 && this.state.board[xCord - 1][yCord + 1] === this.emptyPiece) {
          tempBoard[xCord - 1][yCord + 1] = this.highlightPiece;
      }
      //down right
      if(xCord < 4 && yCord < 4 && this.state.board[xCord + 1][yCord + 1] === this.emptyPiece) {
          tempBoard[xCord + 1][yCord + 1] = this.highlightPiece;
      }
      this.setState({board:tempBoard})
  }

  removeAllHighlights(move) {
      let tempBoard = this.state.board.map(function(arr) {
          return arr.slice();
      });
      for(let i = 0; i < 5; i++) {
          for(let j = 0; j < 5; j++) {
              if(tempBoard[i][j] === this.highlightPiece) {
                  tempBoard[i][j] = this.emptyPiece;
              }
          }
      }
      this.setState({board:tempBoard}, () => this.playerChooseTile(move));
      console.log('removed all highlights');
  }

  playerChooseTile(move) {
      let xCord = move[0]
      let yCord = move[1]
      let tempBoard = this.state.board.map(function(arr) {
          return arr.slice();
      });
      tempBoard[xCord][yCord] = this.playerPiece;
      if(this.state.playerPieceCount > 3) {
        tempBoard[this.state.pickedUpPiece[0]][this.state.pickedUpPiece[1]] = this.emptyPiece;
        this.setState({playerPieceCount:this.state.playerPieceCount - 1});
        this.setState({pickedUpPiece:[]});
      }
      this.setState({playerPieceCount:this.state.playerPieceCount + 1});
      this.setState({board: tempBoard}, () => {
          this.getMoveFromAI()
      });
  }

  generateBoard() {
    if(this.state.inProgress) {
        let boardTiles = []
            this.state.board.forEach((row, x) => {
            row.forEach((tile, y) => {
                boardTiles.push(<BoardTile key={`${x},${y}`} xAxis={x} yAxis={y} chooseTileCallback={this.playerChooseTile}
                                           currentVal={this.state.board[x][y]} isDropPhase={this.state.playerPieceCount < 4}
                                           isPickedUp={this.state.pickedUpPiece.length > 0}
                                           notifyPickUp={this.notifyPickUp}
                                           pickUpPiece={this.pickUpPiece}
                                           pickedUpPiece={this.state.pickedUpPiece}
                                           removeAllHighlights={this.removeAllHighlights}>tile</BoardTile>);
            })
        })
        return (<div className="grid-container">{boardTiles}</div>)
    }
  }

  generateScoreBoard() {
    return (
        <Card>
            <Card.Title>
                Player: {this.state.playerScore} AI: {this.state.aiScore}
            </Card.Title>
        </Card>)
  }

  AlignmentExample() {
        return (
            <>
                <Nav className="justify-content-end" activeKey="/home">
                    <Nav.Item>
                        <Nav.Link href="https://www.linkedin.com/in/ryan-brumm/">Me</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="https://github.com/brumm-ryan/teeko-web-app">GitHub Repo</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="https://bonaludo.com/2016/07/27/teeko-a-game-and-a-masterpiece-of-john-scarne-the-wizard-of-games/">What is Teeko?</Nav.Link>
                    </Nav.Item>
                </Nav>
            </>
        );
    }

  render() {
    return (
        <div style={{textAlign:"center"}}>
            <div>{this.AlignmentExample()}</div>
          <h1 hidden={this.state.winner !== this.emptyPiece}>Can you beat this AI at Teeko?</h1>
            <h1 hidden={this.state.winner !== this.playerPiece}>You beat the AI</h1>
            <h1 hidden={this.state.winner !== this.aiPiece}>Submit to AI dominance</h1>
            <h2 hidden={!this.state.needPickUp}>Pick one of your pieces before selecting where to place it</h2>
            <div style={{padding:"20px"}}>
                <button hidden={this.state.inProgress} onClick={() => this.startGame()}>I'll try</button>
                <button hidden={this.state.winner === this.emptyPiece} onClick={() => this.playAgain()}>Play Again</button>
            </div>
            <div>{this.generateScoreBoard()}</div>
          <div>{this.generateBoard()}</div>
        </div>
    );
  }
}

export default App;
