import { useState } from "react";
import { ChevronLeft, ChevronRight, FileDown, ZoomIn, X } from "lucide-react";

// Les chemins d'accès aux images pour les deux processus
const imagesActuel = [
  {
    id: 1,
    src: "/images/Schema_Process_Actuel.png",
    alt: "Schéma Processus Actuel - Partie 1",
    description: "Vue d'ensemble du processus actuel : flux principal et étapes clés.",
  },
  {
    id: 2,
    src: "/images/Schema_Process_Actuel_Suite.png",
    alt: "Schéma Processus Actuel - Partie 2",
    description: "Suite du processus actuel.",
  },
];

const imagesRecommande = [
  {
    id: 1,
    src: "/images/Schema_Process_Recommande.png",
    alt: "Schéma Processus Recommandé",
    description: "Schéma optimisé du processus recommandé avec améliorations des flux.",
  },
];

export default function ShemaProcess() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);

  // Sélectionner les images en fonction du processus
  const currentImages = isRecommended ? imagesRecommande : imagesActuel;
  const currentImage = currentImages[currentIndex];
  const totalImages = currentImages.length;

  const goToPrevious = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? totalImages - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);

    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToNext = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const isLastSlide = currentIndex === totalImages - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);

    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleDownload = () => {
    const processType = isRecommended ? "Recommande" : "Actuel";
    const link = document.createElement("a");
    link.href = currentImage.src;
    link.download = `Schema_Process_${processType}_${currentImage.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Réinitialiser l'index quand on change de processus
  const handleProcessChange = (checked) => {
    setIsRecommended(checked);
    setCurrentIndex(0); // Retour à la première image
  };

  return (
    <div className="bg-slate-50">
      <div className="max-w-full mx-auto p-4 space-y-4">
        {/* Header avec le nouveau design */}
        <div className="relative mb-4">
          <div className="relative bg-white rounded-2xl shadow-lg px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-7 bg-[#005EA8] rounded-full"></div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Schéma du{" "}
                    <span className="text-[#005EA8]">Processus</span>
                  </h1>
                </div>
                <p className="text-xs text-gray-500 ml-3 font-medium">
                  {isRecommended ? "Architecture optimisée" : "Architecture actuelle"} • Représentation visuelle
                </p>
              </div>

              {/* Toggle Buttons */}
              <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-1 px-1.5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsRecommended(false)}
                    className={`cursor-pointer px-4 py-1 rounded-lg font-semibold text-sm transition-all ${
                      !isRecommended
                        ? "bg-[#005EA8] text-white shadow-lg scale-105"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Actuel
                  </button>
                  <button
                    onClick={() => setIsRecommended(true)}
                    className={`cursor-pointer px-4 py-1 rounded-lg font-semibold text-sm transition-all ${
                      isRecommended
                        ? "bg-[#005EA8] text-white shadow-lg scale-105"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Recommandé
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="border-b border-gray-200 px-4 py-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
            <h3 className="text-base font-bold text-gray-900 flex items-center justify-center gap-2">
              Schéma du Processus {isRecommended ? "Recommandé" : "Actuel"}
            </h3>
          </div>
          <div className="p-4">
            {/* Image Counter and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
              <div className="text-sm font-medium text-gray-700">
                {currentImage.description}
              </div>

              <div className="flex items-center space-x-2">
                {/* Image Counter - Only show if multiple images */}
                {totalImages > 1 && (
                  <span className="text-xs font-medium text-gray-600 px-2 py-1 rounded-full bg-blue-100">
                    Image {currentIndex + 1} sur {totalImages}
                  </span>
                )}

                {/* Action Buttons */}
                <button
                  onClick={toggleZoom}
                  className="cursor-pointer p-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center gap-1 text-xs"
                  title="Agrandir l'image"
                >
                  <ZoomIn className="w-3 h-3" />
                  Zoom
                </button>

                <button
                  onClick={handleDownload}
                  className="cursor-pointer text-xs px-2 py-1.5 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium flex items-center gap-1"
                  title="Télécharger l'image actuelle"
                >
                  <FileDown className="w-3 h-3" />
                  Télécharger
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative bg-[#ebebeb] rounded-lg overflow-hidden max-h-[600px] min-h-[500px]">
              <div className="flex items-center justify-center h-full w-full">
                <div className="flex items-center justify-center h-full w-full">
                  {/* Current Image with Simple Fade Animation */}
                  <div
                    key={`${isRecommended ? 'recommande' : 'actuel'}-${currentIndex}`}
                    className={`p-1 absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                      isAnimating ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <img
                      src={currentImage.src}
                      alt={currentImage.alt}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Controls - Only show if multiple images */}
              {totalImages > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white transition-all cursor-pointer hover:scale-110 border border-gray-200"
                    title="Image Précédente"
                    disabled={isAnimating}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white transition-all cursor-pointer hover:scale-110 border border-gray-200"
                    title="Image Suivante"
                    disabled={isAnimating}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Full Screen Zoom Modal */}
        {isZoomed && (
          <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden animate-in fade-in duration-300">
              <div className="border-b border-gray-200 px-6 py-2 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentImage.alt}
                  </h3>
                  <span className="text-xs font-medium text-gray-600 px-2 py-1 rounded-full bg-blue-100">
                    Processus {isRecommended ? "Recommandé" : "Actuel"}
                  </span>
                </div>
                <button
                  onClick={() => setIsZoomed(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Fermer le zoom"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-2 flex items-center justify-center h-full bg-[#ebebeb]">
                <div className="h-[80vh] w-full flex items-center justify-center">
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="object-contain max-w-full max-h-full animate-in zoom-in duration-300"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-2 flex flex-col sm:flex-row items-center justify-between bg-gray-50 space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                  {currentImage.description}
                </p>
                <div className="flex items-center space-x-3">
                  {/* Navigation in zoom modal - Only show if multiple images */}
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={goToPrevious}
                        className="cursor-pointer p-2 rounded-full bg-white text-gray-800 shadow border hover:bg-gray-50 transition-all disabled:opacity-50"
                        title="Image Précédente"
                        disabled={isAnimating}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-600 px-3 py-1 rounded-full bg-blue-100 min-w-[80px] text-center">
                        {currentIndex + 1} / {totalImages}
                      </span>
                      <button
                        onClick={goToNext}
                        className="cursor-pointer p-2 rounded-full bg-white text-gray-800 shadow border hover:bg-gray-50 transition-all disabled:opacity-50"
                        title="Image Suivante"
                        disabled={isAnimating}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}