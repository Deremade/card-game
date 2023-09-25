import React, {useState, useRef} from 'react'
import {Deck, customDeck, deal} from '../cards/deck.js'
import Hand from "../cards/hand.js"
import Package from './Web3oWits/package.js'
import "../app.css"

const suits = ["⚠", "₿", "🛡️"/*, "🔎︎"*/]
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

function setupGame() {
    var deck = new Deck(customDeck(suits, values))
    deck.shuffle()
    return deck
}

export default function Web3oWits() {
  var players = 3
//The main deck
  const [deck, setDeck] = useState(setupGame());
  //The players' hands
  const [hands, setHands] = useState(() => deal(deck, players, 7))
  //Used to re-render
  const [, setState] = useState({})
  //Keep track of what the player is trying to do
  const playChoice = useRef("New")
  
  //Score Board
  const [score,] = useState(() => {
    var scoreboard = []
    while(scoreboard.length < players)
      scoreboard.push(0)
    return scoreboard
  })
  const [packages, setPackage] =  useState([])
  const canTakePackage = useRef(true)

  function CPUturn(player){
    if(Math.random() > 0.7) {
      var getPackage = pickFromArray(packages)
      if(getPackage != null) {
        packages[packages.indexOf(getPackage)] = null
        if(getPackage.safe())
          score[player] += getPackage.reward()
        else
          score[player] = -1
      }
      console.log(score[player])
    } else {
      while(Math.random() > 0.2)
        if(hands[player].cards.length > 0)
          CPUplaycard(player)
    }
    endTurn(hands[player])
  }

  function playerEndTurn() {
    endTurn(hands[0])
    var currPlayer = 1
    while(currPlayer < players) {
      CPUturn(currPlayer)
      currPlayer++
    }
    for(let hand in hands) {
      if(hands[hand].length == 0){
        alert("Game Over")
        window.location.href = "/";
      }
    }
  }

  //End the turn of a player
  function endTurn(hand) {
    var cards = 7-hand.cards.length
    hand.addCards(deck.drawMultiple(cards))
    canTakePackage.current = true
    setState({})
  }

  //When the user changes what package they selected
  function onChangeValue(event) {
    console.log(event.target.value);
    playChoice.current = event.target.value
    console.log(packages)
  }

  //When a player plays a card
  function playCard(card, player, choice) {
    //If the "New Package" has been selected
    if(choice == "New") {
      var newPackage = new Package(packages.length, players)
      newPackage.addCard(card, player)
      packages.push(newPackage)
    } else if (choice == "Discard") {
      //If discarding don't do anything, the Hand will handle losing the card
    }
    //If slecting a package, add to package
    else packages[choice].addCard(card, player)
    hands[player].remove(card)
    if(player == 0)
      canTakePackage.current = false
    setState({})
  }

  //Draw a package to get the points
  function drawPackage(pack) {
    //If more viruses than defence, the player loses all points, down to -1
    if(pack.reward() < 0)
      score[0] = -1
    else
      //Get the reward
      score[0] += pack.reward()
    packages[packages.indexOf(pack)] = null
    endTurn(hands[0])
    setState({})
  }

  function CPUplaycard(cpu) {
    if(rng(0, 5) > 1) {
      var getPackage = pickFromArray(packages)
      if(getPackage != null)
        playCard(hands[cpu].draw(), cpu, packages.indexOf(getPackage))
    } else {
      if(rng(0, 2) < 1)
        playCard(hands[cpu].draw(), cpu, "Discard")
      else 
        playCard(hands[cpu].draw(), cpu, "New")
    }
  }

  let play = 0

  return (
    <div>
        {score.map(playScore => {return (
          <p>Player {play++} : {playScore}.0₿</p>
        )})}
        <div onChange={onChangeValue} className="radio-button">
          <div className='packages'>
            <input type="radio" name="playChoice" value="New" id="New Package" className='radio1'/>
              <label htmlFor="New Package" >New Package</label>
            {packages.map(pack => {if(pack!= null) return pack.render(canTakePackage.current, drawPackage)})}
          </div>
          <input type="radio" name="playChoice" value="Discard" id="discard" className='radio1'/>
            <label htmlFor="discard" >Discard</label>
        </div>
      <Hand hand={hands[0].cards} playCard={card => {playCard(card, 0, playChoice.current)} }/>
      <button onClick={()=>playerEndTurn()}>End Turn</button> {score[0]}
    </div>
  )
}

function pickFromArray(arr) {
  var rng = Math.floor(Math.random()*arr.length)
  return arr[rng]
}

function rng(min, max) {
  var rng = Math.floor(Math.random()*(max-min))
  return rng+min
}