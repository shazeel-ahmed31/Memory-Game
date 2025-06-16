"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, Timer } from "lucide-react"

interface GameCard {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const EMOJIS = ["🎮", "🎯", "🎪", "🎨", "🎭", "🎪", "🎸", "🎺"]

export default function MemoryGame() {
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [timer, setTimer] = useState(0)

  // Initialize game
  const initializeGame = () => {
    const gameEmojis = [...EMOJIS, ...EMOJIS] // Create pairs
    const shuffledCards = gameEmojis
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameStarted(false)
    setGameWon(false)
    setTimer(0)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameWon])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [])

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!gameStarted) {
      setGameStarted(true)
    }

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return
    }

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Update card state
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c)))
          setMatchedPairs((prev) => prev + 1)
          setFlippedCards([])
        }, 500)
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c)))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Check for game win
  useEffect(() => {
    if (matchedPairs === EMOJIS.length && gameStarted) {
      setGameWon(true)
    }
  }, [matchedPairs, gameStarted])

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Memory Game</h1>
        <p className="text-white/80">Find all matching pairs!</p>
      </div>

      {/* Game Stats */}
      <div className="flex justify-center gap-4 mb-6">
        <Badge variant="secondary" className="px-4 py-2">
          <Timer className="w-4 h-4 mr-2" />
          {formatTime(timer)}
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          Moves: {moves}
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          Pairs: {matchedPairs}/{EMOJIS.length}
        </Badge>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`aspect-square cursor-pointer transition-all duration-300 hover:scale-105 ${
              card.isMatched
                ? "bg-green-100 border-green-300"
                : card.isFlipped
                  ? "bg-blue-100 border-blue-300"
                  : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <CardContent className="flex items-center justify-center h-full p-0">
              {card.isFlipped || card.isMatched ? (
                <span className="text-3xl">{card.emoji}</span>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">?</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Game Won Message */}
      {gameWon && (
        <div className="text-center mb-6 p-6 bg-white/90 rounded-lg">
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
