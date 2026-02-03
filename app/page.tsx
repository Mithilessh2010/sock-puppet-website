"use client"

import { useState, useCallback } from "react"
import { HomeScreen } from "@/components/home-screen"
import { PuppetCreator, type PuppetConfig } from "@/components/puppet-creator"
import { TheaterStage } from "@/components/theater-stage"
import { ShareModal } from "@/components/share-modal"
import type { PerformanceFrame } from "@/components/puppet-performer"

type AppState = "home" | "creating" | "performing"

export default function SockPuppetTheater() {
  const [appState, setAppState] = useState<AppState>("home")
  const [puppet, setPuppet] = useState<PuppetConfig | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [currentRecording, setCurrentRecording] = useState<PerformanceFrame[]>([])
  const [currentBackdrop, setCurrentBackdrop] = useState("")

  const handleStartCreating = useCallback(() => {
    setAppState("creating")
  }, [])

  const handlePuppetComplete = useCallback((newPuppet: PuppetConfig) => {
    setPuppet(newPuppet)
    setAppState("performing")
  }, [])

  const handleBackToCreate = useCallback(() => {
    setAppState("creating")
  }, [])

  const handleShare = useCallback((recording: PerformanceFrame[], backdrop: string) => {
    setCurrentRecording(recording)
    setCurrentBackdrop(backdrop)
    setShowShareModal(true)
  }, [])

  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false)
  }, [])

  return (
    <>
      {appState === "home" && (
        <HomeScreen onStart={handleStartCreating} />
      )}

      {appState === "creating" && (
        <PuppetCreator onComplete={handlePuppetComplete} />
      )}

      {appState === "performing" && puppet && (
        <TheaterStage
          puppet={puppet}
          onBack={handleBackToCreate}
          onShare={handleShare}
        />
      )}

      {puppet && (
        <ShareModal
          isOpen={showShareModal}
          onClose={handleCloseShareModal}
          puppet={puppet}
          recording={currentRecording}
          backdrop={currentBackdrop}
        />
      )}
    </>
  )
}
