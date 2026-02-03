"use client"

import { useState, useCallback } from "react"

const CHARACTERS = [
  "a worried accountant",
  "a very tiny dragon",
  "someone who just discovered they can fly",
  "a suspicious potato",
  "the world's worst magician",
  "a ghost who's afraid of the dark",
  "a robot learning about feelings",
  "a pigeon with a secret",
  "your mom's friend's kid",
  "a sentient sock (you)",
  "a time traveler who only went back 5 minutes",
  "a detective allergic to clues",
]

const SITUATIONS = [
  "trying to return something without a receipt",
  "explaining why they're late",
  "pretending to know how to cook",
  "asking for directions in a language they don't speak",
  "explaining the internet to their grandma",
  "trying to parallel park",
  "ordering coffee but forgetting all words",
  "meeting their hero and immediately embarrassing themselves",
  "discovering their house is haunted (mildly)",
  "realizing they've been talking to a plant for an hour",
  "finding out they won the lottery but lost the ticket",
  "trying to assemble furniture with no instructions",
]

const TWISTS = [
  "but everything is made of cheese",
  "and it's raining cats (literal cats)",
  "while being judged by a very disappointed seagull",
  "but they can only communicate through interpretive dance",
  "and gravity keeps turning on and off",
  "but time moves backwards every third sentence",
  "while their evil twin watches from nearby",
  "and the floor is definitely lava",
  "but everyone thinks they're someone else",
  "while trying not to sneeze",
  "and there's a tuba playing ominously",
  "but they forgot how doors work",
]

export function PromptGenerator({ onSelect }: { onSelect?: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const generatePrompt = useCallback(() => {
    setIsSpinning(true)
    
    const spinDuration = 1500
    const spinInterval = 50
    let elapsed = 0

    const interval = setInterval(() => {
      elapsed += spinInterval
      
      const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
      const sit = SITUATIONS[Math.floor(Math.random() * SITUATIONS.length)]
      const twist = TWISTS[Math.floor(Math.random() * TWISTS.length)]
      
      setPrompt(`${char} ${sit} ${twist}`)
      
      if (elapsed >= spinDuration) {
        clearInterval(interval)
        setIsSpinning(false)
      }
    }, spinInterval)
  }, [])

  const handleUsePrompt = useCallback(() => {
    if (prompt && onSelect) {
      onSelect(prompt)
    }
  }, [prompt, onSelect])

  return (
    <div className="sketchy-border bg-card p-6 tape-effect">
      <h3 
        className="text-2xl font-mono text-foreground mb-4 text-center"
        style={{ transform: "rotate(-1deg)" }}
      >
        need an idea?
      </h3>
      
      <p className="text-muted-foreground font-sans text-center mb-4 text-sm">
        (for when your brain is empty)
      </p>

      <button
        onClick={generatePrompt}
        disabled={isSpinning}
        className="w-full px-6 py-4 font-sans text-lg sketchy-border bg-accent text-accent-foreground hover:scale-105 transition-transform disabled:opacity-70 mb-4"
        style={{ transform: "rotate(1deg)" }}
      >
        {isSpinning ? "thinking real hard..." : "give me something weird"}
      </button>

      {prompt && (
        <div 
          className={`p-4 bg-muted text-foreground font-sans text-lg leading-relaxed sketchy-border ${
            isSpinning ? "animate-wiggle" : ""
          }`}
          style={{ transform: "rotate(-1deg)" }}
        >
          <p className="text-center italic">{'"'}{prompt}{'"'}</p>
        </div>
      )}

      {prompt && !isSpinning && onSelect && (
        <button
          onClick={handleUsePrompt}
          className="w-full mt-4 px-4 py-2 font-sans text-base sketchy-border bg-secondary text-secondary-foreground hover:scale-105 transition-transform"
          style={{ transform: "rotate(2deg)" }}
        >
          sure, let{"'"}s do that
        </button>
      )}
    </div>
  )
}

export function QuickPromptButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 font-sans text-sm sketchy-border bg-accent text-accent-foreground hover:scale-105 transition-transform"
      style={{ transform: "rotate(-2deg)" }}
    >
      random scene idea
    </button>
  )
}
