"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (resolvedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.add("light")
    }
  }, [resolvedTheme])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
