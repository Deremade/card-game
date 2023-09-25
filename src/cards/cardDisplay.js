import React from 'react'
import './card.css'

export default function CardDisplay({card, flip=false}) {
    if(flip) 
        return (
            <div className="card face-down">

            </div>
        )
    else
        return (
            <div className="card">
                <div className={card.suit}>
                    <div className="top">
                        {card.suit} {card.value}
                    </div>
                    <div className="middle">
                        {card.suit}
                    </div>
                    <div className="bottom">
                        {card.suit} {card.value}
                    </div>
                </div>
            </div>
        )
}
