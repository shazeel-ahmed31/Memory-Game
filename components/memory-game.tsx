"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, Timer } from "lucide-react"

import { EMOJIS, newGame, flipCard, resolvePair, formatTime, type GameState } from '@/lib/game'

export default function MemoryGame() {
  const [game, setGame] = useState<GameState | null>(null)
  const [timer, setTimer] = useState(0)
  const initializeGame = () => { setGame(newGame()); setTimer(0) }
  useEffect(() => { initializeGame() }, [])
  useEffect(() => {
    if (!game?.started || game.won) return
    const interval = setInterval(() => setTimer(value => value + 1), 1000)
    return () => clearInterval(interval)
  }, [game?.started, game?.won])
  useEffect(() => {
    if (game?.flippedCards.length !== 2) return
    const timeout = setTimeout(() => setGame(current => current ? resolvePair(current) : current), 800)
    return () => clearTimeout(timeout)
  }, [game])
  const handleCardClick = (id:number) => setGame(current => current ? flipCard(current,id) : current)
  if (!game) return <p className="text-white text-center" role="status">Preparing game…</p>
  const {cards,moves,matchedPairs,won:gameWon} = game

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Memory Game</h1>
        <p className="text-white/80">Find all matching pairs!</p>
      </div>

      {/* Game Stats */}
      <div className="flex justify-center gap-2 sm:gap-4 flex-wrap mb-6">
        <Badge variant="secondary" className="px-3 py-2">
          <Timer className="w-4 h-4 mr-2" />
          {formatTime(timer)}
        </Badge>
        <Badge variant="secondary" className="px-3 py-2">
          Moves: {moves}
        </Badge>
        <Badge variant="secondary" className="px-3 py-2">
          Pairs: {matchedPairs}/{EMOJIS.length}
        </Badge>
      </div>

      <p className="sr-only" aria-live="polite">Moves: {moves}. Matched pairs: {matchedPairs} of {EMOJIS.length}.</p>
      {/* Game Board */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card) => (
          <button
            type="button"
            aria-label={card.isFlipped || card.isMatched ? `Card ${cards.indexOf(card)+1}: ${card.emoji}${card.isMatched ? ", matched" : ""}` : `Hidden card ${cards.indexOf(card)+1}`}
            aria-disabled={card.isMatched || card.isFlipped || game.flippedCards.length === 2}
            key={card.id}
            className={`aspect-square rounded-lg border shadow-sm cursor-pointer transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white ${
              card.isMatched
                ? "bg-green-100 border-green-300"
                : card.isFlipped
                  ? "bg-blue-100 border-blue-300"
                  : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <span className="flex items-center justify-center h-full p-0">
              {card.isFlipped || card.isMatched ? (
                <span className="text-3xl">{card.emoji}</span>
              ) : (
                <span className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">?</span>
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Game Won Message */}
      {gameWon && (
        <div role="status" className="text-center mb-6 p-6 bg-white/90 rounded-lg">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
          <p className="text-gray-600">
            You won in {moves} moves and {formatTime(timer)}!
          </p>
        </div>
      )}

      {/* Reset Button */}
      <div className="text-center">
        <Button onClick={initializeGame} className="bg-white text-purple-600 hover:bg-gray-100" size="lg">
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
      </div>
    </div>
  )
}
