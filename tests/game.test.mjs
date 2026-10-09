import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EMOJIS,newGame,flipCard,resolvePair,formatTime} from '../lib/game.ts';
test('creates exactly eight unique pairs and 16 unique card IDs',()=>{
 const game=newGame(()=>0.5);assert.equal(new Set(EMOJIS).size,8);assert.equal(new Set(game.cards.map(c=>c.id)).size,16);
 for(const emoji of EMOJIS)assert.equal(game.cards.filter(c=>c.emoji===emoji).length,2);
});
test('moves count pairs, repeated or third selections do not change state',()=>{
 let game=newGame(()=>0.5);assert.equal(flipCard(game,-1),game);game=flipCard(game,0);assert.equal(game.moves,0);assert.equal(flipCard(game,0),game);
 game=flipCard(game,1);assert.equal(game.moves,1);assert.equal(flipCard(game,2),game);
 game=resolvePair(game);assert.equal(game.matchedPairs,0);assert.ok(game.cards.every(c=>!c.isFlipped));
});
test('matching all pairs wins, matched cards cannot count twice, restart is fresh',()=>{
 let game=newGame(()=>0.5);
 for(let id=0;id<8;id++){game=resolvePair(flipCard(flipCard(game,id),id+8));assert.equal(flipCard(game,id),game);}
 assert.equal(game.won,true);assert.equal(game.matchedPairs,8);assert.equal(game.moves,8);
 const reset=newGame();assert.equal(reset.started,false);assert.equal(reset.moves,0);assert.equal(reset.won,false);assert.equal(reset.matchedPairs,0);
});
test('state transitions do not mutate previous state and time formatting crosses minutes',()=>{
 const game=newGame();const flipped=flipCard(game,0);assert.equal(game.started,false);assert.equal(flipped.started,true);assert.equal(formatTime(65),'1:05');
});
