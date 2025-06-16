class MemoryGame {
  constructor() {
    this.emojis = ["🎮", "🎯", "🎪", "🎨", "🎭", "🎸", "🎺", "⚽"]
    this.cards = []
    this.flippedCards = []
    this.matchedPairs = 0
    this.moves = 0
    this.gameStarted = false
    this.gameWon = false
    this.timer = 0
    this.timerInterval = null

    this.gameBoard = document.getElementById("game-board")
    this.timerElement = document.getElementById("timer")
    this.movesElement = document.getElementById("moves")
    this.pairsElement = document.getElementById("pairs")
    this.winMessage = document.getElementById("win-message")
    this.winStats = document.getElementById("win-stats")
    this.newGameBtn = document.getElementById("new-game-btn")

    this.init()
    this.bindEvents()
  }

  init() {
    this.createCards()
    this.renderCards()
    this.resetStats()
  }

  createCards() {
    const gameEmojis = [...this.emojis, ...this.emojis]
    this.cards = gameEmojis.map((emoji, index) => ({
      id: index,
      emoji: emoji,
      isFlipped: false,
      isMatched: false,
    }))
    this.shuffleCards()
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  renderCards() {
    this.gameBoard.innerHTML = ""
    this.cards.forEach((card) => {
      const cardElement = document.createElement("div")
      cardElement.className = "card"
      cardElement.dataset.cardId = card.id

      if (card.isFlipped || card.isMatched) {
        cardElement.innerHTML = `<div class="card-front">${card.emoji}</div>`
        cardElement.classList.add(card.isMatched ? "matched" : "flipped")
      } else {
        cardElement.innerHTML = '<div class="card-back">?</div>'
      }

      cardElement.addEventListener("click", () => this.handleCardClick(card.id))
      this.gameBoard.appendChild(cardElement)
    })
  }

  handleCardClick(cardId) {
    if (!this.gameStarted) {
      this.startGame()
    }

    const card = this.cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
      return
    }

    card.isFlipped = true
    this.flippedCards.push(cardId)
    this.renderCards()

    if (this.flippedCards.length === 2) {
      this.moves++
      this.updateStats()
      this.checkForMatch()
    }
  }

  checkForMatch() {
    const [firstId, secondId] = this.flippedCards
    const firstCard = this.cards.find((c) => c.id === firstId)
    const secondCard = this.cards.find((c) => c.id === secondId)

    // Disable all cards temporarily
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.add("disabled")
    })

    setTimeout(() => {
      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        firstCard.isMatched = true
        secondCard.isMatched = true
        this.matchedPairs++
        this.checkForWin()
      } else {
        // No match
        firstCard.isFlipped = false
        secondCard.isFlipped = false
      }

      this.flippedCards = []
      this.renderCards()
      this.updateStats()

      // Re-enable cards
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("disabled")
      })
    }, 1000)
  }

  checkForWin() {
    if (this.matchedPairs === this.emojis.length) {
      this.gameWon = true
      this.stopTimer()
      this.showWinMessage()
    }
  }

  startGame() {
    this.gameStarted = true
    this.startTimer()
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer++
      this.updateTimer()
    }, 1000)
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }

  updateTimer() {
    const minutes = Math.floor(this.timer / 60)
    const seconds = this.timer % 60
    this.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  updateStats() {
    this.movesElement.textContent = this.moves
    this.pairsElement.textContent = `${this.matchedPairs}/${this.emojis.length}`
  }

  resetStats() {
    this.flippedCards = []
    this.matchedPairs = 0
    this.moves = 0
    this.gameStarted = false
    this.gameWon = false
    this.timer = 0
    this.stopTimer()
    this.updateTimer()
    this.updateStats()
    this.winMessage.classList.add("hidden")
  }

  showWinMessage() {
    const minutes = Math.floor(this.timer / 60)
    const seconds = this.timer % 60
    const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`

    this.winStats.textContent = `You won in ${this.moves} moves and ${timeString}!`
    this.winMessage.classList.remove("hidden")
  }

  newGame() {
    this.resetStats()
    this.createCards()
    this.renderCards()
  }

  bindEvents() {
    this.newGameBtn.addEventListener("click", () => this.newGame())

    // Close win message when clicking outside
    this.winMessage.addEventListener("click", (e) => {
      if (e.target === this.winMessage) {
        this.winMessage.classList.add("hidden")
      }
    })
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MemoryGame()
})
