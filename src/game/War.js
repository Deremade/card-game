import React, { Component, useState } from 'react'
import { Deck , deal} from '../cards/deck.js'
import DrawPile from "../cards/drawPile.js"
import CardDisplay from '../cards/cardDisplay'

export default function War() {
        const [deck,] = useState(() => {
            let newDeck = new Deck()
            newDeck.shuffle()
            return newDeck;
        })
        const [draw,] = useState(deal(deck, 2, 26))
        const [p1, setP1] = useState(draw[0].draw())
        const [p2, setP2] = useState(draw[1].draw())
        const [,setState] = useState({})

    function findWinner() {
        var p1Val= p1.getVal()
        var p2Val= p2.getVal()
        if(p1Val == p2Val)
            return "Tie"
        if(p1Val > p2Val)
            return "p1"
        if(p1Val < p2Val)
            return "p2"
    }

    function nextRound() {
        var winner = findWinner()
            if(winner == "Tie") {
                draw[0].addCard(p1); 
                draw[1].addCard(p2); 
            }
            if(winner == "p1") draw[0].addCards([p1, p2]);
            if(winner == "p2") draw[1].addCards([p1, p2]);
        setP1( draw[0].draw() )
        setP2( draw[1].draw() )
        console.log(p1)
        if(draw[0].cards.length == 0) {
            alert("you win")
            window.location.href = "/";
        }
        if(draw[1].cards.length == 0) {
            alert("you lose")
            window.location.href = "/";
        }
        setState({});
    }
    return (
      <div>
        <p>{draw[0].cards.length}</p>
        <div className='drawPile'>
            <DrawPile deck={draw[0]} drawPile={card => console.log(card)} flipped={true}/>
            <CardDisplay card={p1} />
        </div>
        <p>{draw[1].cards.length}</p>
        <div className='drawPile'>
            <DrawPile deck={draw[1]} drawPile={card => console.log(card)} flipped={true}/>
            <CardDisplay card={p2} />
        </div>
        <button onClick={nextRound}>Next Round</button>
      </div>
    )
}

