import { useState, useCallback } from 'react';

export const useImageOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Valida si un archivo es una imagen válida
   */
  const isValidImage = useCallback((file) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];
    return validTypes.includes(file.type) && file.type.startsWith('image/');
  }, []);

  /**
   * Convierte una imagen a WebP optimizada
   * @param {File} file - Archivo de imagen
   * @param {Object} options - Opciones de optimización
   * @returns {Promise<Object>} - Imagen optimizada con metadatos
   */
  const optimizeImage = useCallback(
    async (
      file,
      options = {}
    ) => {
      try {
        setIsOptimizing(true);
        setError(null);

        // Validar archivo
        if (!isValidImage(file)) {
          throw new Error('El archivo no es una imagen válida');
        }

        const {
          maxWidth = 1920,
          maxHeight = 1440,
          quality = 0.75,
          format = 'webp',
        } = options;

        const originalSize = file.size;

        // Crear un canvas para procesar la imagen
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let { width, height } = img;

              // Calcular nuevas dimensiones manteniendo aspect ratio
              if (width > height) {
                if (width > maxWidth) {
                  height = Math.round((height * maxWidth) / width);
                  width = maxWidth;
                }
              } else {
                if (height > maxHeight) {
                  width = Math.round((width * maxHeight) / height);
                  height = maxHeight;
                }
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('No se pudo obtener contexto 2D del canvas'));
                return;
              }

              // Aplicar fondo blanco si es JPEG
              if (format === 'jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
              }

              // Dibujar imagen en canvas
              ctx.drawImage(img, 0, 0, width, height);

              // Convertir a blob en el formato especificado
              const mimeType = `image/${format}`;
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const savings = Math.round(
                      ((originalSize - blob.size) / originalSize) * 100
                    );

                    // Generar nombre del archivo optimizado
                    const timestamp = Date.now();
                    const randomId = Math.random().toString(36).substring(2, 9);
                    const optimizedFileName = `img-${timestamp}-${randomId}.${format}`;

                    resolve({
                      blob,
                      originalSize,
                      optimizedSize: blob.size,
                      savings,
                      fileName: optimizedFileName,
                      mimeType,
                    });
                  } else {
                    reject(new Error('Error al convertir imagen a blob'));
                  }
                },
                mimeType,
                quality
              );
            };

            img.onerror = () => {
              reject(new Error('Error al cargar la imagen'));
            };

            img.src = e.target?.result;
          };

          reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
          };

          reader.readAsDataURL(file);
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        throw err;
      } finally {
        setIsOptimizing(false);
      }
    },
    [isValidImage]
  );

  /**
   * Procesa múltiples imágenes
   */
  const optimizeMultipleImages = useCallback(
    async (files, options) => {
      const optimizedImages = [];
      for (const file of files) {
        const result = await optimizeImage(file, options);
        optimizedImages.push(result);
      }
      return optimizedImages;
    },
    [optimizeImage]
  );

  /**
   * Formatea el tamaño en bytes a unidades legibles
   */
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }, []);

  /**
   * Calcula el porcentaje de ahorro
   */
  const calculateSavings = useCallback(
    (originalSize, optimizedSize) => {
      return Math.round(((originalSize - optimizedSize) / originalSize) * 100);
    },
    []
  );

  /**
   * Descarga una imagen optimizada localmente (para testing)
   */
  const downloadOptimizedImage = useCallback((blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return {
    optimizeImage,
    optimizeMultipleImages,
    formatFileSize,
    calculateSavings,
    downloadOptimizedImage,
    isValidImage,
    isOptimizing,
    error,
    setError,
  };
};