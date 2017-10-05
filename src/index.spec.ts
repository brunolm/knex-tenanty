import { KnexTenanty } from './';

describe('KnexTenanty', () => {
  it('should be defined', () => {
    expect(KnexTenanty).toBeTruthy();
  });

  it('should return a function', () => {
    expect(typeof KnexTenanty({}, (req) => '')).toEqual('function');
  });
});
