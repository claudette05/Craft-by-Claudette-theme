
/**
 * Transforms a standard Cloudinary URL into an optimized version.
 * Adds automatic formatting (WebP/AVIF), automatic quality, and optional width resizing.
 */
export const optimizeCloudinaryUrl = (url: string, width?: number): string => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Cloudinary URLs usually look like: .../upload/v12345/image.jpg
  // We want to insert transformations after '/upload/'
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transformations = [
    'f_auto', // Automatic format (WebP, etc.)
    'q_auto', // Automatic quality
    width ? `w_${width}` : 'w_auto', // Responsive width
    'c_limit' // Maintain aspect ratio
  ].join(',');

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

/**
 * Returns a square-cropped thumbnail version for grid views
 */
export const getCloudinaryThumbnail = (url: string, size: number = 400): string => {
  if (!url || !url.includes('cloudinary.com')) return url;

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transformations = `f_auto,q_auto,w_${size},h_${size},c_fill,g_auto`;

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};
