import { describe, expect, it, vi } from 'vitest';

import { createVanillaStore } from '../createVanillaStore';
import { createVanillaStore as createVanillaStoreFromIndex } from '../index';

describe('createVanillaStore', () => {
  it('creates a store without React hooks', () => {
    const store = createVanillaStore(
      {
        count: 0,
        label: 'initial',
      },
      {
        name: 'vanilla-store',
      }
    );

    expect(store.get('count')).toBe(0);
    store.set('count', 1);
    expect(store.get('count')).toBe(1);

    store.set('label', (prev) => `${prev}-updated`);
    expect(store.get('label')).toBe('initial-updated');

    expect('useStore' in store).toBe(false);
    expect('useTrackedStore' in store).toBe(false);
  });

  it('supports selectors, actions, and subscriptions', () => {
    const store = createVanillaStore(
      {
        count: 0,
        tags: ['a', 'b'],
      },
      {
        name: 'vanilla-extensions',
      }
    )
      .extendSelectors(({ get }) => ({
        doubled: () => get('count') * 2,
        tagged: (prefix: string) => `${prefix}${get('tags').join(',')}`,
      }))
      .extendActions(({ set, get }) => ({
        increment: () => set('count', get('count') + 1),
        replaceTag: (index: number, value: string) => {
          const tags = [...get('tags')];
          tags.splice(index, 1, value);
          set('tags', tags);
        },
      }));

    const doubledListener = vi.fn();
    const taggedListener = vi.fn();

    store.subscribe('doubled', doubledListener);
    store.subscribe(
      'tagged',
      'prefix:',
      (value) => value.toUpperCase(),
      taggedListener
    );

    store.actions.increment();
    expect(store.get('count')).toBe(1);
    expect(store.get('doubled')).toBe(2);

    store.actions.replaceTag(1, 'c');
    expect(store.get('tags')).toEqual(['a', 'c']);
    expect(store.get('tagged', 'prefix:')).toBe('prefix:a,c');

    expect(doubledListener).toHaveBeenCalledTimes(1);
    expect(doubledListener).toHaveBeenLastCalledWith(2, 0);
    expect(taggedListener).toHaveBeenCalledTimes(1);
    expect(taggedListener).toHaveBeenLastCalledWith('PREFIX:A,C', 'PREFIX:A,B');
  });
});

describe('vanilla entry point exports', () => {
  it('re-exports createVanillaStore from the lib barrel', () => {
    expect(createVanillaStoreFromIndex).toBe(createVanillaStore);
  });
});
