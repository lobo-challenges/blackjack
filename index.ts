import {BlackjackGame, Suit, Rank, Deck} from './entities'



// game settings
const suits: Array<Suit> = ['diamonds' , 'clubs' , 'hearts' , 'spades']
const ranks: Array<Rank> = ['A' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' , '10' , 'J' , 'Q' , 'K']
const deck = new Deck({suits, ranks})
// const players = new Players()
const newGame = new BlackjackGame({suits, ranks, deck})
newGame.run()

// newGame.drawHands()
// newGame.displayDealerCurrentHand(true)
// newGame.displayPlayerCurrentHand()
// newGame.checkInitialBlackjack()


// while (newGame.gameState === 'running') {
//   const command = prompt('Hit(h) or Stand(s) ?  (h/s)');
  
//   if (command === 'h') {
//     newGame.playerHits()
//   }
  
//   if (command === 's') {
//     newGame.playerStands()
//   }

// }

