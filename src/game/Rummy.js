import React, {useState, useRef} from 'react';

import {CPUmakeMeld, CPUdraw, CPUdiscard, addToMelds} from './Rummy/RummyCPU';
import RummyPlayer from './Rummy/rummyPlayer';
import {Deck, deal} from '../cards/deck'
import Meld from './Rummy/Meld';
import DrawPile from "../cards/drawPile.js"
import CPUHand from '../cards/CPUhand';
import '../app.css'

export default function Rummy() {
      //The main deck
  const [deck, setDeck] = useState(() => {
    var newDeck = new Deck()
    newDeck.shuffle()
    return newDeck
  });
  const [deck2, setDeck2] = useState(() => {
    var newDeck = new Deck([])
    newDeck.addCard(deck.draw())
    return newDeck
  });
  //The player Hand
  const [hands, setHands] = useState(() => deal(deck, 2, 9))
  //const [testMelds, setPlayHand] = useState(() => deck.drawMultiple(7))
  const [melds, setMelds] = useState(() =>{
    var makeMelds = []
    return makeMelds
  })
  const [,setState] = useState(()=>{})
  const turn = useRef(false)
  const CPUmelded = useRef(false)

  function draw(card) {
    if(!turn.current) {
      hands[0].addCard(card)
      turn.current = true
    } else return false

    if(deck.cards.length === 0)
      deck.addCards(deck2.drawMultiple(deck2.cards.length))
    setState({})
    return true
  }

  function discard(card) {
    if(turn.current) {
      deck2.addCardTop(card)
      turn.current = false
      CPUturn()
    } else return false
    if(hands[0].cards.length === 0){
      alert("You Win")
      window.location.href = "/";
    }
    setState({})
    return true
  }

  function CPUturn() {
    //Drawing phase
    if(CPUdraw(deck2.getTop(), hands[1], melds))
      hands[1].addCard(deck2.draw())
    else
      hands[1].addCard(deck.draw())
    //Playing phase [Melding]
    var makeMeld = CPUmakeMeld(hands[1])
    if(makeMeld.confirm()){
      var playMeld = new Meld()
      playMeld.addMultipleFromHand(makeMeld.sequence, hands[1])
      melds.push(playMeld)
      CPUmelded.current = true
    }
    //Playing phase [adding to melds]
    if(CPUmelded.current)
      addToMelds(hands[1], melds)
    //Discard
    var discarded = CPUdiscard(hands[1])
    hands[1].remove(discarded)
    deck2.addCardTop(discarded)
    if(hands[1].cards.length === 0){
      alert("You lose")
      window.location.href = "/";
    }
    setState({})
  }

  return (
    <>
      <CPUHand hand={hands[1].cards}/>
      <br />
      <br/>
        <div className='drawPile'>
          <DrawPile deck={deck} drawPile={card => draw(card)} flipped={true}/>
          <DrawPile deck={deck2} drawPile={card => draw(card)} flipped={false}/>
        </div>
      <br/>
      <RummyPlayer hand={hands[0]} melds={melds} discardDeck={discard}/>
    </>
  )
}
