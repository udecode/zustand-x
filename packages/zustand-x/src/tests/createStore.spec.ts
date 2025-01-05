import { devtools } from 'zustand/middleware';

import { createStore } from '../createStore';

describe('zustandX', () => {
  describe('when get', () => {
    const store = createStore(
      devtools(() => ({
        name: 'zustandX',
        stars: 0,
      })),
      {
        name: 'repo',
      }
    );

    it('should be', () => {
      expect(store.get.name()).toEqual('zustandX');
    });
  });

  describe('when extending actions', () => {
    const store = createStore(
      {
        name: 'zustandX',
        stars: 0,
      },
      {
        name: 'repo',
      }
    )
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
    const store = createStore(
      {
        name: 'zustandX ',
        stars: 0,
      },
      {
        name: 'repo',
      }
    )
      .extendSelectors((set, get, api) => ({
        validName: () => get.name().trim(),
      }))
      .extendSelectors((set, get, api) => ({
        title: (prefix: string) =>
          `${prefix + get.validName()} with ${get.stars()} stars`,
      }));

    it('should be', () => {
      expect(store.get.title('Repository: ')).toBe(
        'Repository: zustandX with 0 stars'
      );
    });
  });

  describe('when set.state', () => {
    const store = createStore(
      {
        name: 'zustandX',
        stars: 0,
      },
      {
        name: 'repo',
      }
    );

    it('should be', () => {
      store.set.state((draft) => {
        draft.name = 'test';
        draft.stars = 1;
        return draft;
      });

      expect(store.get.state()).toEqual({
        name: 'test',
        stars: 1,
      });
    });

    describe('deletes a property', () => {
      it('should delete that property', () => {
        const repoStore = createStore(
          {
            name: 'zustandX',
            stars: 0,
          },
          {
            name: 'repo',
            immer: {
              enabled: true,
            },
          }
        );

        repoStore.set.state((draft) => {
          delete draft.name;
        });

        expect(repoStore.get.state()).toEqual({
          stars: 0,
        });
      });
    });
  });
});
