"use client"

import { useState, useCallback, useRef } from "react"
import type { PuppetConfig } from "./puppet-creator"
import { PuppetPerformer, type PerformanceFrame } from "./puppet-performer"

const BACKDROPS = [
  {
    id: "cardboard-castle",
    name: "Cardboard Castle",
    subtitle: "(from an Amazon box)",
  },
  {
    id: "couch-fort",
    name: "Couch Fort",
    subtitle: "(no adults allowed)",
  },
  {
    id: "office-breakroom",
    name: "Office Break Room",
    subtitle: "(the microwave smells weird)",
  },
  {
    id: "alien-laundromat",
    name: "Alien Laundromat",
    subtitle: "(lost socks go here)",
  },
  {
    id: "underwater-kitchen",
    name: "Underwater Kitchen",
    subtitle: "(everything is soggy)",
  },
]

interface TheaterStageProps {
  puppet: PuppetConfig
  onBack: () => void
  onShare: (recording: PerformanceFrame[], backdrop: string) => void
}

export function TheaterStage({ puppet, onBack, onShare }: TheaterStageProps) {
  const [backdrop, setBackdrop] = useState(BACKDROPS[0])
  const [isRecording, setIsRecording] = useState(false)
  const [recordedFrames, setRecordedFrames] = useState<PerformanceFrame[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showBackdropPicker, setShowBackdropPicker] = useState(false)
  const recordingRef = useRef<PerformanceFrame[]>([])

  const handleStartRecording = useCallback(() => {
    recordingRef.current = []
    setRecordedFrames([])
    setIsRecording(true)
  }, [])

  const handleStopRecording = useCallback(() => {
    setIsRecording(false)
    setRecordedFrames(recordingRef.current)
  }, [])

  const handleFrame = useCallback((frame: PerformanceFrame) => {
    recordingRef.current.push(frame)
  }, [])

  const handlePlayback = useCallback(() => {
    if (recordedFrames.length > 0) {
      setIsPlaying(true)
      setTimeout(() => setIsPlaying(false), 
        recordedFrames[recordedFrames.length - 1].timestamp - recordedFrames[0].timestamp + 500
      )
    }
  }, [recordedFrames])

  const handleShare = useCallback(() => {
    if (recordedFrames.length > 0) {
      onShare(recordedFrames, backdrop.id)
    }
  }, [recordedFrames, backdrop.id, onShare])

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      <header className="p-4 flex flex-wrap items-center justify-between gap-4 border-b-4 border-foreground">
        <button
          onClick={onBack}
          className="px-4 py-2 font-sans text-lg sketchy-border bg-muted text-foreground hover:scale-105 transition-transform"
          style={{ transform: "rotate(-2deg)" }}
        >
          {"<"} new puppet
        </button>
        
        <h1 
          className="text-2xl md:text-4xl font-mono text-foreground text-center flex-1"
          style={{ transform: "rotate(1deg)" }}
        >
          {puppet.name || "Unnamed Friend"} on stage!
        </h1>

        <button
          onClick={() => setShowBackdropPicker(!showBackdropPicker)}
          className="px-4 py-2 font-sans text-lg sketchy-border bg-secondary text-secondary-foreground hover:scale-105 transition-transform"
          style={{ transform: "rotate(2deg)" }}
        >
          change scene
        </button>
      </header>

      {showBackdropPicker && (
        <div className="p-4 bg-card border-b-4 border-foreground">
          <div className="flex flex-wrap gap-3 justify-center">
            {BACKDROPS.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setBackdrop(b)
                  setShowBackdropPicker(false)
                }}
                className={`px-4 py-3 font-sans sketchy-border transition-all hover:scale-105 ${
                  backdrop.id === b.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground hover:bg-muted"
                }`}
                style={{ transform: `rotate(${-3 + Math.random() * 6}deg)` }}
              >
                <div className="font-bold">{b.name}</div>
                <div className="text-sm opacity-75">{b.subtitle}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 relative overflow-hidden">
        <StageBackdrop backdropId={backdrop.id} />
        
        <div className="absolute inset-0">
          <PuppetPerformer
            puppet={puppet}
            isRecording={isRecording}
            onFrame={handleFrame}
            playbackData={isPlaying ? recordedFrames : undefined}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <StageCurtainBottom />
        </div>
        
        <div className="absolute top-0 left-0 right-0">
          <StageCurtainTop />
        </div>
      </main>

      <footer className="p-4 bg-card border-t-4 border-foreground">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {!isRecording ? (
            <>
              <button
                onClick={handleStartRecording}
                className="px-6 py-3 font-sans text-lg sketchy-border bg-primary text-primary-foreground hover:scale-105 transition-transform"
                style={{ transform: "rotate(-1deg)" }}
              >
                record a show
              </button>
              
              {recordedFrames.length > 0 && (
                <>
                  <button
                    onClick={handlePlayback}
                    disabled={isPlaying}
                    className="px-6 py-3 font-sans text-lg sketchy-border bg-secondary text-secondary-foreground hover:scale-105 transition-transform disabled:opacity-50"
                    style={{ transform: "rotate(2deg)" }}
                  >
                    {isPlaying ? "playing..." : "watch it back"}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="px-6 py-3 font-sans text-lg sketchy-border bg-accent text-accent-foreground hover:scale-105 transition-transform"
                    style={{ transform: "rotate(-2deg)" }}
                  >
                    share the chaos
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              onClick={handleStopRecording}
              className="px-8 py-4 font-sans text-xl sketchy-border bg-destructive text-destructive-foreground hover:scale-105 transition-transform animate-pulse"
              style={{ transform: "rotate(1deg)" }}
            >
              stop recording
            </button>
          )}
        </div>
        
        <p className="text-center text-muted-foreground font-sans mt-3 text-sm md:text-base">
          {isRecording 
            ? "drag your puppet around! click to make it talk!" 
            : "tip: drag the puppet to move it, hold to open its mouth"
          }
        </p>
      </footer>
    </div>
  )
}

function StageBackdrop({ backdropId }: { backdropId: string }) {
  if (backdropId === "cardboard-castle") {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ background: "#d4c4b0" }}>
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="600" fill="#d4b896" />
          
          <rect x="50" y="200" width="200" height="400" fill="#c4a876" stroke="#8b7355" strokeWidth="4" strokeDasharray="10,5" />
          <rect x="70" y="150" width="40" height="60" fill="#c4a876" stroke="#8b7355" strokeWidth="3" />
          <rect x="130" y="150" width="40" height="60" fill="#c4a876" stroke="#8b7355" strokeWidth="3" />
          <rect x="190" y="150" width="40" height="60" fill="#c4a876" stroke="#8b7355" strokeWidth="3" />
          <rect x="100" y="350" width="80" height="120" fill="#8b7355" rx="40" />
          
          <rect x="550" y="200" width="200" height="400" fill="#c4a876" stroke="#8b7355" strokeWidth="4" strokeDasharray="10,5" />
          <rect x="570" y="150" width="40" height="60" fill="#c4a876" stroke="#8b7355" strokeWidth="3" />
          <rect x="630" y="150" width="40" height="60" fill="#c4a876" stroke="#8b7355" strokeWidth="3" />
          <rect x="690" y="150" width="40" height="60" fill="#c4a876" stroke="#8b7355" strokeWidth="3" />
          
          <rect x="280" y="300" width="240" height="300" fill="#d4b896" stroke="#8b7355" strokeWidth="4" strokeDasharray="10,5" />
          <polygon points="280,300 400,150 520,300" fill="#c4a876" stroke="#8b7355" strokeWidth="4" />
          <rect x="350" y="420" width="100" height="150" fill="#5d4a3a" />
          <circle cx="430" cy="500" r="8" fill="#f5a623" />
          
          <text x="400" y="100" textAnchor="middle" fill="#8b7355" fontSize="24" fontFamily="Patrick Hand" transform="rotate(-5, 400, 100)">
            CASTLE (do not recycle)
          </text>
        </svg>
      </div>
    )
  }

  if (backdropId === "couch-fort") {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ background: "#2d1b0e" }}>
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="600" fill="#2d1b0e" />
          
          <rect x="0" y="350" width="800" height="250" fill="#8b6b4a" />
          
          <rect x="100" y="200" width="250" height="200" fill="#c0392b" rx="20" />
          <rect x="450" y="200" width="250" height="200" fill="#c0392b" rx="20" />
          
          <path d="M100 200 L400 50 L700 200" fill="#faf3e8" stroke="#d4c4b0" strokeWidth="3" strokeDasharray="8,4" />
          
          <rect x="320" y="250" width="160" height="150" fill="#2d1b0e" stroke="#faf3e8" strokeWidth="2" strokeDasharray="5,3" />
          <text x="400" y="340" textAnchor="middle" fill="#faf3e8" fontSize="16" fontFamily="Patrick Hand">
            SECRET ENTRANCE
          </text>
          
          <rect x="150" y="420" width="60" height="60" fill="#5c8fd4" rx="5" />
          <rect x="590" y="420" width="60" height="60" fill="#4a9b7f" rx="5" />
          
          <circle cx="250" cy="100" r="30" fill="#f5a623" opacity="0.6" />
          <line x1="250" y1="130" x2="250" y2="200" stroke="#f5a623" strokeWidth="2" opacity="0.4" />
          
          <text x="400" y="550" textAnchor="middle" fill="#faf3e8" fontSize="20" fontFamily="Patrick Hand" opacity="0.7">
            ~ cozy zone ~
          </text>
        </svg>
      </div>
    )
  }

  if (backdropId === "office-breakroom") {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ background: "#e8e0d0" }}>
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="600" fill="#e8e0d0" />
          
          <rect x="0" y="400" width="800" height="200" fill="#a0a0a0" />
          
          <rect x="50" y="150" width="150" height="200" fill="#d0d0d0" stroke="#888" strokeWidth="2" />
          <rect x="60" y="160" width="60" height="80" fill="#333" />
          <rect x="130" y="160" width="60" height="80" fill="#333" />
          <rect x="60" y="260" width="130" height="80" fill="#444" />
          <text x="125" y="310" textAnchor="middle" fill="#0f0" fontSize="12" fontFamily="monospace">12:00</text>
          
          <rect x="600" y="250" width="150" height="150" fill="#f5f5f5" stroke="#ccc" strokeWidth="2" />
          <circle cx="675" cy="325" r="40" fill="none" stroke="#5c8fd4" strokeWidth="3" />
          <text x="675" y="370" textAnchor="middle" fill="#888" fontSize="10" fontFamily="Patrick Hand">water</text>
          
          <rect x="300" y="350" width="200" height="100" fill="#8b6b4a" stroke="#5d4a3a" strokeWidth="3" />
          <rect x="320" y="330" width="40" height="30" fill="#f5f5f5" />
          <rect x="380" y="320" width="50" height="40" fill="#e85d4c" />
          <circle cx="450" cy="345" r="15" fill="#f5a623" />
          
          <rect x="250" y="100" width="300" height="80" fill="#faf3e8" stroke="#ccc" strokeWidth="1" />
          <text x="400" y="130" textAnchor="middle" fill="#888" fontSize="14" fontFamily="Patrick Hand">
            CLEAN UP AFTER YOURSELF
          </text>
          <text x="400" y="155" textAnchor="middle" fill="#c0392b" fontSize="12" fontFamily="Patrick Hand">
            - Management
          </text>
          
          <ellipse cx="150" cy="500" rx="60" ry="30" fill="#8b6b4a" opacity="0.3" />
          <text x="150" y="505" textAnchor="middle" fill="#5d4a3a" fontSize="10" fontFamily="Patrick Hand">
            mystery stain
          </text>
        </svg>
      </div>
    )
  }

  if (backdropId === "alien-laundromat") {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ background: "#1a1a2e" }}>
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="600" fill="#1a1a2e" />
          
          {[...Array(50)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 800}
              cy={Math.random() * 200}
              r={Math.random() * 2 + 0.5}
              fill="#fff"
              opacity={Math.random() * 0.5 + 0.3}
            />
          ))}
          
          <rect x="0" y="450" width="800" height="150" fill="#2d2d44" />
          
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${80 + i * 180}, 280)`}>
              <rect x="0" y="0" width="120" height="150" fill="#4a4a6a" rx="10" stroke="#6a6a8a" strokeWidth="2" />
              <circle cx="60" cy="75" r="45" fill="#1a1a2e" stroke="#4a9b7f" strokeWidth="3" />
              <circle cx="60" cy="75" r="35" fill="none" stroke="#4a9b7f" strokeWidth="1" opacity="0.5" className="animate-spin" style={{ transformOrigin: "60px 75px", animationDuration: "3s" }} />
              <rect x="10" y="140" width="100" height="20" fill="#2d2d44" />
              <circle cx="90" cy="20" r="8" fill={i % 2 === 0 ? "#4a9b7f" : "#e85d4c"} className="animate-pulse" />
            </g>
          ))}
          
          <text x="400" y="50" textAnchor="middle" fill="#4a9b7f" fontSize="28" fontFamily="Patrick Hand" className="animate-pulse">
            ZXQR{"'"}s LAUNDROMAT
          </text>
          <text x="400" y="80" textAnchor="middle" fill="#6a6a8a" fontSize="14" fontFamily="Patrick Hand">
            lost socks welcomed (and possibly sentient)
          </text>
          
          <ellipse cx="650" cy="520" rx="40" ry="20" fill="#4a9b7f" opacity="0.3" />
          <text x="650" y="525" textAnchor="middle" fill="#4a9b7f" fontSize="10">
            goo puddle
          </text>
        </svg>
      </div>
    )
  }

  if (backdropId === "underwater-kitchen") {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ background: "#1a4a5a" }}>
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="600" fill="#1a4a5a" />
          
          {[...Array(20)].map((_, i) => (
            <ellipse
              key={i}
              cx={100 + Math.random() * 600}
              cy={500 - i * 30}
              rx={5 + Math.random() * 10}
              ry={8 + Math.random() * 15}
              fill="#5c8fd4"
              opacity={0.2 + Math.random() * 0.3}
              className="animate-float"
              style={{ animationDelay: `${i * 0.2}s`, animationDuration: `${3 + Math.random() * 2}s` }}
            />
          ))}
          
          <rect x="50" y="350" width="200" height="150" fill="#2d5a6a" stroke="#4a7a8a" strokeWidth="3" />
          <rect x="70" y="370" width="70" height="50" fill="#1a4a5a" stroke="#4a7a8a" strokeWidth="2" />
          <rect x="160" y="370" width="70" height="50" fill="#1a4a5a" stroke="#4a7a8a" strokeWidth="2" />
          <circle cx="105" cy="450" r="15" fill="#4a7a8a" />
          <circle cx="195" cy="450" r="15" fill="#4a7a8a" />
          
          <rect x="550" y="300" width="180" height="250" fill="#3d6a7a" stroke="#5a8a9a" strokeWidth="3" rx="5" />
          <rect x="560" y="310" width="75" height="120" fill="#2d5a6a" stroke="#4a7a8a" strokeWidth="2" />
          <rect x="645" y="310" width="75" height="120" fill="#2d5a6a" stroke="#4a7a8a" strokeWidth="2" />
          <rect x="560" y="450" width="160" height="90" fill="#2d5a6a" stroke="#4a7a8a" strokeWidth="2" />
          
          <path d="M300 200 Q350 150 400 200 Q450 250 400 300 Q350 350 300 300 Q250 250 300 200" fill="none" stroke="#f5a623" strokeWidth="3" opacity="0.6" />
          <circle cx="350" cy="250" r="15" fill="#f5a623" />
          <circle cx="340" cy="245" r="3" fill="#1a4a5a" />
          <circle cx="355" cy="245" r="3" fill="#1a4a5a" />
          
          <text x="400" y="550" textAnchor="middle" fill="#5c8fd4" fontSize="16" fontFamily="Patrick Hand" opacity="0.8">
            ~ everything is damp ~
          </text>
          
          <path d="M100 100 Q120 80 140 100 L135 130 Q120 120 105 130 Z" fill="#4a9b7f" opacity="0.6" />
          <path d="M600 80 Q630 50 660 80 L655 120 Q630 105 605 120 Z" fill="#4a9b7f" opacity="0.5" />
        </svg>
      </div>
    )
  }

  return null
}

function StageCurtainTop() {
  return (
    <svg viewBox="0 0 800 80" className="w-full" preserveAspectRatio="none">
      <path
        d="M0 0 L800 0 L800 50 Q700 80 600 50 Q500 20 400 50 Q300 80 200 50 Q100 20 0 50 Z"
        fill="#8b2020"
      />
      <path
        d="M0 0 L800 0 L800 40 Q700 70 600 40 Q500 10 400 40 Q300 70 200 40 Q100 10 0 40 Z"
        fill="#c0392b"
      />
      <rect x="0" y="0" width="800" height="15" fill="#f5a623" />
      <circle cx="50" cy="7" r="5" fill="#ffd700" />
      <circle cx="150" cy="7" r="5" fill="#ffd700" />
      <circle cx="250" cy="7" r="5" fill="#ffd700" />
      <circle cx="350" cy="7" r="5" fill="#ffd700" />
      <circle cx="450" cy="7" r="5" fill="#ffd700" />
      <circle cx="550" cy="7" r="5" fill="#ffd700" />
      <circle cx="650" cy="7" r="5" fill="#ffd700" />
      <circle cx="750" cy="7" r="5" fill="#ffd700" />
    </svg>
  )
}

function StageCurtainBottom() {
  return (
    <svg viewBox="0 0 800 60" className="w-full" preserveAspectRatio="none">
      <rect x="0" y="40" width="800" height="20" fill="#5d4a3a" />
      <rect x="0" y="45" width="800" height="15" fill="#8b6b4a" />
      <text x="400" y="57" textAnchor="middle" fill="#d4c4b0" fontSize="10" fontFamily="Patrick Hand">
        ~ the stage ~
      </text>
    </svg>
  )
}

export { BACKDROPS }
