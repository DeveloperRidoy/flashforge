"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useStore } from "@/lib/store"

export function AppHeader() {
  const { streak, searchCards, clearSearch } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim()) {
      searchCards(query)
    } else {
      clearSearch()
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    clearSearch()
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="w-full flex items-center justify-between">
          <div className="hidden md:flex">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search cards..."
                className="w-full bg-background pl-8 md:w-[240px] lg:w-[320px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                  🔥 {streak} day streak
                </span>
              </div>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
