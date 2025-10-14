/**
 * Generate SEO-friendly slug from text
 * Converts: "Istanbul & Cappadocia Tour - 7 Days"
 * Into: "istanbul-cappadocia-tour-7-days"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace Turkish characters
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    // Remove special characters
    .replace(/[^\w\s-]/g, '')
    // Replace spaces and multiple dashes with single dash
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate SEO-friendly slug with optional suffix for uniqueness
 */
export function generateUniqueSlug(text: string, suffix?: string | number): string {
  const baseSlug = generateSlug(text);
  return suffix ? `${baseSlug}-${suffix}` : baseSlug;
}

/**
 * Validate if slug is SEO-friendly
 */
export function isValidSlug(slug: string): boolean {
  // Check if slug contains only lowercase letters, numbers, and hyphens
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Example usage:
 *
 * generateSlug("Istanbul & Cappadocia Tour - 7 Days")
 * → "istanbul-cappadocia-tour-7-days"
 *
 * generateSlug("Göreme Hot Air Balloon Experience")
 * → "goreme-hot-air-balloon-experience"
 *
 * generateUniqueSlug("Istanbul Day Tour", 2)
 * → "istanbul-day-tour-2"
 */
