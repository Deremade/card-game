import React, {useState, useRef} from 'react';
import DrawPile from "../cards/drawPile.js"
import { Deck , values } from '../cards/deck';
import "../app.css"
import Hand from '../cards/hand.js';
import CPUHand from '../cards/CPUhand.js';
import Meld, {MeldSet} from './Meld.js'

export default function Rummy() {
    //Create a deck and shuffle it
    const [deck, setDeck] = useState(() => {
        var newDeck = new Deck()
        newDeck.shuffle()
        return newDeck;
    })
    const [deck2, setDeck2] = useState(() => new Deck([deck.draw()]))
    const [hand, setHand] = useState(() => new Deck(deck.drawMultiple(7)))
    const [CPUhand, setCPUHand] = useState(() => new Deck(deck.drawMultiple(7)))
    let [,setState] = useState()
    const turn = useRef(false)
    const meldSet = useRef(null)
    const melds = useRef([[],[]])
    const meldPlayer = useRef(1)

    function startTurn() {
        turn.current = true
    }

    function endTurn() {
        turn.current = false
    }
    /**
     * Draw a card and start your turn
     * @param {Card} card 
     */
    function drawCard(card) {
        if(!turn.current) { //if turn hasn't started
           startTurn() 
            hand.addCard(card)
            setState({});
            return true
        }
        return false
    }

    function playCard(card) {
        if(meldSet.current == null)
            discard(card)
        else
            meldSet.current.addToMeld(card)
        setState({});
    }

    /**
     * Discard a card and end your turn
     * @param {Card} card 
     */
    function discard(card) {
        if(turn.current) {
            hand.remove(card)
            deck2.addCardTop(card)
            setDeck2(deck2)
            endTurn()
        }
        if(hand.cards.length == 0) 
            winGame()
        setState({});
        meldPlayer.current = 0
        CPUTurn(CPUhand, deck, deck2, melds.current[0]);
        setState({});
        if(CPUhand.cards.length == 0)
            loseGame()
    }

    /**
     * Start making a meld
     */
    function createMeld() {
        meldPlayer.current = 1
        meldSet.current = new MeldSet(hand, [], confirmMeld, cancelMeld);
        setState({});
    }
    /**
     * add card to current Meld
     * @param {Card} card 
     */
    function addToMeld(card) {
        if (meldSet.current.addCard(card))
            hand.remove(card)
        setState({});
    }
    /**
     * cancel the current meld
     */
    function cancelMeld() {
        if(meldSet.current.getMeld().sequence.length > 0) {
            melds.current[meldPlayer.current].push(meldSet.current.getMeld())
        }
        meldSet.current = null
        setState({});
    }
    /**
     * Confirm the meld
     */
    function confirmMeld(confirmation) {
        if (confirmation){
            melds.current[meldPlayer.current].push(meldSet.current.getMeld())
            meldSet.current = null
            setState({});
        }
        if(hand.cards.length == 0)
            winGame()
    }
    /**
     * Set the current meld to an existing confirmed meld
     * @param {Meld} m 
     */
    function setMeld(m, index) {
        meldPlayer.current = index
        melds.current[index].splice(melds.current[index].indexOf(m), 1)
        meldSet.current = new MeldSet(hand, m.sequence, confirmMeld, cancelMeld)
        //editing.current = true
        setState({});
    }

  return (
    <div>
    <CPUHand hand={CPUhand.cards} />
    <br/>
    {melds.current[0].map(m => {
        return (
            <div key={m.beginingCard().value+m.beginingCard().suit}>
                <button onClick={() => setMeld(m, 0)}>Edit</button>
        <Hand hand={m.sequence} playCard={card => {}} />
        </div>
    )})}
    <br/>
    <br/>
    <div className='drawPile'>
      <DrawPile deck={deck} drawPile={card => drawCard(card)} flipped={true}/>
      <DrawPile deck={deck2} drawPile={card => drawCard(card)} flipped={false}/>
    </div>
    <br/>
    <br/>
    {melds.current[1].map(m => {
        return (
            <div key={m.beginingCard().value+m.beginingCard().suit}>
                <button onClick={() => setMeld(m, 1)}>Edit</button>
        <Hand hand={m.sequence} playCard={card => {}} />
        </div>
    )})}
    <br/>
    
    {turn.current ? //Check turn
        (meldSet.current == null ? //if current turn, then check meld
         <p><button onClick={() => createMeld()}>Create Meld</button>  Discarding</p> //Discarding if no meld
        : meldSet.current.display() ) //display meld if melding
    : <p>Drawing</p> /* If turn has not started yet, drawing */} 
    <br/>
    <Hand hand={hand.cards} playCard={card => playCard(card)}/>
    </div>
  )
}
function winGame() {
    alert("You Win")
}

function loseGame() {
    alert("You Lose")
}

function CPUdraw(pile, cpuHand){
    cpuHand.addCard(pile.draw())
}

function CPUTurn(cpuHand, drawPile, shownCards, melds) {
    let shouldDraw = CPUdrawShown(cpuHand.cards, shownCards.getTop())
    if(shouldDraw)
        CPUdraw(shownCards, cpuHand)
    if(!shouldDraw)
        CPUdraw(drawPile, cpuHand)
    let cpuMelding = CPUpickMeld(cpuHand.cards)
    if(cpuMelding.sequence != []) {
        for(let i = 0; i < cpuMelding.sequence.length; i++)
            cpuHand.remove(cpuMelding.sequence[i])
        melds.push(cpuMelding)
    }
    if(cpuHand.cards.length != 0)
        shownCards.addCardTop(cpuHand.draw())
}

function findMelds(cards) {
    let possibleMelds = []
    for(let i =0; i < cards.length; i++) {
        let card = cards[i]
        var meldAttempt = new Meld()
        meldAttempt.addCard(card)
        for(let  j=0; j < cards.length; j++) {
            if(i != j)
                meldAttempt.addCard(cards[j])
        }
        if(meldAttempt.confirm()) {
            possibleMelds.push(meldAttempt)
        }
    }
    return possibleMelds
}

function CPUdrawShown(currCards, shown) {
    let nonDraw = findMelds(currCards)
    currCards.push(shown)
    let draw = findMelds(currCards)
    let MaxLength = 0
    let drawShown = false
    for(let i =0; i < nonDraw.length; i++) {
        if(nonDraw[i].sequence.length > MaxLength) {
            MaxLength = nonDraw[i].sequence.length
        }
    }
    for(let i =0; i < draw.length; i++) {
        if(draw[i].sequence.length > MaxLength) {
            MaxLength = draw[i].sequence.length
            drawShown = true
        }
    }
    currCards.splice(currCards.indexOf(shown), 1)
    return drawShown
}

function CPUpickMeld(currCards) {
    let possibleMelds = findMelds(currCards)
    let MaxLength = 0
    let bestMeld = []
    for(let i =0; i < possibleMelds.length; i++) {
        if(possibleMelds[i].sequence.length > MaxLength) {
            MaxLength = possibleMelds[i].length
            bestMeld = possibleMelds[i]
        }
    }
    return bestMeld
}

function cardCompare(a, b) {
    return a.getVal() - b.getVal();
  }