export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function isPdfMimeType(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

export function getFileExtension(mimeType: string): string {
  const extensions: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
  };
  return extensions[mimeType] || '';
}