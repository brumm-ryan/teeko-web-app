import React from "react";
import "./BoardTile.css";

/**
 * A piece representing one tile of the Teeko board grid
 *
 */
class BoardTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaced: this.props.currentVal !== 0,
            player: this.props.player,
            color: "#D3D3D3"
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.currentVal === 1 && this.state.player !== 1) {
            this.setState({isPlaced:true, player:1, color:"#0000FF"})
        } else if(this.props.currentVal === 2 && this.state.player !== 2) {
            this.setState({isPlaced:true, player:2, color:"red"})
        } else if(this.props.currentVal === 0 && this.state.player !== 0){
            this.setState({isPlaced:false, player:0, color:"#D3D3D3"})
        }
    }

    chooseTile() {
        if(!this.state.isPlaced) {
            this.props.chooseTileCallback(1, this.props.xAxis, this.props.yAxis)
            this.setState({isPlaced:true, player:1, color:"#0000FF"})
            console.log(`x-Axis:${this.props.xAxis} y-Axis:${this.props.yAxis}`)
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
