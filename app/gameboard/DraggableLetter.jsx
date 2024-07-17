'use client'
import { useState } from 'react'

export default function DraggableLetter({ letter }) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', letter)
        setIsDragging(true)
    }

    const handleDragEnd = () => {
        setIsDragging(false)
    }

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`w-10 h-10 border border-gray-300 flex items-center justify-center m-1 cursor-move ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            {letter}
        </div>
    )
}