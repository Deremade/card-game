import Hand from '../cards/hand.js';
import { Deck , values } from '../cards/deck';

export default class Meld {
    constructor() {
        this.type = -1
        this.sequence = []
    }

    addCard(card) {
        if(this.type == -1) {
            this.sequence.push(card)
            this.type = 0
            return true
        }
        //If the meld just started or is "of a kind"
        if(this.type == 1 || this.type == 0) {
            //Check if the card has the value as the start of the sequence
            if(card.value == this.beginingCardVal()) {
                this.sequence.push(card)
                this.type = 1
                return true 
            }
        }
        if(this.type == 2 || this.type == 0) {
            if(card.suit == this.beginingCard().suit) {
                //Check if the card is just lower than the starting card
                if(card.getVal() == this.beginingCardVal()-1) {
                    this.sequence.unshift(card)
                    this.type = 2
                    return true 
                }
                //Check if the card is just higher than the ending card
                if(card.getVal() == this.endingCardVal()+1) {
                    this.sequence.push(card)
                    this.type = 2
                    return true 
                }
            }
        }
    }

    beginingCard() {
        return this.sequence[0]
    }

    beginingCardVal() {
        return this.beginingCard().getVal()
    }

    endingCard() {
        return this.sequence[this.sequence.length-1]
    }

    endingCardVal() {
        return this.endingCard().getVal()
    }

    display(meldSet) {
        return (
            <>
            <button onClick={ () => meldSet.cancelMeld()}>Cancel</button>
            <Hand hand={this.sequence} playCard={card => console.log(card)}/>
            <button onClick={ () => meldSet.confirmMeld()}>Confirm</button>
            </>
        )
    }

    confirm() {
        return this.sequence.length > 2
    }
}


export class MeldSet {

    constructor(playingHand, starting, confirmation, update){
        this.playingHand = playingHand
        this.starting = starting
        this.meld = new Meld()
        for(let i = 0; i < starting.length; i++)
            this.meld.addCard(starting[i])
        this.confirmation = confirmation
        this.update = update
    }

    cancelMeld() {
        console.log(this.starting)
        //Go through every card in the meld sequence
        for(let i = 0; i < this.meld.sequence.length; i++) {
            //if the meld sequence contains cards not in the starting sequence
            if(this.starting.indexOf(this.meld.sequence[i]) == -1) {
                //Add those cards back into the playing hand
                this.playingHand.addCard(this.meld.sequence[i])
                this.meld.sequence.splice(i, 1)
            }
        }
        this.update()
    }

    addToMeld(card) {
        if (this.meld.addCard(card))
            this.playingHand.remove(card)
    }

    confirmMeld() {
        this.confirmation(this.meld.confirm())
        return this.meld.confirm()
    }

    getMeld() {
        return this.meld
    }

    display() {
        return this.meld.display(this)
    }
  }