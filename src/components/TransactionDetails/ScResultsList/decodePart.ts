const isUtf8 = (str: string) => {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) return false;
  }
  return true;
};

export default function decodePart(part: string) {
  let decodedPart = part;

  const hexPart = Buffer.from(part, 'hex');

  if (isUtf8(hexPart.toString()) && hexPart.toString().length > 0) {
    decodedPart = hexPart.toString();
  }

  return decodedPart;
}
