
export const parseDataUrl = (dataUrl: string): { mimeType: string; data: string } | null => {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) {
    console.error("Invalid data URL format");
    return null;
  }
  return {
    mimeType: match[1],
    data: match[2],
  };
};
