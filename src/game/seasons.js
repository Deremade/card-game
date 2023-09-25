import {Deck, customDeck} from '../cards/deck.js'
import React, {useState} from 'react'
import Hand from "../cards/hand.js"
import CPUHand from "../cards/CPUhand.js"
import CardDisplay from "../cards/cardDisplay.js";

const suits = ["🔆", "🍁", "❄", "🌼"]
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

/**
 * Creates the custom suits Deck and shuffles them
 * @returns A fresh shuffled Deck
 */
function setupGame() {
    var deck = new Deck(customDeck(suits, values))
    deck.shuffle()
    return deck
}

/**
 * 
 * @param {Card} centerCard The current center card
 * @param {Card} candidate The card being played
 * @returns Weather a card can be played without chnaging seasons
 */
function canPlay(centerCard, candidate) {
  //Find the suit of the cards
    var centerSuit = suits.indexOf(centerCard.suit)
    var canSuit = suits.indexOf(candidate.suit)

    //The they are the same suit :
    if(centerSuit == canSuit)
        //Return weather or not the new card is higher than the old card
        return values.indexOf(candidate.value) > values.indexOf(centerCard.value)
    else
        return false
}

/**
 * 
 * @param {Card} centerCard 
 * @param {Card} candidate 
 * @returns Weather or not the card would shift seasons
 */
function shiftSeason(centerCard, candidate) {
  //Get suits
  var centerSuit = suits.indexOf(centerCard.suit)
  var canSuit = suits.indexOf(candidate.suit)
  //Incremennt and loop the center card's suit to find the next season
  var nextSuit = (centerSuit+1) % 4
  //If the candidate is the next season
  return nextSuit == canSuit

}


export default function Seasons() {
  //The main deck
  const [deck, setDeck] = useState(setupGame());
  //The player Hand
  const [hand, setHand] = useState(() => new Deck(deck.drawMultiple(5)))
  //The CPU hand
  const [CPUhand, setCPUHand] = useState(() => new Deck(deck.drawMultiple(5)))
  //The Center card
  const [centerCard, setCenterCard] = useState(() => deck.draw())
  //The score [CPU, Player]
  const [score, setScore] = useState([0, 0])
  //The length of the current season
  const [season, setSeason] = useState(0)

  /**
   * The player tries to polay a card
   * CPU pays their turn if the card is valid
   * @param {Card} card card being played
   */
  function playCard(card) {
    //If the Seasons shift
    if(shiftSeason(centerCard, card)){
      //Grant the CPU points
      var newScore = score
      newScore[0] += season
      setScore(newScore)
      //Reset Seasons
      setSeason(1)
      //Set the Center card
      setCenter(card)
      //CPU plays their turn
      CPUturn(card)
    }
    //If the seasons do not shift but the card can be played
    if(canPlay(centerCard, card)) {
        //Increment season
        setSeason(season+1)
        //Set center card
        setCenter(card)
        //CPU turn
        CPUturn(card)
    }
  }

  /**
   * Player changes the Center card
   * @param {Card} card the new center card
   */
  function setCenter(card) {
    //Set state center card
    setCenterCard(card)
    //Remove it from the player hand
    hand.remove(card)
    //If there are cards left, player draws
    if(deck.cards.length > 0)
      hand.addCard(deck.draw())

  }

  /**
   * CPU sets the center card
   * @param {Card} card new Center card
   */
  function CPUsetCenter(card) {
    //Set state center card
    setCenterCard(card)
    //Remove from CPU hand
    CPUhand.remove(card)
    //If cards are left draw for CPU
    if(deck.cards.length > 0)
      CPUhand.addCard(deck.draw())

  }

  /**
   * Player passes their turn
   */
  function passTurn() {
    //Give CPU Points
    var newScore = score
    newScore[0] += season
    setScore(newScore)
    //If no cards are left, game is over
    if(deck.cards.length < 1)
      endGame()
    //Redraw hand
    deck.addCards(hand.drawMultiple(5))
    setHand(new Deck(deck.drawMultiple(5)))
  }

  /**
   * CPU passes turn
   */
  function CPUpassTurn() {
    //Give Player Points
    var newScore = score
    newScore[1] += season
    setScore(newScore)
    //If no cards are left, game is over
    if(deck.cards.length < 1)
      endGame()
    //redraw hand
    deck.addCards(CPUhand.drawMultiple(5))
    setCPUHand(new Deck(deck.drawMultiple(5)))
  }

  /**
   * CPU takes thier turn
   * @param {Card} newCard The card the player played 
   * [needs to be specified because the centerCard state will still register as the last card]
   * @returns 
   */
  function CPUturn(newCard) {
    //For every card in the CPU's hand
    for(let i = 0; i < CPUhand.cards.length; i++) {
      //If they can play it without chnaging seasons, do so
      if(canPlay(newCard, CPUhand.cards[i])) {
        CPUsetCenter(CPUhand.cards[i])
        return
      }
      //If they can play it by changing the seasons, do so
      if(shiftSeason(newCard, CPUhand.cards[i])) {
        //Player gets points
        var newScore = score
        newScore[1] += season
        setScore(newScore)
        //reset seasons
        setSeason(1)
        //play card
        CPUsetCenter(CPUhand.cards[i])
        return
      }
    }
    //If they cannot play, they pass their turn
    CPUpassTurn()
  }

  function winGame() {
    alert("You Win \n"+"Your score : "+score[1]+"\nCPU score : "+score[0])
    window.location.href = "/";
    
  }

  function loseGame() {
    alert("You Lose \n"+"Your score : "+score[1]+"\nCPU score : "+score[0])
    window.location.href = "/";
  }

  function endGame() {
    if(score[0] > score[1])
      loseGame()
    else
      winGame()
  }

  return (
    <div>
    <CPUHand hand={CPUhand.cards} />
    <br/>
    CPU Score : {score[0]}
    <br/>
    <br/>
    <br/>
    Season length : {season}
    <div className="center">
    <CardDisplay card={centerCard} />
    </div>
    <br/>
    <br/>
    <br/>
    Player Score : {score[1]}
    <br/>
    <button className="pass-button" onClick={() => passTurn()}>Pass</button>
    <Hand hand={hand.cards} playCard={card => {playCard(card)} }/>
    </div>
  )
}
