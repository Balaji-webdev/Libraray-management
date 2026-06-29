
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; 
const TARGET_DIMENSION = 256;
const JPEG_QUALITY = 0.7;

/**
 * @param {File} file
 * @returns {string|null} error message, or null if valid
 */
export function validateImageFile(file) {
  if (!file) return "No file selected.";
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Unsupported image type. Please use JPG, PNG, or WEBP.";
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return "Image is too large. Please use a file under 5MB.";
  }
  return null;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * @param {File} file
 * @returns {Promise<string>} base64 data URL
 */
export async function fileToOptimizedBase64(file) {
  const img = await loadImage(file);
  const { width, height } = img;

  const needsResize = width > TARGET_DIMENSION || height > TARGET_DIMENSION;

  if (!needsResize) {
    return fileToRawBase64(file);
  }

  const scale = TARGET_DIMENSION / Math.max(width, height);
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

/**
 */
function fileToRawBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
