const outdatedVersion = (validator: string, network: string): boolean => {
  const compare = validator.split('-')[0];

  // TODO: remove this exception
  if (compare === 'v1.1.10.0') {
    return false;
  }

  return compare !== network;
};

export default outdatedVersion;
