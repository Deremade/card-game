const suits = ["♣️", "♥️", "♠️", "♦️"]
export const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

export class Deck {

    constructor(cards = freshDeck()) {
        this.cards = cards
    }

    draw() {
        return this.cards.shift()
    }

    drawMultiple(amount) {
        var drawn = []
        while(amount > 0) {
            amount--
            if(this.cards.length > 0)
                drawn.push(this.draw())
        }
        return drawn;
    }

    shuffle() {
        shuffleArray(this.cards);
    }

    remove(card) {
        var index = this.cards.indexOf(card);
        if(index !== -1)
            this.cards.splice(index, 1)
    }

    addCard(card) {
        this.cards.push(card)
    }

    addCards(cards) {
        cards.map(card => this.addCard(card))
    }

    addCardTop(card) {
        this.cards.unshift(card)
    }

    drawTop() {
        return this.cards.pop()
    }

    getTop() {
        return this.cards[0]
    }
}

export class Card {
    constructor(suit, value){
        this.suit = suit;
        this.value = value;
    }

    getVal() {
        return values.indexOf(this.value)
    }
}

function freshDeck() {
    return suits.flatMap(suit => {
        return values.map(value => {
            return new Card(suit, value)
        })
    })
}

export function customDeck(customSuit, customValues) {
    return customSuit.flatMap(suit => {
        return customValues.map(value => {
            return new Card(suit, value)
        })
    })
}

function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
      // Pick a remaining element
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      // Swap it with the current element.
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  }

export function deal(deck, players, amount) {
    var decks = []
    for(let i = 0; i < players; i++) {
        decks.push([])
    }
    while(amount > 0){
        amount--
        for(let i = 0; i < players; i++) {
            decks[i].push(deck.draw())
        }
    }
    var returnDecks = []
    for(let i = 0; i < players; i++) {
        returnDecks.push(new Deck(decks[i]))
    }
    return returnDecks;
}