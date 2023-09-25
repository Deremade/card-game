import React, { Component } from 'react'

export default class Package extends Component {
    constructor(index, players) {
        super();
        this.viruses = 0
        this.bitcoin = 0
        this.security = 0
        this.cards = []
        this.playerInputs = []
        this.index = index
        while(players > 0){
          this.playerInputs.push(0)
          players--
        }
    }
    
    safe() {
        return this.viruses <= this.security
    }

    reward() {
        if(this.safe())
            return this.bitcoin
        else
            return -1
    }

    addCard(card, player){
        this.cards.push(card)
        this.playerInputs[player]++
        switch(card.suit){
            case "⚠" : this.viruses += card.getVal()+1; break;
            case "₿" : this.bitcoin += card.getVal()+1; break;
            case "🛡️" : this.security += card.getVal()+1; break;
        }
    }

  render(canDraw, draw) {
    var index = 0
    return (
      <>
        <input type="radio" name="playChoice" value={this.index} id={"Package"+this.index} className='radio1'/>
            <label htmlFor={"Package"+this.index} > 
                Package{this.index} 
                {this.playerInputs.map(player => {index++; return (<><div>Player {index} : {player}</div></>)})}
              {canDraw && <button onClick={()=>draw(this)}>Draw</button>}
            </label>
       </>
    )
  }
}