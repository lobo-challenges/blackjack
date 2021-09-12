const prompt = require('prompt-sync')({sigint: true});

type Suit = 'diamonds' | 'clubs' | 'hearts' | 'spades'
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

class Card {
  rank: Rank
  suit: Suit
  value: number
  constructor(args: {rank: Rank, suit: Suit}) {
    this.rank = args.rank
    this.suit = args.suit
    this.value = this.computeValue()
    // console.log(`Card: ${this.rank} ${this.suit}, value: ${this.value}`)
  }

  computeValue(context?: any) {
    switch(this.rank) {
      case '10': 
        return 10
      case 'K': 
        return 10
      case 'Q': 
        return 10
      case 'J': 
        return 10
      case 'A': // when A is 1?
        return 1
      default :
        return parseInt(this.rank)
    }
  }
}


class Deck {
  cards: Card[] = [];

  constructor(args: {suits: Array<Suit>, ranks: Array<Rank>}) {
    this.generateDeck(args)
    this.shuffleDeck()
  }
  
  drawCard() {
    const card = this.cards.pop()
    if (!card) {
      throw Error('No cards left')
    } else {
      return card
    }
  }

  generateDeck(args: {suits: Array<Suit>, ranks: Array<Rank>}) {
    args.suits.forEach((suit) => {
      args.ranks.forEach((rank) => {
        const newCard: Card = new Card({rank, suit})
        this.cards.push(newCard)
      })
    })

  }

  randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  shuffleDeck() {
    // using Fisher-Yates shuffle algorithm https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    for (let idx = this.cards.length - 1; idx > 0; idx--){
      const randIdx = this.randomIntFromInterval(0, idx)
      const temp = this.cards[idx]
      this.cards[idx] = this.cards[randIdx]
      this.cards[randIdx] = temp
    }
  }

  printDeck() {
    this.cards.forEach((card, index) => {
      console.log(`${index+1}: ${card.rank} ${card.suit}`)
    })
  }

}

// class Players {
//   playersInfo: {
//     dealer: {
//       playerHand: Array<Card>
//       playerScore: number | Array<number>    
//     },
//     player: {
//       playerHand: Array<Card>
//       playerScore: number | Array<number>    
//     }

//   }

//   constructor() {
//     this.playersInfo = {
//       dealer: {
//         playerHand: [],
//         playerScore: 0
//       },
//       player: {
//         playerHand: [],
//         playerScore: 0
//       }
//     }
//   }

//   getDealerHandValue(): number | Array<number> {
//     if (this.playersInfo.dealer.playerHand.filter((card) => card.rank === 'A').length > 0) {

//     }
//     const value = 
//     return this
//   }

//   getPlayerHandValue(): number | Array<number> {

//   }

// }

class BlackjackGame {
  suits: Array<Suit>
  ranks: Array<Rank>
  deck: Deck
  
  // players: Players

  playerHand: Array<Card> = []
  playerScore = 0
  
  dealerHand: Array<Card> = []
  dealerScore = 0
  
  gameState: 'running' | 'player-win' | 'player-lose' | 'draw'
  
  constructor(args: {suits: Array<Suit>, ranks: Array<Rank>, deck: Deck}) {
    this.deck = args.deck
    this.suits = args.suits
    // this.players = args.players
    this.ranks = args.ranks
    
    this.gameState = 'running'
  }

  run() {
    
    this.drawHands()
    this.displayDealerCurrentHand(true)
    this.displayPlayerCurrentHand()
    this.checkInitialBlackjack()
    
    while (this.gameState === 'running') {
      const command = prompt('Hit(h) or Stand(s) ?  (h/s)');
      
      if (command === 'h') {
        this.playerHits()
      }
      
      if (command === 's') {
        this.playerStands()
      }
    
    }

    console.log(`\nThe result of the game is: ${this.gameState}\n\n`)

  }

  checkInitialBlackjack() {
    if (this.playerScore === 21 && this.dealerScore === 21) {
      this.gameState = 'draw'
      return this.gameState
    }
    if (this.playerScore === 21) {
      this.gameState = 'player-win'
      return this.gameState
    }
    if (this.dealerScore === 21) {
      this.gameState = 'player-lose'
      return this.gameState
    }
  }

  playerHits() {
    this.playerHand.push(this.deck.drawCard())
    this.playerScore = this.computeHandTotalValue(this.playerHand)
    this.displayPlayerCurrentHand()
    if (this.playerScore > 21) {
      this.gameState = 'player-lose'
    }
  }

  playerStands() {
    while (this.dealerScore <= 16) {
      this.dealerHand.push(this.deck.drawCard())
      this.dealerScore = this.computeHandTotalValue(this.dealerHand)
    }

    this.displayDealerCurrentHand()
    this.displayPlayerCurrentHand()
    
    if (this.dealerScore > 21) {
      this.gameState = 'player-win'
      return 
    } else if(this.playerScore === this.dealerScore) {
      this.gameState = 'draw'
      return 
    } else if (this.playerScore < this.dealerScore) {
      this.gameState = 'player-lose'
      return 
    } else {
      this.gameState = 'player-win'
      return 
    }
  }

  drawHands() {
    // this.playerHand = [this.deck.drawCard(), this.deck.drawCard()]
    this.playerHand = [new Card({rank: 'A', suit: 'diamonds'}), new Card({rank: 'A', suit: 'diamonds'})]
    this.playerScore = this.computeHandTotalValue(this.playerHand)

    this.dealerHand = [this.deck.drawCard(), this.deck.drawCard()]
    this.dealerScore = this.computeHandTotalValue(this.dealerHand)
  }

  displayDealerCurrentHand(isFirst = false) {
    if (isFirst) {
      console.log(`Dealer first hand, current value: ${this.computeHandTotalValue([this.dealerHand[0]])}`)
      console.log([this.dealerHand[0]])
      console.log(`\n\n`)
    } else {
      console.log(`Dealer current hand, current value: ${this.computeHandTotalValue(this.dealerHand)}`)
      console.log(this.dealerHand)
      console.log(`\n\n`)
    }
  }
  
  displayPlayerCurrentHand() {
    console.log(`Player current hand, total value: ${this.computeHandTotalValue(this.playerHand)}`)
    console.log(this.playerHand)
    console.log(`\n\n`)
  }

  computeHandTotalValue(hand: Array<Card>) {
    let acePresent = false
    const values = hand.map((card) => {
      if (card.rank === 'A') {
        acePresent = true
      }
      return card.value
    })
    // console.log(values)
    let total = values.reduce((total, num) => total + num)
    if (acePresent) {
      total += 10
    }
    // console.log(total)
    return total
  }


}

export {Suit, Rank, Deck, BlackjackGame}