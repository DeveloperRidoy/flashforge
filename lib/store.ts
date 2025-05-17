"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"

export interface Card {
  id: string
  front: string
  back: string
  easeFactor: number
  interval: number
  lastReviewed: number | null
  nextDue: number | null
  tags: string[]
}

export interface Deck {
  id: string
  name: string
  description: string
  cards: Card[]
  createdAt: number
  updatedAt: number
}

export interface ReviewLog {
  id: string
  cardId: string
  deckId: string
  rating: "again" | "hard" | "good" | "easy"
  timestamp: number
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  fontFamily: "serif" | "sans" | "mono"
  animationsEnabled: boolean
}

interface StoreState {
  decks: Deck[]
  reviewLogs: ReviewLog[]
  streak: number
  lastReviewDate: number | null
  preferences: UserPreferences
  dailyGoal: number
  cardsReviewedToday: number
  searchResults: { deckId: string; cardId: string; card: Card }[]
  isSearching: boolean
  addDeck: (name: string, description: string) => void
  updateDeck: (deckId: string, updates: Partial<Omit<Deck, "id" | "cards">>) => void
  deleteDeck: (deckId: string) => void
  addCard: (deckId: string, front: string, back: string, tags?: string[]) => void
  updateCard: (deckId: string, cardId: string, updates: Partial<Omit<Card, "id">>) => void
  deleteCard: (deckId: string, cardId: string) => void
  logReview: (deckId: string, cardId: string, rating: "again" | "hard" | "good" | "easy") => void
  updateCardScheduling: (deckId: string, cardId: string, rating: "again" | "hard" | "good" | "easy") => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
  setDailyGoal: (goal: number) => void
  getDueCards: (deckId: string) => Card[]
  getCardsReviewedToday: () => number
  exportDeck: (deckId: string) => string
  importDeck: (deckData: string) => void
  searchCards: (query: string) => void
  clearSearch: () => void
}

// SM-2 algorithm constants
const AGAIN_FACTOR = 0.5
const HARD_FACTOR = 0.8
const GOOD_FACTOR = 1.0
const EASY_FACTOR = 1.3

// Initialize with sample data
const initialDecks: Deck[] = [
  {
    id: "deck-1",
    name: "JavaScript Fundamentals",
    description: "Core concepts of JavaScript programming",
    cards: [
      {
        id: "card-1",
        front: "What is a closure in JavaScript?",
        back: "A closure is a function that has access to its own scope, the scope of the outer function, and the global scope.",
        easeFactor: 2.5,
        interval: 1,
        lastReviewed: null,
        nextDue: Date.now(),
        tags: ["javascript", "functions"],
      },
      {
        id: "card-2",
        front: "What is the difference between `let` and `var`?",
        back: "`let` is block-scoped, while `var` is function-scoped. Variables declared with `let` are not hoisted to the top of their scope.",
        easeFactor: 2.5,
        interval: 1,
        lastReviewed: null,
        nextDue: Date.now(),
        tags: ["javascript", "variables"],
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "deck-2",
    name: "React Hooks",
    description: "Modern React hooks and their usage",
    cards: [
      {
        id: "card-3",
        front: "What is the purpose of `useEffect`?",
        back: "`useEffect` lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.",
        easeFactor: 2.5,
        interval: 1,
        lastReviewed: null,
        nextDue: Date.now(),
        tags: ["react", "hooks"],
      },
      {
        id: "card-4",
        front: "How does `useState` work?",
        back: "`useState` is a Hook that lets you add React state to function components. It returns a stateful value and a function to update it.",
        easeFactor: 2.5,
        interval: 1,
        lastReviewed: null,
        nextDue: Date.now(),
        tags: ["react", "hooks"],
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      decks: initialDecks,
      reviewLogs: [],
      streak: 0,
      lastReviewDate: null,
      preferences: {
        theme: "system",
        fontFamily: "sans",
        animationsEnabled: true,
      },
      dailyGoal: 20,
      cardsReviewedToday: 0,
      searchResults: [],
      isSearching: false,

      addDeck: (name, description) => {
        const newDeck: Deck = {
          id: uuidv4(),
          name,
          description,
          cards: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({ decks: [...state.decks, newDeck] }))
      },

      updateDeck: (deckId, updates) => {
        set((state) => ({
          decks: state.decks.map((deck) =>
            deck.id === deckId ? { ...deck, ...updates, updatedAt: Date.now() } : deck,
          ),
        }))
      },

      deleteDeck: (deckId) => {
        set((state) => ({
          decks: state.decks.filter((deck) => deck.id !== deckId),
        }))
      },

      addCard: (deckId, front, back, tags = []) => {
        const newCard: Card = {
          id: uuidv4(),
          front,
          back,
          easeFactor: 2.5, // Initial ease factor
          interval: 1, // Initial interval in days
          lastReviewed: null,
          nextDue: Date.now(), // Due immediately
          tags,
        }
        set((state) => ({
          decks: state.decks.map((deck) =>
            deck.id === deckId
              ? {
                  ...deck,
                  cards: [...deck.cards, newCard],
                  updatedAt: Date.now(),
                }
              : deck,
          ),
        }))
      },

      updateCard: (deckId, cardId, updates) => {
        set((state) => ({
          decks: state.decks.map((deck) =>
            deck.id === deckId
              ? {
                  ...deck,
                  cards: deck.cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)),
                  updatedAt: Date.now(),
                }
              : deck,
          ),
        }))
      },

      deleteCard: (deckId, cardId) => {
        set((state) => ({
          decks: state.decks.map((deck) =>
            deck.id === deckId
              ? {
                  ...deck,
                  cards: deck.cards.filter((card) => card.id !== cardId),
                  updatedAt: Date.now(),
                }
              : deck,
          ),
        }))
      },

      logReview: (deckId, cardId, rating) => {
        const now = Date.now()
        const today = new Date(now).setHours(0, 0, 0, 0)
        const lastReviewDate = get().lastReviewDate
        const lastReviewDay = lastReviewDate ? new Date(lastReviewDate).setHours(0, 0, 0, 0) : null

        // Update streak
        let streak = get().streak
        if (lastReviewDay === null) {
          streak = 1
        } else if (today - lastReviewDay === 86400000) {
          // One day difference
          streak += 1
        } else if (today - lastReviewDay > 86400000) {
          // More than one day
          streak = 1
        }

        const newLog: ReviewLog = {
          id: uuidv4(),
          cardId,
          deckId,
          rating,
          timestamp: now,
        }

        set((state) => ({
          reviewLogs: [...state.reviewLogs, newLog],
          lastReviewDate: now,
          streak,
          cardsReviewedToday: today === (lastReviewDay || 0) ? state.cardsReviewedToday + 1 : 1,
        }))
      },

      updateCardScheduling: (deckId, cardId, rating) => {
        const deck = get().decks.find((d) => d.id === deckId)
        if (!deck) return

        const card = deck.cards.find((c) => c.id === cardId)
        if (!card) return

        const now = Date.now()
        let { easeFactor, interval } = card

        // Apply SM-2 algorithm
        switch (rating) {
          case "again":
            interval = 1
            easeFactor = Math.max(1.3, easeFactor - 0.2)
            break
          case "hard":
            interval = Math.max(1, Math.ceil(interval * HARD_FACTOR))
            easeFactor = Math.max(1.3, easeFactor - 0.15)
            break
          case "good":
            interval = Math.ceil(interval * easeFactor)
            break
          case "easy":
            interval = Math.ceil(interval * easeFactor * EASY_FACTOR)
            easeFactor = easeFactor + 0.15
            break
        }

        // Calculate next due date
        const nextDue = now + interval * 24 * 60 * 60 * 1000

        get().updateCard(deckId, cardId, {
          easeFactor,
          interval,
          lastReviewed: now,
          nextDue,
        })

        get().logReview(deckId, cardId, rating)
      },

      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }))
      },

      setDailyGoal: (goal) => {
        set({ dailyGoal: goal })
      },

      getDueCards: (deckId) => {
        const now = Date.now()
        const deck = get().decks.find((d) => d.id === deckId)
        if (!deck) return []

        return deck.cards.filter((card) => !card.nextDue || card.nextDue <= now)
      },

      getCardsReviewedToday: () => {
        const today = new Date().setHours(0, 0, 0, 0)
        return get().reviewLogs.filter((log) => new Date(log.timestamp).setHours(0, 0, 0, 0) === today).length
      },

      exportDeck: (deckId) => {
        const deck = get().decks.find((d) => d.id === deckId)
        if (!deck) return ""
        return JSON.stringify(deck)
      },

      importDeck: (deckData) => {
        try {
          const deck = JSON.parse(deckData) as Deck
          // Generate new IDs to avoid conflicts
          const newDeck = {
            ...deck,
            id: uuidv4(),
            cards: deck.cards.map((card) => ({ ...card, id: uuidv4() })),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          set((state) => ({ decks: [...state.decks, newDeck] }))
        } catch (error) {
          console.error("Failed to import deck:", error)
        }
      },

      searchCards: (query: string) => {
        const normalizedQuery = query.toLowerCase().trim()
        const results: { deckId: string; cardId: string; card: Card }[] = []

        get().decks.forEach((deck) => {
          deck.cards.forEach((card) => {
            const frontMatch = card.front.toLowerCase().includes(normalizedQuery)
            const backMatch = card.back.toLowerCase().includes(normalizedQuery)
            const tagMatch = card.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))

            if (frontMatch || backMatch || tagMatch) {
              results.push({
                deckId: deck.id,
                cardId: card.id,
                card,
              })
            }
          })
        })

        set({ searchResults: results, isSearching: true })
      },

      clearSearch: () => {
        set({ searchResults: [], isSearching: false })
      },
    }),
    {
      name: "flashforge-storage",
    },
  ),
)
