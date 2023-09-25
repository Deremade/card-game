import React from 'react'
import CardDisplay from "../cards/cardDisplay"

export default function Hand({hand, playCard }) {
    function playSingleCard(card) {
        playCard(card)
    }
  return (
    <div className="hand">
    {hand.map(card => 
    <a onClick={()=>playSingleCard(card)} key={card.suit+card.value}>
      <CardDisplay card={card} />
      </a>
      )}
    </div>
  )
}
