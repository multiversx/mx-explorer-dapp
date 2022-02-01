import parseJwt from '../parseJwt';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NBZGRyZXNzIjoiZXJkMWs0ZHVjMm5leWRod2FucW5ua2ZlN3p2M2QzdG1qMDAzd3Zlc3dsYXBmc3JsbXc0Zjc3eHNqeGFxMmMiLCJzaWduYXR1cmUiOiI2NDVhNTg0Y2QzMjczZDg5NmIyYzQ5MzUyN2U3ZWYwZTJlNDA1NjM2NjhjNWZlZmU3MjZkYzFkMWIwZjFlMGNlNDBkZWQ2M2FiMzc3YzUzY2JhMDJhNTFjNzYxM2RiZDliOGNlZGYxNzNlYWMwNjdmNGFlYTZkYWYwMWI3MDcwMCIsImlhdCI6MTY0MzcyODg1MiwiZXhwIjoxNjQzNzI5NDUyfQ.qpGJgJO9cxXQiYkYEOtCSm0cWm-8_GxWXU8V9cHJprI';

describe('parseJwt tests', () => {
  it(`parses token`, () => {
    const parsed = parseJwt(token);
    expect(parsed).toStrictEqual({
      accessAddress: 'erd1k4duc2neydhwanqnnkfe7zv3d3tmj003wveswlapfsrlmw4f77xsjxaq2c',
      signature:
        '645a584cd3273d896b2c493527e7ef0e2e40563668c5fefe726dc1d1b0f1e0ce40ded63ab377c53cba02a51c7613dbd9b8cedf173eac067f4aea6daf01b70700',
      iat: 1643728852,
      exp: 1643729452,
    });
  });
});
