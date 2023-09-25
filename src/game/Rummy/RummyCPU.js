import Meld from '../Rummy/Meld';
import {Deck} from '../../cards/deck'

function getMelds(hand) {
    //Keep track of those allready in a run so they re not added again
    var inRun =[]
    //Keep track of those allready in a set so they are not added again
    var inSet =[]
    //Melds that can be returned
    var melds =[]
    for(let cardIndex in hand.cards) {
      var card = hand.cards[cardIndex]
      if(inSet.indexOf(card) == -1) {
        //Make a new Meld
        var setMeld = new Meld()
        setMeld.addCard(card)
        //create a set and take the cards from the hand
        setMeld.addMultipleCards(setMeld.canSet(hand))
        //The first item is a duplicate, remove it
        setMeld.sequence.splice(0,1)
        //Make sure the function remembers what's already in a set so sets are not repeated
        inSet = [...inSet, ...setMeld.sequence]
        //save the meld
        melds.push(setMeld)
      }
  
      if(inRun.indexOf(card) == -1) {
        //create meld
        var setMeld = new Meld()
        setMeld.addCard(card)
        //While the run can be added to, add from hand
        while(setMeld.canRun(hand).length > 0)
          setMeld.addMultipleCards(setMeld.canRun(hand))
        //Make sure the function remembers which cards are allready in a run so runs do not repeat
        inRun = [...inRun, ...setMeld.sequence]
        //save the meld
        melds.push(setMeld)
      }
  
    }
    return melds
  }

  export function CPUmakeMeld(hand) {
    //Get melds that are possible given the deck
    var possibleMelds = getMelds(hand)
    var maxSize = 0
    var bestMeld = null
    //Go through every meld to find the biggest
    for(let meldIndex in possibleMelds) {
        let meld = possibleMelds[meldIndex]
        if(meld.sequence.length > maxSize) {
            //set the length of the biggest for future comparison and save the best meld
            maxSize = meld.sequence.length
            bestMeld = meld
        }
    }
    return bestMeld
  }

  export function CPUdraw(candidate, hand, melds) {
    //find the current largest possible meld
    var currMaxSize = CPUmakeMeld(hand).sequence.length
    //add the candidate card [temporary]
    hand.addCard(candidate)
    //if adding the card allows for a larger meld
    if(CPUmakeMeld(hand).sequence.length > currMaxSize){
        //remove the temp card from hand
        hand.remove(candidate)
        //return true
        return true
    }
    //remove the temp card from hand
    hand.remove(candidate)
    //For every meld
    for(let meldIndex in melds) {
        let meld = melds[meldIndex]
        //if the meld can be added to, draw the card
        if(meld.canAdd(candidate))
            return true
    }
    //if not returned true by now, return false
    return false
  }

  export function CPUdiscard(hand) {
    var discardables = []
    var melds = getMelds(hand)
    for(let card in hand.cards) {
      discardables.push(new Discardable(hand.cards[card], melds))
    }
    discardables.sort(compareDiscardables)
    console.log(discardables[0], discardables)
    return discardables[0].card
  }

  class Discardable {
    constructor(card, melds) {
      this.card = card
      this.value = 0
      for(let meldIndex in melds) {
        let meld = melds[meldIndex]
        if(meld.sequence.indexOf(card) != -1)
          this.value += meld.sequence.length-1
      }
    }
  }

  function compareDiscardables(a, b) {
    return a.value - b.value;
  }

  export function addToMelds(hand, melds) {
    for(let meldIndex in melds) {
      let meld = melds[meldIndex]
      var canPlay = meld.canPlay(hand)
      while(canPlay.length > 0) {
        meld.addMultipleFromHand(meld.canPlay(hand), hand)
        var canPlay = meld.canPlay(hand)
      }
  }
  }

