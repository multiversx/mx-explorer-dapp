const BASE64_REGEX =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export const isBase64 = (value: string) => {
  if (!value || value.length % 4 !== 0 || !BASE64_REGEX.test(value)) {
    return false;
  }

  // The regex alone accepts any 4-char aligned alphanumeric string, so round-trip
  // the value to make sure it really is base64 and not just a lookalike.
  return Buffer.from(value, 'base64').toString('base64') === value;
};
