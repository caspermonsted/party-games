import { useState } from 'react'

function getSavedPhoto() {
  try { return localStorage.getItem('pg_photo') || null } catch { return null }
}

function savePhoto(dataUrl) {
  try { localStorage.setItem('pg_photo', dataUrl) } catch {}
}

function clearPhoto() {
  try { localStorage.removeItem('pg_photo') } catch {}
}

export function useProfilePhoto() {
  const [photo, setPhoto] = useState(getSavedPhoto)

  function pickPhoto(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      // Resize til maks 200x200 for at spare localStorage plads
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 200
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        // Crop til kvadrat fra midten
        const min = Math.min(img.width, img.height)
        const sx = (img.width - min) / 2
        const sy = (img.height - min) / 2
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        savePhoto(dataUrl)
        setPhoto(dataUrl)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  function removePhoto() {
    clearPhoto()
    setPhoto(null)
  }

  return { photo, pickPhoto, removePhoto }
}
