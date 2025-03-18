"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Pause } from "lucide-react"
import Geoffrey from './image/Geff.jpg'

interface Recording {
  id: string;
  url: string;
  name: string;
  timestamp: number;
}

export default function ProfilePage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Load existing recordings when component mounts
    fetch('/api/recordings')
      .then(res => res.json())
      .then(data => setRecordings(data))
      .catch(err => console.error('Error loading recordings:', err))
  }, [])

  const handlePlayPause = (recording: Recording) => {
    if (playingId === recording.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        const audioUrl = recording.url;
        
        // Stop current playback
        audioRef.current.pause();
        
        // Set new audio source and play
        audioRef.current.src = audioUrl;
        audioRef.current.currentTime = 0;
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setSelectedRecording(recording);
            setPlayingId(recording.id);
            setIsPlaying(true);
          }).catch(error => {
            console.error("Playback error:", error);
          });
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Profile section */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className="relative w-36 h-36 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-gray-800">
                <Image
                  src={Geoffrey}
                  alt="Geoffrey"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 py-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Geoffrey Woo</h1>
              <p className="text-gray-300">
                Hi Geoffrey, after text emails I beileve it would be better to share voice recordings as I keep you updated on this solution and the current headspace as I hope to get an intro call - if that is neccessary. 
              </p>
            </div>
          </div>

          {/* Voice recordings section */}
          <div className="space-y-3 mb-8">
            <div className="grid gap-2">
              {recordings.map((recording) => (
                <div 
                  key={recording.id}
                  className={`bg-gray-800 rounded-full p-2 flex items-center ${
                    selectedRecording?.id === recording.id ? 'border border-white' : ''
                  }`}
                >
                  <button
                    onClick={() => handlePlayPause(recording)}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-full mr-4"
                  >
                    {playingId === recording.id ? 
                      <Pause className="w-6 h-6 text-gray-900" /> : 
                      <Play className="w-6 h-6 text-gray-900" />}
                  </button>
                  <div className="flex-grow">
                    <div className="text-white text-sm mb-1">{recording.name}</div>
                    {selectedRecording?.id === recording.id && (
                      <div className="h-1 bg-gray-700 rounded-full">
                        <div
                          className="h-1 bg-white rounded-full"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  {selectedRecording?.id === recording.id && (
                    <div className="ml-4 text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <audio
              ref={audioRef}
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => {
                setIsPlaying(false);
                setPlayingId(null);
              }}
              onError={(e) => {
                console.error('Audio error:', e);
                setIsPlaying(false);
                setPlayingId(null);
              }}
            />
          </div>

          {/* Attribution */}
          <div className="text-center text-gray-400 pt-4 border-t border-gray-800">
            <p>
              These recordings are from{" "}
              <Link
                href="https://x.com/Amos_JR_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 font-medium"
              >
                Moses Gamaseb
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

