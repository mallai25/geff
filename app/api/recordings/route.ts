import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import path from 'path'
import fs from 'fs'

export async function GET() {
  try {
    const recordingsDir = path.join(process.cwd(), 'public/recordings')
    
    if (!fs.existsSync(recordingsDir)) {
      return NextResponse.json([])
    }
    
    const files = await readdir(recordingsDir)
    
    const recordings = files.map(filename => ({
      id: filename,
      url: `/recordings/${filename}`,
      name: filename,
      timestamp: Date.now()
    }))
    
    return NextResponse.json(recordings)
  } catch (error) {
    console.error('Error loading recordings:', error)
    return NextResponse.json([])
  }
}
