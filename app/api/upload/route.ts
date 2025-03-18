import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('audio') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(process.cwd(), 'public/recordings', filename)
    
    await writeFile(filepath, buffer)
    
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      filename 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}
