"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { DashboardView } from "@/components/dashboard-view"
import { ReviewView } from "@/components/review-view"
import { DeckView } from "@/components/deck-view"
import { SettingsView } from "@/components/settings-view"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

type AppView = "dashboard" | "review" | "decks" | "settings"

export function AppShell() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard")
  const [activeReviewDeckId, setActiveReviewDeckId] = useState<string | null>(null)
  const { decks } = useStore()

  const startReview = (deckId: string) => {
    setActiveReviewDeckId(deckId)
    setCurrentView("review")
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView onStartReview={startReview} />
      case "review":
        return <ReviewView deckId={activeReviewDeckId} onFinish={() => setCurrentView("dashboard")} />
      case "decks":
        return <DeckView onStartReview={startReview} />
      case "settings":
        return <SettingsView />
      default:
        return <DashboardView onStartReview={startReview} />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar currentView={currentView} onNavigate={setCurrentView} />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">{renderView()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
