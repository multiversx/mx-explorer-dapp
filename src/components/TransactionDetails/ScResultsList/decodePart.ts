const isUtf8 = (str: string) => {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) return false;
  }
  return true;
};

export default function decodePart(part: string) {
  let decodedPart = part;

  try {
    const hexPart = Buffer.from(part, 'hex').toString().trim();

    if (isUtf8(hexPart) && hexPart.length > 1) {
      decodedPart = hexPart;
    }
  } catch (error) {}

  return decodedPart;
}
