import { createStore } from './createStore';

describe('zustood', () => {
  describe('when get', () => {
    const store = createStore('repo')({
      name: 'zustood',
      stars: 0,
    });

    it('should be', () => {
      expect(store.get.name()).toEqual('zustood');
    });
  });

  describe('when extending actions', () => {
    const store = createStore('repo')({
      name: 'zustood',
      stars: 0,
    })
      .extendActions((set, get, api) => ({
        validName: (name: string) => {
          set.name(name.trim());
        },
      }))
      .extendActions((set, get, api) => ({
        reset: (name: string) => {
          set.validName(name);
          set.stars(0);
        },
      }));

    it('should be', () => {
      store.set.reset('test ');

      expect(store.get.state()).toEqual({
        name: 'test',
        stars: 0,
      });
    });
  });

  describe('when extending selectors', () => {
    const store = createStore('repo')({
      name: 'zustood ',
      stars: 0,
    })
      .extendSelectors((set, get, api) => ({
        validName: () => get.name().trim(),
      }))
      .extendSelectors((set, get, api) => ({
        title: (prefix: string) =>
          `${prefix + get.validName()} with ${get.stars()} stars`,
      }));

    it('should be', () => {
      expect(store.get.title('Repository: ')).toBe(
        'Repository: zustood with 0 stars'
      );
    });
  });

  describe('when set.state', () => {
    const store = createStore('repo')({
      name: 'zustood',
      stars: 0,
    });

    it('should be', () => {
      store.set.state((draft) => {
        draft.name = 'test';
        draft.stars = 1;
      });

      expect(store.get.state()).toEqual({
        name: 'test',
        stars: 1,
      });
    });
  });
});
