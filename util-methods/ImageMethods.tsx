/**
 * Get the correct MIME type for the product image.
 * @param {string} mimeType - The MIME type provided for the image.
 * @param {string} uri - The URI of the image.
 * @returns {string} - The determined MIME type.
 */
export function getMimeType(mimeType: string | undefined, uri: string) {
  // Return the provided mimeType if it's valid
  if (mimeType) {
    return mimeType;
  }

  // Determine the MIME type based on the file extension in the URI
  if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) {
    return 'image/jpeg';
  } else if (uri.endsWith('.png')) {
    return 'image/png';
  } else if (uri.endsWith('.gif')) {
    return 'image/gif';
  }

  // Fallback to a generic binary type if no match is found
  return 'application/octet-stream';
}