import React, {useRef, useState} from 'react'
import CPUHand from '../../cards/CPUhand'
import {Deck, deal} from '../../cards/deck'
import Hand from '../../cards/hand'
import Meld from './Meld';
import '../../cards/card.css'

export default function RummyPlayer({hand, melds, discardDeck}) {
    const [meld, setMeld] = useState(() => new Meld());
    const [,setState] = useState(()=>{})
    const [option,setOption] = useState("Discard")
    const melded = useRef(false)

    function playCard(card) {
        if(option == "Add to Set") {
            for(let i = 0; i < melds.length; i++) {
                if(melds[i].type == 1)
                    if(melds[i].addCard(card))
                        hand.remove(card)
            }
        }
        if(option == "Add to Run") {
            for(let i = 0; i < melds.length; i++) {
                if(melds[i].type == 2)
                    if(melds[i].addCard(card))
                        hand.remove(card)
            }
        }
        if(option == "New Run") {
            var findMeld = new Meld()
            findMeld.addCard(card)
            while(findMeld.canRun(hand).length > 0)
                findMeld.addMultipleCards(findMeld.canRun(hand))
            if(findMeld.confirm()){
                var addMeld = new Meld()
                addMeld.addMultipleFromHand(findMeld.sequence, hand)
                melds.push(addMeld)
                melded.current = true
            }
            console.log(findMeld)
        }
        if(option == "New Set") {
            var findMeld = new Meld()
            findMeld.addCard(card)
            findMeld.addMultipleCards(findMeld.canSet(hand))
            if(findMeld.confirm()){
                var addMeld = new Meld()
                findMeld.sequence.shift()
                addMeld.addMultipleFromHand(findMeld.sequence, hand)
                melds.push(addMeld)
                melded.current = true
            }
            console.log(findMeld)
        }
        if(option == "Discard") {
            if(discardDeck(card))
                hand.remove(card)
        }
        setState({})
    }

    function handleDropdownChange(e) {
        setOption(e.target.value);
      }

      function sortCards() {
        hand.cards.sort(cardCompare)
        setState({})
      }

      const displayMelds =
        melds.map(meld => {
        return <Hand hand={meld.sequence} playCard={()=>{}} />
      })


    return (
        <div>
            {displayMelds}
            <br/>
            <br/>
            <select id="dropdown" onChange={handleDropdownChange} defaultValue={option} >
                <option value="Discard">Discard</option>
                <option value="New Set">New Set</option>
                <option value="New Run">New Run</option>
                {melded.current && <option value="Add to Set">Add to Set</option> }
                {melded.current && <option value="Add to Run">Add to Run</option> }
            </select>
            <Hand hand={hand.cards} playCard={card => {playCard(card)} }/>
            <button onClick={() => sortCards()}>Sort Cards</button>
        </div>)
}

function cardCompare(a, b) {
    return a.getVal() - b.getVal();
  }