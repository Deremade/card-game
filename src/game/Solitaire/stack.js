import React from 'react'
import CardDisplay from "../../cards/cardDisplay.js";

export default function Stack({hand}) {
    const topCard = hand[hand.length-1]
    function pop() {
        hand.pop()
    }
  return (
    <div className="Stack">
    {hand.map(card => {
        if(card != topCard ) { return (
            <a onClick={()=>console.log(card)} key={card.suit+card.value}>
            <div className="cardTop ">
                        <div className={card.suit}>
                                {card.suit} {card.value}
                            </div>
                    </div>
            </a> )
        }
    })}
      <a onClick={pop} >
        {topCard && <CardDisplay card={topCard}/>}
      </a>
    </div>
  )
}
