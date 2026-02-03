"use client"

import { useState, useCallback } from "react"
import type { PuppetConfig } from "./puppet-creator"
import type { PerformanceFrame } from "./puppet-performer"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  puppet: PuppetConfig
  recording: PerformanceFrame[]
  backdrop: string
}

export function ShareModal({ isOpen, onClose, puppet, recording, backdrop }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const performanceData = {
    puppet: {
      name: puppet.name,
      sockColor: puppet.sockColor.name,
      eyeType: puppet.eyeType,
      mouthType: puppet.mouthType,
      hairType: puppet.hairType,
      accessory: puppet.accessory,
    },
    backdrop,
    frameCount: recording.length,
    duration: recording.length > 0 
      ? Math.round((recording[recording.length - 1].timestamp - recording[0].timestamp) / 1000)
      : 0,
  }

  const shareText = `I made ${puppet.name || "a sock puppet"} perform "${backdrop.replace(/-/g, " ")}" for ${performanceData.duration} seconds in the Sock Puppet Theater! It was weird and I loved it.`

  const handleCopyLink = useCallback(() => {
    const shareUrl = `${window.location.origin}?show=${btoa(JSON.stringify(performanceData))}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [window.location.origin]) // Removed performanceData from dependency array

  const handleCopyText = useCallback(() => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [shareText]) // Dependency array remains the same

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50">
      <div 
        className="w-full max-w-lg bg-card sketchy-border p-6 paper-texture relative"
        style={{ transform: "rotate(-1deg)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center font-mono text-2xl text-foreground hover:text-primary transition-colors"
          style={{ transform: "rotate(5deg)" }}
        >
          x
        </button>

        <h2 
          className="text-3xl font-mono text-foreground mb-2 text-center"
          style={{ transform: "rotate(2deg)" }}
        >
          show off your show!
        </h2>
        
        <p className="text-muted-foreground font-sans text-center mb-6">
          (because the world needs to see this)
        </p>

        <div className="sketchy-border bg-muted p-4 mb-6" style={{ transform: "rotate(1deg)" }}>
          <div className="grid grid-cols-2 gap-4 text-sm font-sans">
            <div>
              <span className="text-muted-foreground">star:</span>
              <p className="font-bold text-foreground">{puppet.name || "Unnamed Friend"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">scene:</span>
              <p className="font-bold text-foreground">{backdrop.replace(/-/g, " ")}</p>
            </div>
            <div>
              <span className="text-muted-foreground">runtime:</span>
              <p className="font-bold text-foreground">{performanceData.duration}s of pure art</p>
            </div>
            <div>
              <span className="text-muted-foreground">movements:</span>
              <p className="font-bold text-foreground">{recording.length} wiggles</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCopyText}
            className="w-full px-4 py-3 font-sans text-lg sketchy-border bg-primary text-primary-foreground hover:scale-105 transition-transform"
            style={{ transform: "rotate(-1deg)" }}
          >
            {copied ? "copied to clipboard!" : "copy brag text"}
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full px-4 py-3 font-sans text-lg sketchy-border bg-secondary text-secondary-foreground hover:scale-105 transition-transform"
            style={{ transform: "rotate(1deg)" }}
          >
            copy share link
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className="w-full px-4 py-3 font-sans text-sm sketchy-border bg-muted text-foreground hover:scale-105 transition-transform"
            style={{ transform: "rotate(-0.5deg)" }}
          >
            {showCode ? "hide the nerdy stuff" : "show the nerdy stuff"}
          </button>
        </div>

        {showCode && (
          <div 
            className="mt-4 p-3 bg-foreground text-background font-mono text-xs overflow-auto max-h-32 sketchy-border"
            style={{ transform: "rotate(0.5deg)" }}
          >
            <pre>{JSON.stringify(performanceData, null, 2)}</pre>
          </div>
        )}

        <p className="text-center text-muted-foreground font-sans text-xs mt-4">
          (full video export coming soon when we figure out how videos work)
        </p>
      </div>
    </div>
  )
}
