import {Deck, customDeck} from '../cards/deck.js'
import React, {useState} from 'react'
import Hand from "../cards/hand.js"
import CPUHand from "../cards/CPUhand.js"
import CardDisplay from "../cards/cardDisplay.js";
import Stack from './Solitaire/stack.js';

export default function Solitare() {
    const [deck, setDeck] = useState(()=>new Deck())
    const [hand, setHand] = useState(() => new Deck(deck.drawMultiple(5)))
    const [state, setState] = useState({})

    function addACard() {
        hand.addCard(deck.draw())
        setState({})
    }

  return (
    <>
    <Stack hand={hand.cards} />
    <button onClick={addACard}>Draw</button>
    </>
  )
}
