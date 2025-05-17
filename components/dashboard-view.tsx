"use client"

import { useEffect, useState } from "react"
import { BookOpen, Calendar, Clock, Plus, Target } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StatsChart } from "@/components/stats-chart"
import { CreateDeckDialog } from "@/components/create-deck-dialog"
import { Badge } from "@/components/ui/badge"

interface DashboardViewProps {
  onStartReview: (deckId: string) => void
}

export function DashboardView({ onStartReview }: DashboardViewProps) {
  const { decks, reviewLogs, dailyGoal, streak, searchResults, isSearching } = useStore()
  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false)
  const [cardsReviewedToday, setCardsReviewedToday] = useState(0)
  const [dueCardsByDeck, setDueCardsByDeck] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    // Calculate cards reviewed today
    const today = new Date().setHours(0, 0, 0, 0)
    const reviewedToday = reviewLogs.filter((log) => new Date(log.timestamp).setHours(0, 0, 0, 0) === today).length
    setCardsReviewedToday(reviewedToday)

    // Calculate due cards by deck
    const dueByDeck: { [key: string]: number } = {}
    const now = Date.now()

    decks.forEach((deck) => {
      const dueCards = deck.cards.filter((card) => !card.nextDue || card.nextDue <= now)
      dueByDeck[deck.id] = dueCards.length
    })

    setDueCardsByDeck(dueByDeck)
  }, [decks, reviewLogs])

  const totalDueCards = Object.values(dueCardsByDeck).reduce((sum, count) => sum + count, 0)
  const dailyProgress = Math.min(100, (cardsReviewedToday / dailyGoal) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and review your flashcards</p>
        </div>
        <Button onClick={() => setIsCreateDeckOpen(true)} className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Create Deck
        </Button>
      </div>

      {isSearching && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>{searchResults.length} cards found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.length > 0 ? (
                searchResults.map(({ deckId, cardId, card }) => {
                  const deck = decks.find((d) => d.id === deckId)
                  return (
                    <div
                      key={cardId}
                      className="border rounded-md p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => onStartReview(deckId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          onStartReview(deckId)
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{card.front}</h3>
                          <p className="text-sm text-muted-foreground">{card.back}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">{deck?.name}</div>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            Review
                          </Button>
                        </div>
                      </div>
                      {card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {card.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <p>No cards found matching your search.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cardsReviewedToday} / {dailyGoal}
            </div>
            <Progress value={dailyProgress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground mt-2">Keep reviewing daily!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Cards</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDueCards}</div>
            <p className="text-xs text-muted-foreground mt-2">Cards to review today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{decks.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Across all subjects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Review Activity</CardTitle>
            <CardDescription>Your review history over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsChart />
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Due Cards by Deck</CardTitle>
            <CardDescription>Cards that need to be reviewed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {decks.map((deck) => (
                <div key={deck.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{deck.name}</p>
                    <p className="text-sm text-muted-foreground">{dueCardsByDeck[deck.id] || 0} cards due</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStartReview(deck.id)}
                    disabled={!dueCardsByDeck[deck.id]}
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsCreateDeckOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Deck
            </Button>
          </CardFooter>
        </Card>
      </div>

      <CreateDeckDialog open={isCreateDeckOpen} onOpenChange={setIsCreateDeckOpen} />
    </div>
  )
}
