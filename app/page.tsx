import MemoryGame from "@/components/memory-game"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto">
        <MemoryGame />
      </div>
    </main>
  )
}
