"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateDeckDialog } from "@/components/create-deck-dialog"
import { CreateCardDialog } from "@/components/create-card-dialog"
import { EditDeckDialog } from "@/components/edit-deck-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeckViewProps {
  onStartReview: (deckId: string) => void
}

export function DeckView({ onStartReview }: DeckViewProps) {
  const { decks, deleteDeck } = useStore()
  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false)
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false)
  const [isEditDeckOpen, setIsEditDeckOpen] = useState(false)
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)

  const handleAddCard = (deckId: string) => {
    setSelectedDeckId(deckId)
    setIsCreateCardOpen(true)
  }

  const handleEditDeck = (deckId: string) => {
    setSelectedDeckId(deckId)
    setIsEditDeckOpen(true)
  }

  const handleDeleteDeck = (deckId: string) => {
    deleteDeck(deckId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Decks</h1>
          <p className="text-muted-foreground">Manage your flashcard decks and cards</p>
        </div>
        <Button onClick={() => setIsCreateDeckOpen(true)} className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Create Deck
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => {
          const dueCards = deck.cards.filter((card) => !card.nextDue || card.nextDue <= Date.now()).length

          return (
            <Card key={deck.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>{deck.name}</CardTitle>
                  <CardDescription>{deck.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditDeck(deck.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Deck
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Deck
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the deck and all its cards. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteDeck(deck.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>{deck.cards.length} cards total</p>
                  <p>{dueCards} cards due for review</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleAddCard(deck.id)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Card
                </Button>
                <Button onClick={() => onStartReview(deck.id)} disabled={dueCards === 0}>
                  Review
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <CreateDeckDialog open={isCreateDeckOpen} onOpenChange={setIsCreateDeckOpen} />

      {selectedDeckId && (
        <>
          <CreateCardDialog open={isCreateCardOpen} onOpenChange={setIsCreateCardOpen} deckId={selectedDeckId} />
          <EditDeckDialog open={isEditDeckOpen} onOpenChange={setIsEditDeckOpen} deckId={selectedDeckId} />
        </>
      )}
    </div>
  )
}
