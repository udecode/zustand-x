import { act, renderHook } from '@testing-library/react';
import { devtools } from 'zustand/middleware';

import { createStore } from '../createStore';
import {
  useStoreState,
  useStoreValue,
  useTrackedStore,
  useZustandStore,
} from '../useStore';

describe('zustandX', () => {
  describe('when get and set', () => {
    const store = createStore(
      devtools(() => ({
        name: 'zustandX',
        stars: 0,
      })),
      {
        name: 'repo',
      }
    );

    it('should get and set state values', () => {
      expect(store.get('name')).toEqual('zustandX');
      store.set('name', 'test');
      expect(store.get('name')).toEqual('test');
    });

    it('should get state object', () => {
      expect(store.get('state')).toEqual({
        name: 'test',
        stars: 0,
      });
    });
  });

  describe('when using hooks', () => {
    const store = createStore(
      {
        name: 'test',
        stars: 0,
      },
      {
        name: 'repo',
      }
    )
      .extendSelectors(({ get }) => ({
        validName: () => get('name').trim(),
      }))
      .extendSelectors(({ get }) => ({
        fullName: (prefix: string) => prefix + get('validName'),
      }))
      .extendSelectors(({ get }) => ({
        title: (prefix: string, suffix: number) =>
          `${prefix}${get('validName')} with ${get('stars')} stars. ${suffix}`,
      }))
      .extendSelectors(({ get }) => ({
        complexTitle: (options: { prefix: string; suffix: number }) =>
          `${options.prefix}${get('validName')} with ${get('stars')} stars. ${
            options.suffix
          }`,
      }));

    it('should use useValue for state', () => {
      const { result } = renderHook(() => store.useValue('name'));
      expect(result.current).toBe('test');
    });

    it('should use useState for state', () => {
      const { result } = renderHook(() => store.useState('name'));
      expect(result.current[0]).toBe('test');

      act(() => {
        result.current[1]('test');
      });
      expect(result.current[0]).toBe('test');
    });

    it('should use useValue for selector without params', () => {
      const { result } = renderHook(() => store.useValue('validName'));
      expect(result.current).toBe('test');
    });

    it('should use useValue for selector with one param', () => {
      const { result } = renderHook(() =>
        store.useValue('fullName', 'Repository: ')
      );
      expect(result.current).toBe('Repository: test');
    });

    it('should use useValue for selector with multiple params', () => {
      const { result } = renderHook(() =>
        store.useValue('title', 'Repository: ', 1)
      );
      expect(result.current).toBe('Repository: test with 0 stars. 1');
    });

    it('should use useValue for selector with object param', () => {
      const { result } = renderHook(() =>
        store.useValue('complexTitle', { prefix: 'Repository: ', suffix: 1 })
      );
      expect(result.current).toBe('Repository: test with 0 stars. 1');
    });

    it('should use useValue with equality function for state', () => {
      const equalityFn = (a: string, b: string) => a.length === b.length;
      const { result, rerender } = renderHook(() => [
        store.useValue('name', equalityFn),
        useStoreValue(store, 'name', equalityFn),
      ]);
      expect(result.current[0]).toBe('test');
      expect(result.current[1]).toBe('test');

      act(() => {
        store.set('name', 'tesp');
      });
      rerender();
      // Should not update since lengths are equal
      expect(result.current[0]).toBe('test');
      expect(result.current[1]).toBe('test');
    });

    it('should use useValue with equality function for selector', () => {
      const equalityFn = (a: string, b: string) => a.length === b.length;
      const { result, rerender } = renderHook(() => [
        store.useValue('title', 'Repository: ', 1, equalityFn),
        useStoreValue(store, 'title', 'Repository: ', 1, equalityFn),
      ]);
      const initial = result.current[0];
      expect(result.current[0]).toBe(initial);
      expect(result.current[1]).toBe(initial);

      act(() => {
        store.set('name', 'tesp');
      });
      rerender();
      // Should not update since lengths are equal
      expect(result.current[0]).toBe(initial);
      expect(result.current[1]).toBe(initial);
    });

    it('should use useTracked for state', () => {
      const { result } = renderHook(() => {
        const trackedValue = store.useTracked('name');
        const [value, setValue] = useStoreState(store, 'name');
        return [trackedValue, [value, setValue]] as const;
      });
      expect(result.current[0]).toBe('tesp');
      expect(result.current[1][0]).toBe('tesp');

      act(() => {
        result.current[1][1]('updated');
      });
      expect(result.current[1][0]).toBe('updated');
      expect(store.get('name')).toBe('updated');
    });

    it('should use useTrackedStore', () => {
      const { result } = renderHook(() => [
        store.useTrackedStore(),
        useTrackedStore(store),
      ]);
      expect(result.current[0]).toEqual({
        name: 'updated',
        stars: 0,
      });
      expect(result.current[1]).toEqual({
        name: 'updated',
        stars: 0,
      });
    });
  });

  describe('when extending actions', () => {
    const store = createStore(
      {
        name: 'zustandX',
        stars: 0,
        description: '',
      },
      {
        name: 'repo',
      }
    )
      .extendActions(({ set }) => ({
        validName: (name: string) => {
          set('name', name.trim());
        },
      }))
      .extendActions(({ set }) => ({
        reset: (name: string) => {
          set('validName', name);
          set('stars', 0);
        },
      }))
      .extendActions(({ set }) => ({
        updateRepo: (name: string, stars: number, description: string) => {
          set('name', name);
          set('stars', stars);
          set('description', description);
        },
      }));

    it('should execute single action', () => {
      store.actions.validName('test ');
      expect(store.get('name')).toBe('test');
    });

    it('should execute chained actions', () => {
      store.actions.reset('test ');
      expect(store.get('state')).toEqual({
        name: 'test',
        stars: 0,
        description: '',
      });
    });

    it('should handle multiple arguments', () => {
      store.actions.updateRepo('test-repo', 42, 'A test repository');
      expect(store.get('state')).toEqual({
        name: 'test-repo',
        stars: 42,
        description: 'A test repository',
      });
    });

    it('should replace same actions', () => {
      const extendedStore = store.extendActions(({ set }) => ({
        validName: (name: string) => {
          set('name', name + name);
        },
      }));

      extendedStore.set('validName', 'foo ');
      expect(extendedStore.get('name')).toBe('foo foo ');
    });

    it('should override same actions', () => {
      const extendedStore = store.extendActions(
        ({ actions: { validName } }) => ({
          validName: (name: string) => {
            validName(name + name);
          },
        })
      );

      extendedStore.set('validName', 'foo ');
      expect(extendedStore.get('name')).toBe('foo foo');
    });

    it('should pass all parameters to actions', () => {
      const another = createStore(
        {
          value: '',
        },
        {
          name: 'test-params',
        }
      ).extendActions(({ set }) => ({
        setValue: (a: string, b: string, c: string) => {
          set('value', `${a}-${b}-${c}`);
        },
      }));

      another.set('setValue', 'a', 'b', 'c');
      expect(another.get('value')).toBe('a-b-c');
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
      .extendSelectors(({ get }) => ({
        validName: () => get('name').trim(),
      }))
      .extendSelectors(({ get }) => ({
        starCount: () => get('stars'),
      }))
      .extendSelectors(({ get }) => ({
        title: (prefix: string, suffix: number) =>
          `${prefix + get('validName')} with ${get(
            'starCount'
          )} stars. ${suffix}`,
      }))
      .extendSelectors(({ get }) => ({
        complexTitle: (options: { prefix: string; suffix: number }) =>
          `${options.prefix + get('validName')} with ${get(
            'starCount'
          )} stars. ${options.suffix}`,
      }));

    const extendedStore = store.extendSelectors(({ get }) => ({
      validName: (prefix?: string) => {
        // Add optional prefix parameter
        const name = get('validName');
        return prefix ? `${prefix}${name}` : name;
      },
    }));

    it('should get selector values', () => {
      expect(store.get('validName')).toBe('zustandX');
      expect(store.get('title', 'Repository: ', 1)).toBe(
        'Repository: zustandX with 0 stars. 1'
      );
    });

    it('should get selector with complex argument', () => {
      expect(
        store.get('complexTitle', { prefix: 'Repository: ', suffix: 1 })
      ).toBe('Repository: zustandX with 0 stars. 1');
    });

    it('should update selector when state changes', () => {
      store.set('stars', 42);
      expect(store.get('title', 'Repository: ', 1)).toBe(
        'Repository: zustandX with 42 stars. 1'
      );
    });

    it('should chain selectors', () => {
      store.set('name', ' newName ');
      expect(store.get('validName')).toBe('newName');
      expect(store.get('title', 'Repository: ', 1)).toBe(
        'Repository: newName with 42 stars. 1'
      );
    });

    it('should override same selectors', () => {
      expect(extendedStore.get('validName')).toBe('newName');
      expect(extendedStore.get('validName', 'prefix_')).toBe('prefix_newName');
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

    it('should set state with function', () => {
      store.set('state', (draft) => {
        draft.name = 'test';
        draft.stars = 1;
        return draft;
      });

      expect(store.get('state')).toEqual({
        name: 'test',
        stars: 1,
      });
    });

    describe('when using immer', () => {
      it('should delete property', () => {
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

        repoStore.set('state', (draft) => {
          delete draft.name;
        });

        expect(repoStore.get('state')).toEqual({
          stars: 0,
        });
      });
    });
  });

  describe('when mixing selectors and actions', () => {
    const store = createStore(
      {
        name: 'zustandX',
        stars: 0,
        description: '',
      },
      {
        name: 'repo',
      }
    )
      // Add base selector
      .extendSelectors(({ get }) => ({
        validName: () => get('name').trim(),
      }))
      // Add action that uses the selector
      .extendActions(({ get, set }) => ({
        updateValidName: (name: string) => {
          // Get current valid name
          const currentName = get('validName');
          // Set new name with prefix
          set('name', `${currentName}_${name}`);
        },
      }))
      // Extend the selector
      .extendSelectors(({ get }) => ({
        validName: (prefix?: string) => {
          const name = get('validName');
          return prefix ? `${prefix}${name}` : name;
        },
      }))
      // Add action that uses the extended selector
      .extendActions(({ get, set }) => ({
        prefixName: (prefix: string) => {
          // Use the extended selector with prefix
          const name = get('validName', prefix);
          set('name', name);
        },
      }));

    it('should combine selectors and actions', () => {
      // Initial state
      expect(store.get('validName')).toBe('zustandX');

      // Use action that uses base selector
      store.set('updateValidName', 'test');
      expect(store.get('name')).toBe('zustandX_test');
      expect(store.get('validName')).toBe('zustandX_test');

      // Use extended selector with prefix
      expect(store.get('validName', 'prefix_')).toBe('prefix_zustandX_test');

      // Use action that uses extended selector
      store.set('prefixName', 'prefix_');
      expect(store.get('name')).toBe('prefix_zustandX_test');
    });
  });
});

describe('useZustandStore', () => {
  it('should return the underlying Zustand store hook', () => {
    const store = createStore({ name: 'test' }, { name: 'test-store' });
    const useStore = useZustandStore(store);

    // The hook should be the same as store.useStore
    expect(useStore).toBe(store.useStore);

    // Test in a component
    const { result } = renderHook(() => useStore((state) => state.name));
    expect(result.current).toBe('test');
  });
});
