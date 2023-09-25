export default class Meld {
    constructor() {
        this.type = -1
        this.sequence = []
    }
    /**
     * Add a card to the meld
     * @param {Card} card 
     * @returns weather or not the card was added
     */
    addCard(card) {
        if(this.type == -1) {
            this.sequence.push(card)
            this.type = 0
            return true
        }
        //If the meld just started or is "of a kind" [set]
        if(this.type == 1 || this.type == 0) {
            //Check if the card has the value as the start of the sequence
            if(card.getVal() == this.beginingCardVal()) {
                this.sequence.push(card)
                this.type = 1
                return true 
            }
        }
        //Of a run
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

    /**
     * Checks if a card can be added
     * @param {Card} card 
     * @returns 
     */
    canAdd(card) {
        if(card == null) return false
        if(this.type == -1)
            return true
        //If the meld just started or is "of a kind" [set]
        if(this.type == 1 || this.type == 0) {
            //Check if the card has the value as the start of the sequence
            if(card.getVal() == this.beginingCardVal())
                return true 
        }
        if(this.type == 2 || this.type == 0) {
            if(card.suit == this.beginingCard().suit) {
                //Check if the card is just lower than the starting card
                if(card.getVal() == this.beginingCardVal()-1)
                    return true 
                //Check if the card is just higher than the ending card
                if(card.getVal() == this.endingCardVal()+1)
                    return true 
            }
        }
    }

    /**
     * Removes a card from a hand and plays it on the meld if it can be played
     * @param {Deck} hand 
     * @param {Card} card 
     */
    addFromHand(hand, card){
        if(this.addCard(card))
            hand.remove(card)
    }

    /**
     * adds multiple cards to the meld from a hand
     * @param {Array<Card>} cards 
     * @param {*} hand 
     */
    addMultipleFromHand(cards, hand) {
        for(let card in cards)
            this.addFromHand(hand, cards[card])
    }
    /**
     * adds multiple cards to the meld from an array
     * @param {Array<Card>} cards 
     */
    addMultipleCards(cards) {
        for(let card in cards)
            this.addCard(cards[card])
    }

    /**
     * Find all cards in an array that can be added to the meld
     * @param {Array<Card>} cards 
     * @returns a list of all cards that can be added
     */
    getAddableCards(cards) {
        var possibleCards = []
        for(let card in cards) {
            if(this.canAdd(cards[card]))
                possibleCards.push(cards[card])
        }
        return possibleCards
    }
    /**
     * @param {Deck} hand 
     * @returns all cards in the hand that can be played
     */
    canPlay(hand) {
        return this.getAddableCards(hand.cards)
    }
    /**
     * @param {Deck} hand 
     * @returns all cards in the hand that can be played to make a set
     */
    canSet(hand) {
        var temp = this.type
        this.type = 1
        var returned = this.getAddableCards(hand.cards)
        this.type = temp
        return returned
    }
    /**
     * @param {Deck} hand 
     * @returns all cards in the hand that can be played to make a run
     */
    canRun(hand) {
        var temp = this.type
        this.type = 2
        var returned = this.getAddableCards(hand.cards)
        this.type = temp
        return returned
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

    confirm() {
        return this.sequence.length > 2
    }
}