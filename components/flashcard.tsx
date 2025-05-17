"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, type PanInfo } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useMobile } from "@/hooks/use-mobile"

interface FlashcardProps {
  card: any
  onRate: (rating: "again" | "hard" | "good" | "easy") => void
}

export function Flashcard({ card, onRate }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { preferences } = useStore()
  const { animationsEnabled } = preferences
  const isMobile = useMobile()
  const controls = useAnimation()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)

  useEffect(() => {
    // Focus the button when the component mounts
    if (buttonRef.current && !isFlipped) {
      buttonRef.current.focus()
    }
  }, [isFlipped])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter" || e.code === "Space") {
      e.preventDefault()
      handleFlip()
    } else if (isFlipped) {
      if (e.key === "1" || e.key === "a") {
        onRate("again")
        setIsFlipped(false)
      } else if (e.key === "2" || e.key === "h") {
        onRate("hard")
        setIsFlipped(false)
      } else if (e.key === "3" || e.key === "g") {
        onRate("good")
        setIsFlipped(false)
      } else if (e.key === "4" || e.key === "e") {
        onRate("easy")
        setIsFlipped(false)
      }
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50 // minimum distance required for a swipe

    if (Math.abs(info.offset.x) > threshold) {
      // Horizontal swipe
      if (info.offset.x > 0) {
        // Swipe right
        setSwipeDirection("right")
        if (isFlipped) {
          onRate("easy")
          setIsFlipped(false)
        } else {
          handleFlip()
        }
      } else {
        // Swipe left
        setSwipeDirection("left")
        if (isFlipped) {
          onRate("again")
          setIsFlipped(false)
        } else {
          handleFlip()
        }
      }
    } else if (Math.abs(info.offset.y) > threshold) {
      // Vertical swipe
      if (info.offset.y < 0) {
        // Swipe up
        setSwipeDirection("up")
        if (isFlipped) {
          onRate("good")
          setIsFlipped(false)
        }
      } else {
        // Swipe down
        setSwipeDirection("down")
        if (isFlipped) {
          onRate("hard")
          setIsFlipped(false)
        }
      }
    }

    // Reset animation
    controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } })

    // Clear swipe direction after a short delay
    setTimeout(() => setSwipeDirection(null), 300)
  }

  const variants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.4 },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.4 },
    },
  }

  const contentVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0 },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0 },
    },
  }

  return (
    <div
      className="flex flex-col items-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label="Flashcard"
    >
      <div className="w-full max-w-xl perspective">
        <motion.div
          className="w-full relative preserve-3d cursor-pointer"
          animate={controls}
          drag={isMobile}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 0.98 }}
        >
          <motion.div
            className="w-full relative preserve-3d"
            animate={isFlipped ? "back" : "front"}
            variants={animationsEnabled ? variants : undefined}
            onClick={!isMobile ? handleFlip : undefined}
            style={{ minHeight: "300px" }}
          >
            <Card className={`absolute w-full backface-hidden ${!isFlipped ? "z-10" : "z-0"}`}>
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="text-lg md:text-xl whitespace-pre-wrap">{card.front}</div>
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {card.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <motion.div
              className="absolute w-full backface-hidden"
              style={{ rotateY: 180 }}
              variants={animationsEnabled ? contentVariants : undefined}
            >
              <Card className="w-full">
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <div className="text-lg md:text-xl whitespace-pre-wrap">{card.back}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {isMobile && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          <p>Swipe to flip card and rate</p>
          {isFlipped && (
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="text-right">← Swipe left: Again</div>
              <div className="text-left">Swipe right: Easy →</div>
              <div className="text-right">↑ Swipe up: Good</div>
              <div className="text-left">Swipe down: Hard ↓</div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 mt-8">
        {isFlipped ? (
          <>
            <Button
              variant="destructive"
              onClick={() => {
                onRate("again")
                setIsFlipped(false)
              }}
            >
              Again (1)
            </Button>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
              onClick={() => {
                onRate("hard")
                setIsFlipped(false)
              }}
            >
              Hard (2)
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500/10"
              onClick={() => {
                onRate("good")
                setIsFlipped(false)
              }}
            >
              Good (3)
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
              onClick={() => {
                onRate("easy")
                setIsFlipped(false)
              }}
            >
              Easy (4)
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={handleFlip}
            ref={buttonRef}
            className="focus:ring-2 focus:ring-primary focus:outline-none"
          >
            Show Answer (Space)
          </Button>
        )}
      </div>
    </div>
  )
}
