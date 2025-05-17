"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flashcard } from "@/components/flashcard"

interface ReviewViewProps {
  deckId: string | null
  onFinish: () => void
}

export function ReviewView({ deckId, onFinish }: ReviewViewProps) {
  const { decks, getDueCards, updateCardScheduling } = useStore()
  const [dueCards, setDueCards] = useState<any[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (deckId) {
      const cards = getDueCards(deckId)
      setDueCards(cards)
      setCurrentCardIndex(0)
      setIsFinished(cards.length === 0)
      setProgress(0)
    }
  }, [deckId, getDueCards])

  const handleRating = (rating: "again" | "hard" | "good" | "easy") => {
    if (deckId && currentCardIndex < dueCards.length) {
      const card = dueCards[currentCardIndex]
      updateCardScheduling(deckId, card.id, rating)

      // Move to next card
      const nextIndex = currentCardIndex + 1
      setCurrentCardIndex(nextIndex)
      setProgress((nextIndex / dueCards.length) * 100)

      if (nextIndex >= dueCards.length) {
        setIsFinished(true)
      }
    }
  }

  const currentDeck = deckId ? decks.find((d) => d.id === deckId) : null
  const currentCard = currentCardIndex < dueCards.length ? dueCards[currentCardIndex] : null

  if (!deckId || !currentDeck) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p>No deck selected</p>
        <Button onClick={onFinish} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Review Complete!</h2>
          <p className="text-muted-foreground mb-6">You've reviewed all due cards in this deck.</p>
          <Button onClick={onFinish}>Back to Dashboard</Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onFinish}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="ml-2">
            <h1 className="text-xl font-bold">{currentDeck.name}</h1>
            <p className="text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {dueCards.length}
            </p>
          </div>
        </div>
      </div>

      <Progress value={progress} className="h-1" />

      {currentCard && (
        <div className="py-6">
          <Flashcard card={currentCard} onRate={handleRating} />
        </div>
      )}
    </div>
  )
}
