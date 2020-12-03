const localTestnets = [...(process.env.NODE_ENV === 'development' ? [] : [])];

export default localTestnets;
