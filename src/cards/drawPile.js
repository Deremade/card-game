import React, {useState} from 'react'
import "./card.js"
import CardDisplay from './cardDisplay'
import { Deck } from './deck'

export default function DrawPile({deck, drawPile, flipped=true}) {
    const [topCard, setTopCard] = useState(() => deck.getTop())
    let [,setState] = useState()

    function pileDraw() {
        //Only run if the drawPile function is defined
        if(drawPile != null) {
            //draw the card
            var drawCard = deck.draw()
            //run the function and if it returns false (can;t be drawn) run it back
            if (!drawPile(drawCard))
                deck.addCardTop(drawCard)
        }
        setTopCard(deck.getTop())
        setState({})
    }
    
    return (
        <div>
            {deck.getTop() != null && 
            <a onClick={() => pileDraw()}>
                <CardDisplay card={deck.getTop()} flip={flipped}/>
            </a>}
        </div>
    )
    
}
