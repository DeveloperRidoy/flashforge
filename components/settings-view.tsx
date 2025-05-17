"use client"

import type React from "react"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"

export function SettingsView() {
  const { preferences, updatePreferences, dailyGoal, setDailyGoal, decks, exportDeck, importDeck } = useStore()
  const { setTheme } = useTheme()

  const handleThemeChange = (value: string) => {
    setTheme(value)
    updatePreferences({ theme: value as "light" | "dark" | "system" })
  }

  const handleFontChange = (value: string) => {
    updatePreferences({ fontFamily: value as "serif" | "sans" | "mono" })
  }

  const handleAnimationsToggle = (checked: boolean) => {
    updatePreferences({ animationsEnabled: checked })
  }

  const handleDailyGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setDailyGoal(value)
    }
  }

  const handleExport = (deckId: string) => {
    const deckData = exportDeck(deckId)
    const blob = new Blob([deckData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url

    const deck = decks.find((d) => d.id === deckId)
    a.download = `${deck?.name || "deck"}.json`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        importDeck(content)
      }
      reader.readAsText(file)
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Customize your FlashForge experience</p>
      </div>

      <Tabs defaultValue="preferences">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="study">Study Settings</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how FlashForge looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup
                  defaultValue={preferences.theme}
                  onValueChange={handleThemeChange}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Font Style</Label>
                <RadioGroup
                  defaultValue={preferences.fontFamily}
                  onValueChange={handleFontChange}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sans" id="font-sans" />
                    <Label htmlFor="font-sans" className="font-sans">
                      Sans
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="serif" id="font-serif" />
                    <Label htmlFor="font-serif" className="font-serif">
                      Serif
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mono" id="font-mono" />
                    <Label htmlFor="font-mono" className="font-mono">
                      Mono
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable card flip animations</p>
                </div>
                <Switch
                  id="animations"
                  checked={preferences.animationsEnabled}
                  onCheckedChange={handleAnimationsToggle}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Goals</CardTitle>
              <CardDescription>Set your daily study targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="daily-goal">Daily Review Goal</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="daily-goal"
                    type="number"
                    min="1"
                    value={dailyGoal}
                    onChange={handleDailyGoalChange}
                    className="w-24"
                  />
                  <span>cards per day</span>
                </div>
                <p className="text-sm text-muted-foreground">Set a realistic goal to maintain your streak</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Decks</CardTitle>
              <CardDescription>Export your decks to share or back up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {decks.map((deck) => (
                <div key={deck.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{deck.name}</p>
                    <p className="text-sm text-muted-foreground">{deck.cards.length} cards</p>
                  </div>
                  <Button variant="outline" onClick={() => handleExport(deck.id)}>
                    Export
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import Deck</CardTitle>
              <CardDescription>Import a deck from a JSON file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">Select a FlashForge deck JSON file to import</p>
                <Input type="file" accept=".json" onChange={handleImport} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
