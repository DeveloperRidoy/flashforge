"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditDeckDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deckId: string
}

export function EditDeckDialog({ open, onOpenChange, deckId }: EditDeckDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const { decks, updateDeck } = useStore()

  useEffect(() => {
    if (open && deckId) {
      const deck = decks.find((d) => d.id === deckId)
      if (deck) {
        setName(deck.name)
        setDescription(deck.description)
      }
    }
  }, [open, deckId, decks])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      updateDeck(deckId, {
        name: name.trim(),
        description: description.trim(),
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
            <DialogDescription>Update the details of your flashcard deck.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Deck Name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
