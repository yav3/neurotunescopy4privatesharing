// Image utility functions for handling responsive images and fallbacks

export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  const img = event.currentTarget;
  // Set a fallback gradient background if image fails to load
  img.style.display = 'none';
  if (img.parentElement) {
    img.parentElement.style.background = 
      'linear-gradient(135deg, hsl(217 91% 15%), hsl(217 91% 25%))';
  }
};

export const getResponsiveImageSrc = (
  src: string,
  width?: number
): string => {
  // For now, return the original src
  // In the future, this could handle different sizes/formats
  return src;
};

export const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};