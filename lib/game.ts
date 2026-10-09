export interface GameCard { id: number; emoji: string; isFlipped: boolean; isMatched: boolean }
export interface GameState { cards: GameCard[]; flippedCards: number[]; matchedPairs: number; moves: number; started: boolean; won: boolean }
export const EMOJIS = ['🎮','🎯','🎪','🎨','🎭','⚽','🎸','🎺'];
export function newGame(random: () => number = Math.random): GameState {
 const cards = [...EMOJIS,...EMOJIS].map((emoji,id)=>({id,emoji,isFlipped:false,isMatched:false}));
 for(let i=cards.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [cards[i],cards[j]]=[cards[j],cards[i]]; }
 return {cards,flippedCards:[],matchedPairs:0,moves:0,started:false,won:false};
}
export function flipCard(state:GameState,id:number):GameState {
 const card=state.cards.find(card=>card.id===id);
 if(!card || card.isFlipped || card.isMatched || state.flippedCards.length===2 || state.won) return state;
 const flippedCards=[...state.flippedCards,id];
 return {...state,started:true,flippedCards,moves:state.moves+(flippedCards.length===2?1:0),cards:state.cards.map(card=>card.id===id?{...card,isFlipped:true}:card)};
}
export function resolvePair(state:GameState):GameState {
 if(state.flippedCards.length!==2)return state;
 const [a,b]=state.flippedCards;
 const matched=state.cards.find(card=>card.id===a)!.emoji===state.cards.find(card=>card.id===b)!.emoji;
 const matchedPairs=state.matchedPairs+(matched?1:0);
 return {...state,flippedCards:[],matchedPairs,won:matchedPairs===EMOJIS.length,cards:state.cards.map(card=>card.id===a||card.id===b?{...card,isMatched:matched,isFlipped:matched}:card)};
}
export function formatTime(seconds:number):string {return `${Math.floor(seconds/60)}:${(seconds%60).toString().padStart(2,'0')}`;}
