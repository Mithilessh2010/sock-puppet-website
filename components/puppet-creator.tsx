"use client"

import { useState } from "react"

const SOCK_COLORS = [
  { name: "Red", value: "#e85d4c", pattern: "solid" },
  { name: "Green", value: "#4a9b7f", pattern: "stripes" },
  { name: "Yellow", value: "#f5a623", pattern: "dots" },
  { name: "Blue", value: "#5c8fd4", pattern: "argyle" },
  { name: "Pink", value: "#e88dad", pattern: "solid" },
  { name: "Brown", value: "#8b6b4a", pattern: "worn" },
]

const EYE_TYPES = [
  { id: "googly-small", label: "tiny googly", size: 20 },
  { id: "googly-big", label: "HUGE googly", size: 35 },
  { id: "button-red", label: "red button", size: 22 },
  { id: "button-blue", label: "blue button", size: 22 },
  { id: "mismatched", label: "one of each", size: 25 },
  { id: "x-eyes", label: "X X (tired)", size: 24 },
]

const MOUTH_TYPES = [
  { id: "felt-smile", label: "felt smile" },
  { id: "crooked", label: "crooked grin" },
  { id: "open-wide", label: "AAAAAA" },
  { id: "zigzag", label: "stitched shut" },
  { id: "tongue-out", label: "blep" },
]

const HAIR_TYPES = [
  { id: "none", label: "bald (like an egg)" },
  { id: "yarn-red", label: "red yarn explosion" },
  { id: "yarn-yellow", label: "yellow yarn swoosh" },
  { id: "pipe-cleaners", label: "pipe cleaner antennae" },
  { id: "pom-pom", label: "single pom-pom" },
]

const ACCESSORIES = [
  { id: "none", label: "nothing (minimalist)" },
  { id: "bow-tie", label: "crooked bow tie" },
  { id: "hat", label: "tiny paper hat" },
  { id: "glasses", label: "taped glasses" },
  { id: "mustache", label: "felt mustache" },
  { id: "cape", label: "tissue paper cape" },
]

interface PuppetConfig {
  sockColor: typeof SOCK_COLORS[0]
  eyeType: string
  mouthType: string
  hairType: string
  accessory: string
  name: string
}

interface PuppetCreatorProps {
  onComplete: (puppet: PuppetConfig) => void
}

export function PuppetCreator({ onComplete }: PuppetCreatorProps) {
  const [puppet, setPuppet] = useState<PuppetConfig>({
    sockColor: SOCK_COLORS[0],
    eyeType: "googly-small",
    mouthType: "felt-smile",
    hairType: "none",
    accessory: "none",
    name: "",
  })

  const [step, setStep] = useState(0)

  const steps = [
    { title: "pick your sock", subtitle: "(stolen from the laundry)" },
    { title: "give it eyes", subtitle: "(the window to its fuzzy soul)" },
    { title: "add a mouth", subtitle: "(for saying weird things)" },
    { title: "hair situation", subtitle: "(optional but encouraged)" },
    { title: "accessories", subtitle: "(fancy it up or don't)" },
    { title: "name your friend", subtitle: "(make it weird)" },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else if (puppet.name.trim()) {
      onComplete(puppet)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 
            className="text-3xl md:text-5xl font-mono text-foreground mb-2"
            style={{ transform: `rotate(${-2 + Math.random() * 4}deg)` }}
          >
            {steps[step].title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans">
            {steps[step].subtitle}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          <div className="sketchy-border bg-card p-6 md:p-8 w-full max-w-md">
            <PuppetPreview puppet={puppet} />
          </div>

          <div className="sketchy-border bg-card p-6 md:p-8 w-full max-w-md tape-effect">
            {step === 0 && (
              <div className="grid grid-cols-3 gap-4">
                {SOCK_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setPuppet({ ...puppet, sockColor: color })}
                    className={`aspect-square rounded-lg transition-transform hover:scale-110 ${
                      puppet.sockColor.name === color.name
                        ? "ring-4 ring-foreground ring-offset-2 ring-offset-card"
                        : ""
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      transform: `rotate(${-5 + Math.random() * 10}deg)`,
                    }}
                    title={color.name}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-3">
                {EYE_TYPES.map((eye) => (
                  <button
                    key={eye.id}
                    onClick={() => setPuppet({ ...puppet, eyeType: eye.id })}
                    className={`p-4 text-left font-sans text-lg sketchy-border transition-all hover:scale-105 ${
                      puppet.eyeType === eye.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground hover:bg-muted"
                    }`}
                    style={{ transform: `rotate(${-2 + Math.random() * 4}deg)` }}
                  >
                    {eye.label}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-3">
                {MOUTH_TYPES.map((mouth) => (
                  <button
                    key={mouth.id}
                    onClick={() => setPuppet({ ...puppet, mouthType: mouth.id })}
                    className={`p-4 text-left font-sans text-lg sketchy-border transition-all hover:scale-105 ${
                      puppet.mouthType === mouth.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground hover:bg-muted"
                    }`}
                    style={{ transform: `rotate(${-2 + Math.random() * 4}deg)` }}
                  >
                    {mouth.label}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-3">
                {HAIR_TYPES.map((hair) => (
                  <button
                    key={hair.id}
                    onClick={() => setPuppet({ ...puppet, hairType: hair.id })}
                    className={`p-4 text-left font-sans text-lg sketchy-border transition-all hover:scale-105 ${
                      puppet.hairType === hair.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground hover:bg-muted"
                    }`}
                    style={{ transform: `rotate(${-2 + Math.random() * 4}deg)` }}
                  >
                    {hair.label}
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-3">
                {ACCESSORIES.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setPuppet({ ...puppet, accessory: acc.id })}
                    className={`p-4 text-left font-sans text-lg sketchy-border transition-all hover:scale-105 ${
                      puppet.accessory === acc.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground hover:bg-muted"
                    }`}
                    style={{ transform: `rotate(${-2 + Math.random() * 4}deg)` }}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={puppet.name}
                  onChange={(e) => setPuppet({ ...puppet, name: e.target.value })}
                  placeholder="Sir Fluffington the Third..."
                  className="w-full p-4 text-xl font-sans bg-input border-4 border-foreground text-foreground placeholder:text-muted-foreground focus:outline-none"
                  style={{ 
                    borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
                  }}
                  maxLength={30}
                />
                <p className="text-sm text-muted-foreground font-sans text-center">
                  (shorter names fit better on the marquee)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 text-lg font-sans sketchy-border bg-muted text-foreground hover:scale-105 transition-transform"
              style={{ transform: "rotate(-2deg)" }}
            >
              wait go back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 5 && !puppet.name.trim()}
            className="px-8 py-3 text-lg font-sans sketchy-border bg-primary text-primary-foreground hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ transform: "rotate(2deg)" }}
          >
            {step === 5 ? "done! show time!" : "ooh next →"}
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === step ? "bg-primary" : i < step ? "bg-secondary" : "bg-muted"
              }`}
              style={{ transform: `rotate(${Math.random() * 360}deg)` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PuppetPreview({ puppet }: { puppet: PuppetConfig }) {
  return (
    <div className="relative w-full aspect-[3/4] flex items-center justify-center">
      <svg
        viewBox="0 0 200 280"
        className="w-full h-full animate-bounce-soft"
        style={{ filter: "drop-shadow(4px 4px 0 rgba(0,0,0,0.2))" }}
      >
        <defs>
          <pattern id="stripes" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
          </pattern>
          <pattern id="dots" patternUnits="userSpaceOnUse" width="15" height="15">
            <circle cx="7.5" cy="7.5" r="3" fill="rgba(255,255,255,0.4)" />
          </pattern>
          <pattern id="argyle" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="rgba(255,255,255,0.2)" />
          </pattern>
          <filter id="worn">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
        </defs>

        <g transform="translate(100, 140)">
          <ellipse
            cx="0"
            cy="0"
            rx="65"
            ry="100"
            fill={puppet.sockColor.value}
            className="animate-wobble"
            style={{ transformOrigin: "center" }}
            filter={puppet.sockColor.pattern === "worn" ? "url(#worn)" : undefined}
          />
          
          {puppet.sockColor.pattern === "stripes" && (
            <ellipse cx="0" cy="0" rx="65" ry="100" fill="url(#stripes)" />
          )}
          {puppet.sockColor.pattern === "dots" && (
            <ellipse cx="0" cy="0" rx="65" ry="100" fill="url(#dots)" />
          )}
          {puppet.sockColor.pattern === "argyle" && (
            <ellipse cx="0" cy="0" rx="65" ry="100" fill="url(#argyle)" />
          )}

          <PuppetHair type={puppet.hairType} />

          <PuppetEyes type={puppet.eyeType} />

          <PuppetMouth type={puppet.mouthType} />

          <PuppetAccessory type={puppet.accessory} />
        </g>
      </svg>

      {puppet.name && (
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 font-mono text-lg sketchy-border"
          style={{ transform: "translateX(-50%) rotate(-3deg)" }}
        >
          {puppet.name}
        </div>
      )}
    </div>
  )
}

function PuppetEyes({ type }: { type: string }) {
  const eyeY = -40

  if (type === "googly-small") {
    return (
      <g>
        <circle cx="-25" cy={eyeY} r="12" fill="white" stroke="#333" strokeWidth="2" />
        <circle cx="-25" cy={eyeY + 4} r="6" fill="#333" className="animate-wiggle" style={{ transformOrigin: "-25px -36px" }} />
        <circle cx="25" cy={eyeY} r="12" fill="white" stroke="#333" strokeWidth="2" />
        <circle cx="25" cy={eyeY + 4} r="6" fill="#333" className="animate-wiggle" style={{ transformOrigin: "25px -36px", animationDelay: "0.1s" }} />
      </g>
    )
  }

  if (type === "googly-big") {
    return (
      <g>
        <circle cx="-22" cy={eyeY - 5} r="22" fill="white" stroke="#333" strokeWidth="3" />
        <circle cx="-22" cy={eyeY + 5} r="10" fill="#333" className="animate-wiggle" style={{ transformOrigin: "-22px -40px" }} />
        <circle cx="22" cy={eyeY - 5} r="22" fill="white" stroke="#333" strokeWidth="3" />
        <circle cx="22" cy={eyeY + 5} r="10" fill="#333" className="animate-wiggle" style={{ transformOrigin: "22px -40px", animationDelay: "0.15s" }} />
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
        <circle cx="-25" cy={eyeY + 4} r="8" fill="#333" className="animate-wiggle" style={{ transformOrigin: "-25px -36px" }} />
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

function PuppetMouth({ type }: { type: string }) {
  const mouthY = 15

  if (type === "felt-smile") {
    return (
      <path
        d="M-25 15 Q0 35 25 15"
        fill="none"
        stroke="#c0392b"
        strokeWidth="6"
        strokeLinecap="round"
      />
    )
  }

  if (type === "crooked") {
    return (
      <path
        d="M-30 12 Q-10 25 5 18 Q20 35 30 20"
        fill="none"
        stroke="#c0392b"
        strokeWidth="5"
        strokeLinecap="round"
      />
    )
  }

  if (type === "open-wide") {
    return (
      <g>
        <ellipse cx="0" cy={mouthY + 10} rx="30" ry="25" fill="#8b0000" />
        <ellipse cx="0" cy={mouthY + 20} rx="20" ry="8" fill="#ff6b6b" />
      </g>
    )
  }

  if (type === "zigzag") {
    return (
      <path
        d="M-25 20 L-15 15 L-5 25 L5 15 L15 25 L25 20"
        fill="none"
        stroke="#333"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  }

  if (type === "tongue-out") {
    return (
      <g>
        <path d="M-20 15 Q0 25 20 15" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="5" cy="28" rx="12" ry="15" fill="#ff6b6b" transform="rotate(10)" />
      </g>
    )
  }

  return null
}

function PuppetHair({ type }: { type: string }) {
  const hairY = -100

  if (type === "none") return null

  if (type === "yarn-red") {
    return (
      <g>
        {[...Array(12)].map((_, i) => (
          <path
            key={i}
            d={`M${-30 + i * 5} ${hairY} Q${-35 + i * 6} ${hairY - 30 - Math.random() * 20} ${-25 + i * 5} ${hairY - 50 - Math.random() * 20}`}
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

function PuppetAccessory({ type }: { type: string }) {
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

export type { PuppetConfig }
