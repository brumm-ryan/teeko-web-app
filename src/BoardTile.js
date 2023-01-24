import React from "react";
import "./BoardTile.css";

/**
 * A piece representing one tile of the Teeko board grid
 *
 */
class BoardTile extends React.Component {
    playerPiece = 'b';
    aiPiece = 'r';
    emptyPiece = 's';
    highlightPiece = 'h';
    pickedUpPiece = 'p';
    constructor(props) {
        super(props);
        this.state = {
            isPlaced: this.props.currentVal !== this.emptyPiece,
            player: this.props.currentVal,
            color: "#D3D3D3"
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.currentVal === this.playerPiece && this.state.player !== this.playerPiece) {
            this.setState({isPlaced:true, player:this.playerPiece, color:"#0000FF"})
        } else if(this.props.currentVal === this.aiPiece && this.state.player !== this.aiPiece) {
            this.setState({isPlaced:true, player:this.aiPiece, color:"red"})
        } else if(this.props.currentVal === this.emptyPiece && this.state.player !== this.emptyPiece){
            this.setState({isPlaced:false, player:this.emptyPiece, color:"#D3D3D3"})
        } else if(this.props.currentVal === this.highlightPiece && this.state.player !== this.highlightPiece){
            this.setState({isPlaced:false, player:this.highlightPiece, color:"#90EE90"})
        }
    }

    checkIfValidMove(xCord, yCord) {
        if(Math.abs(this.props.pickedUpPiece[0] - xCord) > 1 || Math.abs(this.props.pickedUpPiece[1] - yCord) > 1) {
            console.log('invalid move');
            return false;
        } else {
            return true;
        }
    }

    chooseTile() {
        if(this.props.isFrozen) {return}
        if(this.state.player !== this.aiPiece) {
            if (this.state.isPlaced) {
                if (!this.props.isDropPhase) {
                    this.props.notifyPickUp(false);
                    this.props.pickUpPiece([this.props.xAxis, this.props.yAxis])
                }
            } else {
                if (this.props.isDropPhase) {
                    // set tile to be selected as usual
                    this.setState({isPlaced: true, player: this.playerPiece, color: "#0000FF"})
                    this.props.chooseTileCallback([this.props.xAxis, this.props.yAxis])
                } else {
                    //ensure that there's a piece selected to be picked up before we put this piece down
                    if (this.props.isPickedUp) {
                        if(this.checkIfValidMove(this.props.xAxis, this.props.yAxis)) {
                            console.log(`valid move from ${[this.props.pickedUpPiece[0], this.props.pickedUpPiece[1]]} to 
                            ${[this.props.xAxis, this.props.yAxis]}`)
                            this.props.removeAllHighlights([this.props.xAxis, this.props.yAxis])
                            this.setState({isPlaced: true, player: this.playerPiece, color: "#0000FF"})
                        }
                    } else {
                        this.props.notifyPickUp(true);
                    }
                }
            }
        }
    }

    render() {
        return (
            <>
                <div className="grid-item">
                    <div className="color-box" style={{backgroundColor: this.state.color, width:'5em', height:'5em'}}
                         onClick={() => this.chooseTile()}></div>
                </div>
            </>

        );
    }
}

export default BoardTile;
