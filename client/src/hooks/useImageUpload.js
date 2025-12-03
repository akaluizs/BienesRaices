'use client'

import { useState, useCallback } from 'react'

/**
 * Hook para optimizar imágenes a WebP y subirlas a R2
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  /**
   * 1️⃣ OPTIMIZAR IMAGEN A WEBP
   */
  const optimizeImage = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Redimensionar si es muy grande (máx 1920x1440)
          const maxWidth = 1920
          const maxHeight = 1440
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = width * ratio
            height = height * ratio
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          // Convertir a WebP con 75% de calidad
          canvas.toBlob(
            (blob) => {
              resolve({
                blob: blob,
                originalSize: file.size,
                optimizedSize: blob.size,
                reduction: ((1 - blob.size / file.size) * 100).toFixed(2),
              })
            },
            'image/webp',
            0.75
          )
        }

        img.onerror = () => reject(new Error('Error cargando imagen'))
        img.src = e.target.result
      }

      reader.onerror = () => reject(new Error('Error leyendo archivo'))
      reader.readAsDataURL(file)
    })
  }, [])

  /**
   * 2️⃣ SUBIR A R2 CON CARPETA ESPECÍFICA
   */
  const uploadToR2 = useCallback(async (blob, fileName, folder, itemId) => {
    const formData = new FormData()
    formData.append('file', blob, `${Date.now()}-${fileName}`)
    formData.append('folder', folder) // 'propiedades' o 'anuncios'
    formData.append('itemId', itemId) // ID de la propiedad o anuncio (slug)

    const response = await fetch('/api/r2/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Error subiendo a R2')
    }

    return data
  }, [])

  /**
   * 3️⃣ PROCESO COMPLETO CON CARPETA
   */
  const processImage = useCallback(
    async (file, folder, itemId, onProgress) => {
      try {
        setUploading(true)
        setProgress(0)

        // Paso 1: Optimizar a WebP
        onProgress?.('Optimizando imagen...')
        setProgress(20)

        const optimized = await optimizeImage(file)
        console.log(`✅ Imagen optimizada: ${optimized.reduction}% más pequeña`)

        setProgress(40)

        // Paso 2: Subir a R2 con carpeta
        onProgress?.('Subiendo a Cloudflare R2...')
        setProgress(60)

        const uploadResult = await uploadToR2(optimized.blob, file.name, folder, itemId)
        console.log(`☁️ Subida a R2: ${uploadResult.url}`)

        setProgress(100)

        // Retornar URL de R2
        return {
          success: true,
          url: uploadResult.url,
          key: uploadResult.key,
          originalSize: optimized.originalSize,
          optimizedSize: optimized.optimizedSize,
          reduction: optimized.reduction,
        }
      } catch (error) {
        console.error('❌ Error procesando imagen:', error)
        throw error
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [optimizeImage, uploadToR2]
  )

  return {
    uploading,
    progress,
    processImage,
    optimizeImage,
    uploadToR2,
  }
}