"use client"

import { useState } from "react"
import { PromptGenerator } from "./prompt-generator"

interface HomeScreenProps {
  onStart: () => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [showPromptGenerator, setShowPromptGenerator] = useState(false)

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-20 bg-primary opacity-80" style={{ clipPath: "polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)" }} />
      
      <div className="relative z-10 w-full max-w-4xl">
        <header className="text-center mb-8 md:mb-12">
          <h1 
            className="text-4xl md:text-7xl font-mono text-foreground mb-4 leading-tight"
            style={{ transform: "rotate(-2deg)" }}
          >
            <span className="inline-block" style={{ transform: "rotate(3deg)" }}>Sock</span>{" "}
            <span className="inline-block text-primary" style={{ transform: "rotate(-4deg)" }}>Puppet</span>{" "}
            <span className="inline-block" style={{ transform: "rotate(2deg)" }}>Theater</span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl mx-auto"
            style={{ transform: "rotate(1deg)" }}
          >
            make weird puppets. put on absurd shows. share the chaos.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-12">
          <div className="relative">
            <DemoSockPuppet color="#e85d4c" delay={0} />
            <p className="text-center font-sans text-sm text-muted-foreground mt-2" style={{ transform: "rotate(-3deg)" }}>
              this could be your puppet
            </p>
          </div>
          
          <div className="relative">
            <DemoSockPuppet color="#4a9b7f" delay={0.3} />
            <p className="text-center font-sans text-sm text-muted-foreground mt-2" style={{ transform: "rotate(2deg)" }}>
              or this one
            </p>
          </div>
          
          <div className="relative">
            <DemoSockPuppet color="#f5a623" delay={0.6} />
            <p className="text-center font-sans text-sm text-muted-foreground mt-2" style={{ transform: "rotate(-1deg)" }}>
              definitely this one
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={onStart}
            className="px-10 py-5 text-2xl font-sans sketchy-border bg-primary text-primary-foreground hover:scale-110 transition-transform animate-bounce-soft"
            style={{ transform: "rotate(-2deg)" }}
          >
            make a puppet!
          </button>

          <button
            onClick={() => setShowPromptGenerator(!showPromptGenerator)}
            className="px-6 py-3 text-lg font-sans sketchy-border bg-accent text-accent-foreground hover:scale-105 transition-transform"
            style={{ transform: "rotate(2deg)" }}
          >
            {showPromptGenerator ? "hide the idea machine" : "need a show idea?"}
          </button>
        </div>

        {showPromptGenerator && (
          <div className="mt-8 max-w-md mx-auto">
            <PromptGenerator />
          </div>
        )}

        <div className="mt-12 md:mt-16 text-center">
          <div 
            className="inline-block sketchy-border bg-card p-4 md:p-6"
            style={{ transform: "rotate(1deg)" }}
          >
            <h3 className="font-mono text-lg md:text-xl text-foreground mb-3">how it works:</h3>
            <ol className="font-sans text-muted-foreground text-left space-y-2">
              <li style={{ transform: "rotate(-1deg)" }}>1. pick a sock (any sock will do)</li>
              <li style={{ transform: "rotate(0.5deg)" }}>2. give it eyes, a mouth, maybe some hair</li>
              <li style={{ transform: "rotate(-0.5deg)" }}>3. choose a backdrop (alien laundromat, anyone?)</li>
              <li style={{ transform: "rotate(1deg)" }}>4. drag it around to make it perform</li>
              <li style={{ transform: "rotate(-1.5deg)" }}>5. share your masterpiece with the world</li>
            </ol>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="font-sans text-sm text-muted-foreground" style={{ transform: "rotate(-1deg)" }}>
            made with love, mismatched socks, and way too much free time
          </p>
          <p className="font-sans text-xs text-muted-foreground mt-2 opacity-60">
            no socks were harmed in the making of this theater
          </p>
        </footer>
      </div>

      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="30" cy="70" r="25" fill="#e85d4c" />
          <circle cx="70" cy="80" r="18" fill="#4a9b7f" />
        </svg>
      </div>
      
      <div className="absolute top-20 right-0 w-24 h-24 md:w-36 md:h-36 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="60" cy="40" r="20" fill="#f5a623" />
        </svg>
      </div>
    </div>
  )
}

function DemoSockPuppet({ color, delay }: { color: string; delay: number }) {
  return (
    <div 
      className="w-24 h-32 md:w-32 md:h-44 animate-bounce-soft"
      style={{ animationDelay: `${delay}s` }}
    >
      <svg viewBox="0 0 100 140" className="w-full h-full">
        <ellipse
          cx="50"
          cy="70"
          rx="35"
          ry="55"
          fill={color}
          className="animate-wobble"
          style={{ transformOrigin: "50px 70px", animationDelay: `${delay}s` }}
        />
        
        <circle cx="35" cy="50" r="10" fill="white" stroke="#333" strokeWidth="2" />
        <circle cx="35" cy="52" r="5" fill="#333" className="animate-wiggle" style={{ transformOrigin: "35px 52px", animationDelay: `${delay}s` }} />
        
        <circle cx="65" cy="50" r="10" fill="white" stroke="#333" strokeWidth="2" />
        <circle cx="65" cy="52" r="5" fill="#333" className="animate-wiggle" style={{ transformOrigin: "65px 52px", animationDelay: `${delay + 0.1}s` }} />
        
        <path
          d="M35 85 Q50 100 65 85"
          fill="none"
          stroke="#c0392b"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
