import { isUtf8 } from 'helpers';

export const decodePart = (part: string) => {
  let decodedPart = part;

  try {
    const hexPart = Buffer.from(part, 'hex').toString();

    if (isUtf8(hexPart) && hexPart.length > 1) {
      decodedPart = hexPart;
    }
  } catch (error) {}

  return decodedPart;
};
