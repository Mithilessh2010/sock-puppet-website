"use client"

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import type { PuppetConfig } from "./puppet-creator"

interface PuppetPerformerProps {
  puppet: PuppetConfig
  isRecording?: boolean
  playbackData?: PerformanceFrame[]
  onFrame?: (frame: PerformanceFrame) => void
}

interface PerformanceFrame {
  x: number
  y: number
  rotation: number
  mouthOpen: boolean
  timestamp: number
}

export function PuppetPerformer({ 
  puppet, 
  isRecording = false,
  playbackData,
  onFrame 
}: PuppetPerformerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [mouthOpen, setMouthOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const playbackIndexRef = useRef(0)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (playbackData) return
    setIsDragging(true)
    setMouthOpen(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [playbackData])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    setMouthOpen(false)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current || playbackData) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY
    
    const clampedX = Math.max(-centerX + 80, Math.min(centerX - 80, x))
    const clampedY = Math.max(-centerY + 100, Math.min(centerY - 50, y))
    
    const newRotation = (clampedX / centerX) * 15
    
    setPosition({ x: clampedX, y: clampedY })
    setRotation(newRotation)

    if (isRecording && onFrame) {
      onFrame({
        x: clampedX,
        y: clampedY,
        rotation: newRotation,
        mouthOpen: true,
        timestamp: Date.now(),
      })
    }
  }, [isDragging, isRecording, onFrame, playbackData])

  useEffect(() => {
    if (!playbackData || playbackData.length === 0) return

    playbackIndexRef.current = 0
    const startTime = Date.now()
    const firstFrameTime = playbackData[0].timestamp

    const animate = () => {
      const elapsed = Date.now() - startTime
      
      while (
        playbackIndexRef.current < playbackData.length - 1 &&
        playbackData[playbackIndexRef.current + 1].timestamp - firstFrameTime <= elapsed
      ) {
        playbackIndexRef.current++
      }

      const frame = playbackData[playbackIndexRef.current]
      setPosition({ x: frame.x, y: frame.y })
      setRotation(frame.rotation)
      setMouthOpen(frame.mouthOpen)

      if (playbackIndexRef.current < playbackData.length - 1) {
        requestAnimationFrame(animate)
      } else {
        setMouthOpen(false)
      }
    }

    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [playbackData])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <div
        className="absolute left-1/2 top-1/2 transition-transform duration-75"
        style={{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${rotation}deg)`,
        }}
      >
        <AnimatedPuppet puppet={puppet} mouthOpen={mouthOpen} />
      </div>
    </div>
  )
}

function AnimatedPuppet({ puppet, mouthOpen }: { puppet: PuppetConfig; mouthOpen: boolean }) {
  return (
    <div className="relative w-40 md:w-52 h-56 md:h-72">
      <svg
        viewBox="0 0 200 280"
        className={`w-full h-full ${!mouthOpen ? 'animate-bounce-soft' : ''}`}
        style={{ filter: "drop-shadow(6px 6px 0 rgba(0,0,0,0.3))" }}
      >
        <defs>
          <pattern id="perf-stripes" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
          </pattern>
          <pattern id="perf-dots" patternUnits="userSpaceOnUse" width="15" height="15">
            <circle cx="7.5" cy="7.5" r="3" fill="rgba(255,255,255,0.4)" />
          </pattern>
          <pattern id="perf-argyle" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="rgba(255,255,255,0.2)" />
          </pattern>
        </defs>

        <g transform="translate(100, 140)">
          <ellipse
            cx="0"
            cy="0"
            rx="65"
            ry="100"
            fill={puppet.sockColor.value}
            className={mouthOpen ? "" : "animate-wobble"}
            style={{ transformOrigin: "center" }}
          />
          
          {puppet.sockColor.pattern === "stripes" && (
            <ellipse cx="0" cy="0" rx="65" ry="100" fill="url(#perf-stripes)" />
          )}
          {puppet.sockColor.pattern === "dots" && (
            <ellipse cx="0" cy="0" rx="65" ry="100" fill="url(#perf-dots)" />
          )}
          {puppet.sockColor.pattern === "argyle" && (
            <ellipse cx="0" cy="0" rx="65" ry="100" fill="url(#perf-argyle)" />
          )}

          <PerformerHair type={puppet.hairType} />

          <PerformerEyes type={puppet.eyeType} mouthOpen={mouthOpen} />

          <PerformerMouth type={puppet.mouthType} isOpen={mouthOpen} />

          <PerformerAccessory type={puppet.accessory} />
        </g>
      </svg>
    </div>
  )
}

function PerformerEyes({ type, mouthOpen }: { type: string; mouthOpen: boolean }) {
  const eyeY = -40

  if (type === "googly-small") {
    return (
      <g>
        <circle cx="-25" cy={eyeY} r="12" fill="white" stroke="#333" strokeWidth="2" />
        <circle 
          cx="-25" 
          cy={eyeY + (mouthOpen ? 2 : 4)} 
          r="6" 
          fill="#333" 
          className={mouthOpen ? "" : "animate-wiggle"} 
          style={{ transformOrigin: "-25px -36px", transition: "cy 0.1s" }} 
        />
        <circle cx="25" cy={eyeY} r="12" fill="white" stroke="#333" strokeWidth="2" />
        <circle 
          cx="25" 
          cy={eyeY + (mouthOpen ? 2 : 4)} 
          r="6" 
          fill="#333" 
          className={mouthOpen ? "" : "animate-wiggle"} 
          style={{ transformOrigin: "25px -36px", animationDelay: "0.1s", transition: "cy 0.1s" }} 
        />
      </g>
    )
  }

  if (type === "googly-big") {
    return (
      <g>
        <circle cx="-22" cy={eyeY - 5} r="22" fill="white" stroke="#333" strokeWidth="3" />
        <circle 
          cx="-22" 
          cy={eyeY + (mouthOpen ? 0 : 5)} 
          r="10" 
          fill="#333" 
          className={mouthOpen ? "" : "animate-wiggle"} 
          style={{ transformOrigin: "-22px -40px", transition: "cy 0.1s" }} 
        />
        <circle cx="22" cy={eyeY - 5} r="22" fill="white" stroke="#333" strokeWidth="3" />
        <circle 
          cx="22" 
          cy={eyeY + (mouthOpen ? 0 : 5)} 
          r="10" 
          fill="#333" 
          className={mouthOpen ? "" : "animate-wiggle"} 
          style={{ transformOrigin: "22px -40px", animationDelay: "0.15s", transition: "cy 0.1s" }} 
        />
      </g>
    )
  }

  if (type === "button-red") {
    return (
      <g>
        <circle cx="-25" cy={eyeY} r="14" fill="#c0392b" stroke="#333" strokeWidth="2" />
        <circle cx="-25" cy={eyeY} r="3" fill="#333" />
        <circle cx="-25" cy={eyeY - 6} r="2" fill="#333" />
        <circle cx="25" cy={eyeY} r="14" fill="#c0392b" stroke="#333" strokeWidth="2" />
        <circle cx="25" cy={eyeY} r="3" fill="#333" />
        <circle cx="25" cy={eyeY - 6} r="2" fill="#333" />
      </g>
    )
  }

  if (type === "button-blue") {
    return (
      <g>
        <circle cx="-25" cy={eyeY} r="14" fill="#5c8fd4" stroke="#333" strokeWidth="2" />
        <circle cx="-25" cy={eyeY} r="3" fill="#333" />
        <circle cx="-25" cy={eyeY - 6} r="2" fill="#333" />
        <circle cx="25" cy={eyeY} r="14" fill="#5c8fd4" stroke="#333" strokeWidth="2" />
        <circle cx="25" cy={eyeY} r="3" fill="#333" />
        <circle cx="25" cy={eyeY - 6} r="2" fill="#333" />
      </g>
    )
  }

  if (type === "mismatched") {
    return (
      <g>
        <circle cx="-25" cy={eyeY} r="18" fill="white" stroke="#333" strokeWidth="2" />
        <circle 
          cx="-25" 
          cy={eyeY + (mouthOpen ? 0 : 4)} 
          r="8" 
          fill="#333" 
          className={mouthOpen ? "" : "animate-wiggle"} 
          style={{ transformOrigin: "-25px -36px", transition: "cy 0.1s" }} 
        />
        <circle cx="25" cy={eyeY + 5} r="12" fill="#e85d4c" stroke="#333" strokeWidth="2" />
        <circle cx="25" cy={eyeY + 5} r="2" fill="#333" />
        <circle cx="25" cy={eyeY} r="2" fill="#333" />
      </g>
    )
  }

  if (type === "x-eyes") {
    return (
      <g stroke="#333" strokeWidth="4" strokeLinecap="round">
        <line x1="-35" y1={eyeY - 10} x2="-15" y2={eyeY + 10} />
        <line x1="-35" y1={eyeY + 10} x2="-15" y2={eyeY - 10} />
        <line x1="15" y1={eyeY - 10} x2="35" y2={eyeY + 10} />
        <line x1="15" y1={eyeY + 10} x2="35" y2={eyeY - 10} />
      </g>
    )
  }

  return null
}

function PerformerMouth({ type, isOpen }: { type: string; isOpen: boolean }) {
  const mouthY = 15
  const openScale = isOpen ? 1.5 : 1

  if (type === "felt-smile") {
    return (
      <g style={{ transform: `scaleY(${openScale})`, transformOrigin: "center 15px", transition: "transform 0.1s" }}>
        <path
          d="M-25 15 Q0 35 25 15"
          fill={isOpen ? "#8b0000" : "none"}
          stroke="#c0392b"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
    )
  }

  if (type === "crooked") {
    return (
      <g style={{ transform: `scaleY(${openScale})`, transformOrigin: "center 15px", transition: "transform 0.1s" }}>
        <path
          d="M-30 12 Q-10 25 5 18 Q20 35 30 20"
          fill={isOpen ? "#8b0000" : "none"}
          stroke="#c0392b"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    )
  }

  if (type === "open-wide") {
    return (
      <g style={{ transform: `scaleY(${isOpen ? 1.3 : 1})`, transformOrigin: "center 25px", transition: "transform 0.1s" }}>
        <ellipse cx="0" cy={mouthY + 10} rx="30" ry={isOpen ? 30 : 25} fill="#8b0000" />
        <ellipse cx="0" cy={mouthY + 20} rx="20" ry="8" fill="#ff6b6b" />
      </g>
    )
  }

  if (type === "zigzag") {
    return (
      <g style={{ transform: `scaleY(${isOpen ? 1.4 : 1})`, transformOrigin: "center 20px", transition: "transform 0.1s" }}>
        <path
          d="M-25 20 L-15 15 L-5 25 L5 15 L15 25 L25 20"
          fill="none"
          stroke="#333"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    )
  }

  if (type === "tongue-out") {
    return (
      <g style={{ transform: `scaleY(${openScale})`, transformOrigin: "center 15px", transition: "transform 0.1s" }}>
        <path d="M-20 15 Q0 25 20 15" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <ellipse 
          cx="5" 
          cy={isOpen ? 35 : 28} 
          rx="12" 
          ry={isOpen ? 18 : 15} 
          fill="#ff6b6b" 
          transform="rotate(10)" 
          style={{ transition: "cy 0.1s, ry 0.1s" }}
        />
      </g>
    )
  }

  return null
}

function PerformerHair({ type }: { type: string }) {
  const hairY = -100

  if (type === "none") return null

  if (type === "yarn-red") {
    return (
      <g>
        {[...Array(12)].map((_, i) => (
          <path
            key={i}
            d={`M${-30 + i * 5} ${hairY} Q${-35 + i * 6} ${hairY - 30 - (i % 3) * 10} ${-25 + i * 5} ${hairY - 50 - (i % 4) * 8}`}
            fill="none"
            stroke="#c0392b"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-wiggle"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </g>
    )
  }

  if (type === "yarn-yellow") {
    return (
      <g>
        <path d="M-40 -95 Q-60 -120 -45 -140 Q-30 -160 -50 -170" fill="none" stroke="#f5a623" strokeWidth="8" strokeLinecap="round" className="animate-float" />
        <path d="M-20 -100 Q-30 -130 -10 -150" fill="none" stroke="#f5a623" strokeWidth="6" strokeLinecap="round" className="animate-float" style={{ animationDelay: "0.2s" }} />
        <path d="M10 -100 Q20 -125 5 -145" fill="none" stroke="#f5a623" strokeWidth="7" strokeLinecap="round" className="animate-float" style={{ animationDelay: "0.4s" }} />
      </g>
    )
  }

  if (type === "pipe-cleaners") {
    return (
      <g>
        <path d="M-25 -95 Q-35 -120 -25 -145 Q-15 -170 -30 -180" fill="none" stroke="#4a9b7f" strokeWidth="6" strokeLinecap="round" className="animate-wiggle" />
        <circle cx="-30" cy="-180" r="8" fill="#e85d4c" />
        <path d="M25 -95 Q35 -120 25 -145 Q15 -170 30 -180" fill="none" stroke="#5c8fd4" strokeWidth="6" strokeLinecap="round" className="animate-wiggle" style={{ animationDelay: "0.2s" }} />
        <circle cx="30" cy="-180" r="8" fill="#f5a623" />
      </g>
    )
  }

  if (type === "pom-pom") {
    return (
      <g className="animate-bounce-soft">
        <circle cx="0" cy={hairY - 30} r="25" fill="#e88dad" />
        <circle cx="-10" cy={hairY - 40} r="8" fill="#ff9ec4" />
        <circle cx="12" cy={hairY - 25} r="10" fill="#ff9ec4" />
        <circle cx="-5" cy={hairY - 20} r="7" fill="#ff9ec4" />
      </g>
    )
  }

  return null
}

function PerformerAccessory({ type }: { type: string }) {
  if (type === "none") return null

  if (type === "bow-tie") {
    return (
      <g transform="translate(0, 70) rotate(-8)">
        <path d="M-25 0 L-5 -10 L-5 10 Z" fill="#e85d4c" stroke="#333" strokeWidth="2" />
        <path d="M25 0 L5 -10 L5 10 Z" fill="#e85d4c" stroke="#333" strokeWidth="2" />
        <circle cx="0" cy="0" r="6" fill="#f5a623" stroke="#333" strokeWidth="2" />
      </g>
    )
  }

  if (type === "hat") {
    return (
      <g transform="translate(0, -110) rotate(12)">
        <path d="M-30 0 L0 -40 L30 0 Z" fill="#faf3e8" stroke="#333" strokeWidth="2" strokeDasharray="5,3" />
        <ellipse cx="0" cy="0" rx="32" ry="8" fill="#faf3e8" stroke="#333" strokeWidth="2" />
      </g>
    )
  }

  if (type === "glasses") {
    return (
      <g transform="translate(0, -40)">
        <rect x="-45" y="-12" width="30" height="24" rx="3" fill="none" stroke="#333" strokeWidth="3" transform="rotate(-5)" />
        <rect x="15" y="-12" width="30" height="24" rx="3" fill="none" stroke="#333" strokeWidth="3" transform="rotate(8)" />
        <line x1="-15" y1="0" x2="15" y2="-3" stroke="#333" strokeWidth="3" />
        <rect x="42" y="-5" width="15" height="8" fill="rgba(255,255,200,0.7)" stroke="#333" strokeWidth="1" strokeDasharray="3,2" transform="rotate(5)" />
      </g>
    )
  }

  if (type === "mustache") {
    return (
      <g transform="translate(0, 0)">
        <path
          d="M-5 5 Q-20 -5 -35 8 Q-25 15 -10 10 M5 5 Q20 -5 35 8 Q25 15 10 10"
          fill="#5d4a3a"
          stroke="#333"
          strokeWidth="1"
        />
      </g>
    )
  }

  if (type === "cape") {
    return (
      <g transform="translate(0, 40)">
        <path
          d="M-50 20 Q-60 80 -40 120 Q0 140 40 120 Q60 80 50 20"
          fill="rgba(232, 93, 76, 0.5)"
          stroke="rgba(232, 93, 76, 0.8)"
          strokeWidth="2"
          className="animate-float"
          style={{ transformOrigin: "center top" }}
        />
      </g>
    )
  }

  return null
}

export type { PerformanceFrame }
