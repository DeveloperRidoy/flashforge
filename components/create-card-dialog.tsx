"use client"

import type React from "react"

import { useState } from "react"
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

interface CreateCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deckId: string
}

export function CreateCardDialog({ open, onOpenChange, deckId }: CreateCardDialogProps) {
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")
  const [tags, setTags] = useState("")
  const { addCard } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (front.trim() && back.trim()) {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      addCard(deckId, front.trim(), back.trim(), tagArray)
      setFront("")
      setBack("")
      setTags("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>Create a new flashcard for your deck.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front">Front (Question)</Label>
              <Textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="What is the capital of France?"
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="back">Back (Answer)</Label>
              <Textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Paris"
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="geography, europe, capitals"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
