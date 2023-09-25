import React from 'react'
import CardDisplay from "./cardDisplay"

export default function CPUHand({hand }) {
  return (
    <div className="hand">
    {hand.map(card => 
      <CardDisplay card={card} flip={true} key={card.suit+card.value}/>
      )}
    </div>
  )
}