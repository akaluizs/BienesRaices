'use client';

import { useState, useRef, useCallback } from 'react';
import { useImageOptimization } from '@/hooks/useImageOptimization';
import { Upload, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const ImageOptimizer = ({
  onOptimizeComplete,
  maxFiles = 10,
  maxFileSize = 20,
  format = 'webp',
  className = '',
}) => {
  const fileInputRef = useRef(null);
  const [optimizedImages, setOptimizedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    optimizeImage,
    optimizeMultipleImages,
    formatFileSize,
    isOptimizing,
    downloadOptimizedImage,
  } = useImageOptimization();

  const handleFileSelect = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;

      try {
        setError(null);
        setSuccess(null);
        setIsProcessing(true);

        const filesToOptimize = [];

        // Validar archivos
        for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
          const file = files[i];

          // Validar tipo
          if (!file.type.startsWith('image/')) {
            setError(`${file.name} no es una imagen válida`);
            continue;
          }

          // Validar tamaño
          if (file.size > maxFileSize * 1024 * 1024) {
            setError(
              `${file.name} excede el tamaño máximo de ${maxFileSize}MB`
            );
            continue;
          }

          filesToOptimize.push(file);
        }

        if (filesToOptimize.length === 0) {
          setIsProcessing(false);
          return;
        }

        // Optimizar imágenes
        const results = await optimizeMultipleImages(filesToOptimize, {
          quality: 0.75,
          format: format,
        });

        setOptimizedImages(
          results.map((result) => ({
            blob: result.blob,
            originalSize: result.originalSize,
            optimizedSize: result.optimizedSize,
            savings: result.savings,
            fileName: result.fileName,
          }))
        );

        // Llamar callback si está definido
        if (onOptimizeComplete) {
          onOptimizeComplete(
            results.map((result) => ({
              blob: result.blob,
              originalSize: result.originalSize,
              optimizedSize: result.optimizedSize,
              savings: result.savings,
              fileName: result.fileName,
            }))
          );
        }

        setSuccess(
          `✅ ${filesToOptimize.length} imagen(es) optimizada(s) exitosamente`
        );

        // Limpiar input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(`Error optimizando imágenes: ${errorMessage}`);
        console.error('Error:', err);
      } finally {
        setIsProcessing(false);
      }
    },
    [maxFiles, maxFileSize, format, optimizeMultipleImages, onOptimizeComplete]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleClearResults = useCallback(() => {
    setOptimizedImages([]);
    setSuccess(null);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={isProcessing || isOptimizing}
        className="hidden"
      />

      {/* Zona de carga */}
      <Card
        className="border-2 border-dashed border-gris-medio hover:border-naranja transition-all cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="bg-naranja/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              {isProcessing || isOptimizing ? (
                <Loader2 className="w-8 h-8 text-naranja animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-naranja" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gris-oscuro mb-2">
                {isProcessing || isOptimizing
                  ? 'Optimizando imágenes...'
                  : 'Optimiza tus imágenes'}
              </h3>
              <p className="text-sm text-gris-oscuro/70">
                {isProcessing || isOptimizing
                  ? 'Por favor espera...'
                  : `Arrastra o haz clic para seleccionar. Máx ${maxFiles} imágenes, ${maxFileSize}MB cada una`}
              </p>
            </div>

            <div className="text-xs text-gris-oscuro/50">
              ✓ Conversión a {format.toUpperCase()}
              <br />
              ✓ Compresión automática
              <br />✓ Redimensionamiento inteligente
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensajes de estado */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-green-900">{success}</p>
          </div>
        </div>
      )}

      {/* Tabla de resultados */}
      {optimizedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gris-oscuro">
              Imágenes optimizadas ({optimizedImages.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearResults}
              className="text-xs"
            >
              Limpiar
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gris-medio">
                  <th className="text-left p-3 font-bold text-gris-oscuro">Archivo</th>
                  <th className="text-right p-3 font-bold text-gris-oscuro">Original</th>
                  <th className="text-right p-3 font-bold text-gris-oscuro">Optimizado</th>
                  <th className="text-right p-3 font-bold text-naranja">Ahorro</th>
                  <th className="text-center p-3 font-bold text-gris-oscuro">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {optimizedImages.map((image, index) => (
                  <tr
                    key={index}
                    className="border-b border-gris-medio hover:bg-gris-claro transition-colors"
                  >
                    <td className="p-3 text-gris-oscuro font-mono text-xs truncate">
                      {image.fileName}
                    </td>
                    <td className="p-3 text-right text-gris-oscuro/70">
                      {formatFileSize(image.originalSize)}
                    </td>
                    <td className="p-3 text-right text-gris-oscuro/70">
                      {formatFileSize(image.optimizedSize)}
                    </td>
                    <td className="p-3 text-right font-bold text-naranja">
                      -{image.savings}%
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          downloadOptimizedImage(image.blob, image.fileName)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-naranja/10 hover:bg-naranja/20 text-naranja font-bold rounded transition-all text-xs"
                        title="Descargar imagen"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen */}
          <Card className="bg-gradient-to-r from-naranja/10 to-amarillo-dorado/10 border-2 border-naranja/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gris-oscuro/70 font-medium">Tamaño original</p>
                  <p className="text-lg font-bold text-gris-oscuro">
                    {formatFileSize(
                      optimizedImages.reduce((acc, img) => acc + img.originalSize, 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gris-oscuro/70 font-medium">Tamaño optimizado</p>
                  <p className="text-lg font-bold text-naranja">
                    {formatFileSize(
                      optimizedImages.reduce((acc, img) => acc + img.optimizedSize, 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gris-oscuro/70 font-medium">Ahorro promedio</p>
                  <p className="text-lg font-bold text-green-600">
                    -{Math.round(
                      optimizedImages.reduce((acc, img) => acc + img.savings, 0) /
                        optimizedImages.length
                    )}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};