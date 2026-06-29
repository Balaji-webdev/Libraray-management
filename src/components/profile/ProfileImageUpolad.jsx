
import { useRef, useState } from "react";
import defaultAvatar from "../../public/assets/default-avatar.svg";
import { validateImageFile, fileToOptimizedBase64 } from "../../utils/imageProcessing";

export default function ProfileImageUpload({ currentImage, onImageReady }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setProcessing(true);
    try {
      const optimized = await fileToOptimizedBase64(file);
      setPreview(optimized);
      onImageReady(optimized);
    } catch {
      setError("Could not process this image. Please try another.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-44 w-44 shrink-0">
        <img
          src={preview || defaultAvatar}
          alt="Profile"
          className="h-44 w-44 rounded-2xl object-cover border border-slate-200 shadow-sm"
        />
        {processing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Change photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload profile image"
        />
        <p className="mt-2 text-xs text-slate-500">JPG, PNG, or WEBP. Max 5MB.</p>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}