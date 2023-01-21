export const localTestnets = [...(process.env.NODE_ENV === 'development' ? [] : [])];
