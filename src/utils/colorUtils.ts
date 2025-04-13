
/**
 * Calculate the contrasting color (black or white) based on background color
 * @param hexColor - Hex color string (e.g., "#ff0000")
 * @returns "text-white" or "text-black" Tailwind class
 */
export const getContrastTextColor = (hexColor: string): string => {
  // Default to black text if no color or invalid format
  if (!hexColor || !hexColor.startsWith('#') || hexColor.length !== 7) {
    return 'text-black';
  }

  try {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance (perceived brightness)
    // Using the formula from WCAG 2.0
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? 'text-black' : 'text-white';
  } catch (error) {
    // If any calculation error, default to black text
    return 'text-black';
  }
};

/**
 * Get RGB values from a hex color
 * @param hexColor - Hex color string (e.g., "#ff0000")
 * @returns RGB object {r, g, b}
 */
export const hexToRgb = (hexColor: string): { r: number, g: number, b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};
