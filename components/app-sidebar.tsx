"use client"

import { BookOpen, Home, Settings } from "lucide-react"
import { useStore } from "@/lib/store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  currentView: string
  onNavigate: (view: "dashboard" | "review" | "decks" | "settings") => void
}

export function AppSidebar({ currentView, onNavigate }: AppSidebarProps) {
  const { decks } = useStore()

  return (
    <Sidebar>
      <SidebarHeader className="border-b py-4">
        <div className="flex items-center px-2">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FlashForge</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentView === "dashboard"} onClick={() => onNavigate("dashboard")}>
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentView === "decks"} onClick={() => onNavigate("decks")}>
                  <BookOpen className="h-4 w-4" />
                  <span>Decks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentView === "settings"} onClick={() => onNavigate("settings")}>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My Decks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {decks.map((deck) => (
                <SidebarMenuItem key={deck.id}>
                  <SidebarMenuButton onClick={() => onNavigate("decks")}>
                    <span>{deck.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span>FlashForge v1.0</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
