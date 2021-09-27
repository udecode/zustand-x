import { createStore } from './createStore';

describe('when init', () => {
  it('should be', () => {
    expect(
      createStore('test')({
        test: 1,
      }).get.test()
    ).toEqual(1);
  });
});
