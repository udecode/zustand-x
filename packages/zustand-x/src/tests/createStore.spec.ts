import { act, renderHook } from '@testing-library/react';
import { devtools } from 'zustand/middleware';

import { createStore } from '../createStore';
import {
  useStoreSelect,
  useStoreState,
  useStoreValue,
  useTrackedStore,
} from '../useStore';

describe('zustandX', () => {
  describe('when get and set and subscribe', () => {
    const store = createStore(
      devtools(() => ({
        name: 'zustandX',
        stars: 0,
      })),
      {
        name: 'repo',
      }
    );

    beforeEach(() => {
      store.set('state', {
        name: 'zustandX',
        stars: 0,
      });
    });

    it('should get and set state values', () => {
      expect(store.get('name')).toEqual('zustandX');
      store.set('name', 'test');
      expect(store.get('name')).toEqual('test');
    });

    it('should get state object', () => {
      expect(store.get('state')).toEqual({
        name: 'zustandX',
        stars: 0,
      });
      store.set('name', 'test');
      expect(store.get('state')).toEqual({
        name: 'test',
        stars: 0,
      });
    });

    it('should be able to subscribe values', () => {
      const nameListener = vi.fn();
      const doubleStarsListener = vi.fn();
      const starStringListener = vi.fn();

      store.subscribe('name', nameListener);
      store.subscribe('stars', (s) => s * 2, doubleStarsListener);
      store.subscribe('stars', (s) => `Stars: ${s}`, starStringListener, {
        fireImmediately: true,
        equalityFn: (a, b) => a.length === b.length,
      });

      expect(nameListener).not.toHaveBeenCalled();
      expect(doubleStarsListener).not.toHaveBeenCalled();
      expect(starStringListener).toHaveBeenCalledTimes(1);
      expect(starStringListener).toHaveBeenLastCalledWith(
        'Stars: 0',
        'Stars: 0'
      );

      store.set('name', 'test');
      expect(nameListener).toHaveBeenCalledTimes(1);
      expect(nameListener).toHaveBeenLastCalledWith('test', 'zustandX');
      expect(doubleStarsListener).not.toHaveBeenCalled();
      expect(starStringListener).toHaveBeenCalledTimes(1);

      store.set('stars', 3);
      expect(nameListener).toHaveBeenCalledTimes(1);
      expect(doubleStarsListener).toHaveBeenCalledTimes(1);
      expect(doubleStarsListener).toHaveBeenLastCalledWith(6, 0);
      expect(starStringListener).toHaveBeenCalledTimes(1);

      store.set('stars', 10);
      expect(nameListener).toHaveBeenCalledTimes(1);
      expect(doubleStarsListener).toHaveBeenCalledTimes(2);
      expect(doubleStarsListener).toHaveBeenLastCalledWith(20, 6);
      expect(starStringListener).toHaveBeenCalledTimes(2);
      expect(starStringListener).toHaveBeenLastCalledWith(
        'Stars: 10',
        'Stars: 0'
      );
    });

    it('should be able to subscribe state object', () => {
      const stateListener = vi.fn();
      const nameListener = vi.fn();
      const starsListener = vi.fn();

      store.subscribe('state', stateListener);
      store.subscribe('state', (s) => s.name, nameListener);
      store.subscribe('state', (s) => s.stars, starsListener, {
        fireImmediately: true,
        equalityFn: (a, b) => a === b,
      });

      expect(stateListener).not.toHaveBeenCalled();
      expect(nameListener).not.toHaveBeenCalled();
      expect(starsListener).toHaveBeenCalledTimes(1);
      expect(starsListener).toHaveBeenLastCalledWith(0, 0);

      store.set('name', 'test');
      expect(stateListener).toHaveBeenCalledTimes(1);
      expect(stateListener).toHaveBeenLastCalledWith(
        { name: 'test', stars: 0 },
        { name: 'zustandX', stars: 0 }
      );
      expect(nameListener).toHaveBeenCalledTimes(1);
      expect(nameListener).toHaveBeenLastCalledWith('test', 'zustandX');
      expect(starsListener).toHaveBeenCalledTimes(1);

      store.set('state', { name: 'test', stars: 3 });
      expect(stateListener).toHaveBeenCalledTimes(2);
      expect(stateListener).toHaveBeenLastCalledWith(
        { name: 'test', stars: 3 },
        { name: 'test', stars: 0 }
      );
      expect(nameListener).toHaveBeenCalledTimes(1);
      expect(starsListener).toHaveBeenCalledTimes(2);
      expect(starsListener).toHaveBeenLastCalledWith(3, 0);
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
    const initialTags: string[] = ['tag1', 'tag2'];
    const store = createStore(
      {
        name: 'zustandX',
        stars: 0,
        description: '',
        tags: initialTags,
      },
      {
        name: 'repo',
        immer: {
          enabled: true,
        },
      }
    )
      .extendActions(({ set }) => ({
        validName: (name: string) => {
          set('name', name.trim());
        },
        validNameWithCallback: (lastName: string) => {
          set('name', (firstName) => firstName + ' ' + lastName);
        },
        replace2ndTag: (tag: string) => {
          set('state', (draft) => {
            draft.tags?.splice(1, 1, tag);
            return draft;
          });
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

    it('should execute action with callback', () => {
      store.actions.validNameWithCallback('test');
      expect(store.get('name')).toBe('test test');
    });

    it('should execute action with immer', () => {
      store.actions.replace2ndTag('tag3');
      expect(store.get('tags')).toEqual(['tag1', 'tag3']);
      expect(store.get('tags')).not.toBe(initialTags);
    });

    it('should execute chained actions', () => {
      store.actions.reset('test ');
      expect(store.get('state')).toEqual({
        name: 'test',
        stars: 0,
        description: '',
        tags: ['tag1', 'tag3'],
      });
    });

    it('should handle multiple arguments', () => {
      store.actions.updateRepo('test-repo', 42, 'A test repository');
      expect(store.get('state')).toEqual({
        name: 'test-repo',
        stars: 42,
        description: 'A test repository',
        tags: ['tag1', 'tag3'],
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

    beforeEach(() => {
      store.set('state', {
        name: 'zustandX',
        stars: 0,
      });
    });

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
      store.set('stars', 42);
      store.set('name', ' newName ');
      expect(store.get('validName')).toBe('newName');
      expect(store.get('title', 'Repository: ', 1)).toBe(
        'Repository: newName with 42 stars. 1'
      );
    });

    it('should override same selectors', () => {
      store.set('stars', 42);
      store.set('name', ' newName ');
      expect(extendedStore.get('validName')).toBe('newName');
      expect(extendedStore.get('validName', 'prefix_')).toBe('prefix_newName');
    });

    it('should subscribe to selector', () => {
      store.set('stars', 42);
      store.set('name', ' newName ');
      const validNameListener = vi.fn();
      const uppercaseValidNameListener = vi.fn();
      const uppercaseValidNameListener2 = vi.fn();
      const uppercaseValidNameWithOptionListener = vi.fn();

      const complexTitleListener = vi.fn();
      const uppercaseComplexTitleListener = vi.fn();
      const uppercaseComplexTitleListener2 = vi.fn();
      const uppercaseComplexTitleWithOptionListener = vi.fn();

      store.subscribe('validName', validNameListener);
      store.subscribe(
        'validName',
        (name) => name.toUpperCase(),
        uppercaseValidNameListener
      );
      store.subscribe(
        'validName',
        (name) => name.toUpperCase(),
        uppercaseValidNameListener2,
        // eslint-disable-next-line unicorn/no-useless-undefined -- for testing
        undefined
      );
      store.subscribe(
        'validName',
        (name) => name.toUpperCase(),
        uppercaseValidNameWithOptionListener,
        {
          fireImmediately: true,
          equalityFn: (a, b) => a.length === b.length,
        }
      );

      store.subscribe(
        'complexTitle',
        { prefix: 'Prefix1: ', suffix: 1 },
        complexTitleListener
      );
      store.subscribe(
        'complexTitle',
        { prefix: 'Prefix2: ', suffix: 2 },
        (title) => title.toUpperCase(),
        uppercaseComplexTitleListener
      );
      store.subscribe(
        'complexTitle',
        { prefix: 'Prefix3: ', suffix: 3 },
        (title) => title.toUpperCase(),
        uppercaseComplexTitleListener2,
        // eslint-disable-next-line unicorn/no-useless-undefined -- for testing
        undefined
      );
      store.subscribe(
        'complexTitle',
        { prefix: 'Prefix4: ', suffix: 4 },
        (title) => title.toUpperCase(),
        uppercaseComplexTitleWithOptionListener,
        {
          fireImmediately: true,
          equalityFn: (a, b) => a.length === b.length,
        }
      );

      expect(validNameListener).not.toHaveBeenCalled();
      expect(uppercaseValidNameListener).not.toHaveBeenCalled();
      expect(uppercaseValidNameListener2).not.toHaveBeenCalled();
      expect(uppercaseValidNameWithOptionListener).toHaveBeenCalledTimes(1);
      expect(uppercaseValidNameWithOptionListener).toHaveBeenLastCalledWith(
        'NEWNAME',
        'NEWNAME'
      );

      expect(complexTitleListener).not.toHaveBeenCalled();
      expect(uppercaseComplexTitleListener).not.toHaveBeenCalled();
      expect(uppercaseComplexTitleListener2).not.toHaveBeenCalled();
      expect(uppercaseComplexTitleWithOptionListener).toHaveBeenCalledTimes(1);
      expect(uppercaseComplexTitleWithOptionListener).toHaveBeenLastCalledWith(
        'PREFIX4: NEWNAME WITH 42 STARS. 4',
        'PREFIX4: NEWNAME WITH 42 STARS. 4'
      );

      store.set('name', 'NEWNAME');
      expect(validNameListener).toHaveBeenCalledTimes(1);
      expect(validNameListener).toHaveBeenLastCalledWith('NEWNAME', 'newName');
      expect(uppercaseValidNameListener).not.toHaveBeenCalled();
      expect(uppercaseValidNameListener2).not.toHaveBeenCalled();
      expect(uppercaseValidNameWithOptionListener).toHaveBeenCalledTimes(1);

      expect(complexTitleListener).toHaveBeenCalledTimes(1);
      expect(complexTitleListener).toHaveBeenLastCalledWith(
        'Prefix1: NEWNAME with 42 stars. 1',
        'Prefix1: newName with 42 stars. 1'
      );
      expect(uppercaseComplexTitleListener).not.toHaveBeenCalled();
      expect(uppercaseComplexTitleListener2).not.toHaveBeenCalled();
      expect(uppercaseComplexTitleWithOptionListener).toHaveBeenCalledTimes(1);

      store.set('name', 'zustand');
      expect(validNameListener).toHaveBeenCalledTimes(2);
      expect(validNameListener).toHaveBeenLastCalledWith('zustand', 'NEWNAME');
      expect(uppercaseValidNameListener).toHaveBeenCalledTimes(1);
      expect(uppercaseValidNameListener).toHaveBeenLastCalledWith(
        'ZUSTAND',
        'NEWNAME'
      );
      expect(uppercaseValidNameListener2).toHaveBeenCalledTimes(1);
      expect(uppercaseValidNameListener2).toHaveBeenLastCalledWith(
        'ZUSTAND',
        'NEWNAME'
      );
      expect(uppercaseValidNameWithOptionListener).toHaveBeenCalledTimes(1);

      expect(complexTitleListener).toHaveBeenCalledTimes(2);
      expect(complexTitleListener).toHaveBeenLastCalledWith(
        'Prefix1: zustand with 42 stars. 1',
        'Prefix1: NEWNAME with 42 stars. 1'
      );
      expect(uppercaseComplexTitleListener).toHaveBeenCalledTimes(1);
      expect(uppercaseComplexTitleListener).toHaveBeenLastCalledWith(
        'PREFIX2: ZUSTAND WITH 42 STARS. 2',
        'PREFIX2: NEWNAME WITH 42 STARS. 2'
      );
      expect(uppercaseComplexTitleListener2).toHaveBeenCalledTimes(1);
      expect(uppercaseComplexTitleListener2).toHaveBeenLastCalledWith(
        'PREFIX3: ZUSTAND WITH 42 STARS. 3',
        'PREFIX3: NEWNAME WITH 42 STARS. 3'
      );
      expect(uppercaseComplexTitleWithOptionListener).toHaveBeenCalledTimes(1);

      store.set('name', 'zustandX');
      expect(validNameListener).toHaveBeenCalledTimes(3);
      expect(validNameListener).toHaveBeenLastCalledWith('zustandX', 'zustand');
      expect(uppercaseValidNameListener).toHaveBeenCalledTimes(2);
      expect(uppercaseValidNameListener).toHaveBeenLastCalledWith(
        'ZUSTANDX',
        'ZUSTAND'
      );
      expect(uppercaseValidNameListener2).toHaveBeenCalledTimes(2);
      expect(uppercaseValidNameListener2).toHaveBeenLastCalledWith(
        'ZUSTANDX',
        'ZUSTAND'
      );
      expect(uppercaseValidNameWithOptionListener).toHaveBeenCalledTimes(2);
      expect(uppercaseValidNameWithOptionListener).toHaveBeenLastCalledWith(
        'ZUSTANDX',
        'NEWNAME'
      );

      expect(complexTitleListener).toHaveBeenCalledTimes(3);
      expect(complexTitleListener).toHaveBeenLastCalledWith(
        'Prefix1: zustandX with 42 stars. 1',
        'Prefix1: zustand with 42 stars. 1'
      );
      expect(uppercaseComplexTitleListener).toHaveBeenCalledTimes(2);
      expect(uppercaseComplexTitleListener).toHaveBeenLastCalledWith(
        'PREFIX2: ZUSTANDX WITH 42 STARS. 2',
        'PREFIX2: ZUSTAND WITH 42 STARS. 2'
      );
      expect(uppercaseComplexTitleListener2).toHaveBeenCalledTimes(2);
      expect(uppercaseComplexTitleListener2).toHaveBeenLastCalledWith(
        'PREFIX3: ZUSTANDX WITH 42 STARS. 3',
        'PREFIX3: ZUSTAND WITH 42 STARS. 3'
      );
      expect(uppercaseComplexTitleWithOptionListener).toHaveBeenCalledTimes(2);
      expect(uppercaseComplexTitleWithOptionListener).toHaveBeenLastCalledWith(
        'PREFIX4: ZUSTANDX WITH 42 STARS. 4',
        'PREFIX4: NEWNAME WITH 42 STARS. 4'
      );
    });
  });

  describe('when set.state', () => {
    const initialTags: string[] = ['tag1', 'tag2'];
    const store = createStore(
      {
        name: 'zustandX',
        stars: 0,
        tags: initialTags,
      },
      {
        name: 'repo',
        immer: {
          enabled: true,
        },
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
        tags: ['tag1', 'tag2'],
      });

      store.set('state', (draft) => {
        draft.tags?.splice(1, 1, 'tag3', 'tag4');
        return draft;
      });

      expect(store.get('tags')).not.toBe(initialTags);
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

describe('useStoreSelect', () => {
  it('should use the underlying Zustand store hook', () => {
    const store = createStore({ name: 'test' }, { name: 'test-store' });

    // Test in a component
    const { result } = renderHook(() =>
      useStoreSelect(
        store,
        (state) => state.name,
        (a, b) => a === b
      )
    );
    expect(result.current).toBe('test');
  });
});
