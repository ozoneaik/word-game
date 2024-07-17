'use client'
import { useState } from 'react'

export default function DropZone({ children, onDrop }) {
    const [isOver, setIsOver] = useState(false)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsOver(true)
    }

    const handleDragLeave = () => {
        setIsOver(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const letter = e.dataTransfer.getData('text/plain')
        onDrop(letter)
        setIsOver(false)
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-10 h-10 border border-gray-300 flex items-center justify-center m-1 ${
                isOver ? 'bg-gray-100' : ''
            }`}
        >
            {children}
        </div>
    )
}