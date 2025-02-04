import '@testing-library/jest-dom';

import React from 'react';
import { act, render } from '@testing-library/react';

import { createZustandStore } from '../createStore';

describe('useStore', () => {
  describe('single provider', () => {
    type MyTestStoreValue = {
      name: string;
      age: number;
    };

    const INITIAL_NAME = 'John';
    const INITIAL_AGE = 42;

    const initialTestStoreValue: MyTestStoreValue = {
      name: INITIAL_NAME,
      age: INITIAL_AGE,
    };

    const store = createZustandStore(() => initialTestStoreValue, {
      name: 'myTestStore',
      immer: {
        enabled: true,
      },
    });

    const ReadOnlyConsumer = () => {
      const name = store.useValue('name');
      const age = store.useValue('age');

      return (
        <div>
          <span>{name}</span>
          <span>{age}</span>
        </div>
      );
    };

    const WriteOnlyConsumer = () => {
      return (
        <button
          type="button"
          onClick={() => {
            store.set('age', store.get('age') + 1);
          }}
        >
          consumerSetAge
        </button>
      );
    };

    beforeEach(() => {
      store.set('name', INITIAL_NAME);
      store.set('age', INITIAL_AGE);
    });

    it('read only', () => {
      const { getByText } = render(<ReadOnlyConsumer />);

      expect(getByText(INITIAL_NAME)).toBeInTheDocument();
      expect(getByText(INITIAL_AGE)).toBeInTheDocument();
    });

    it('actions', () => {
      const { getByText } = render(
        <>
          <ReadOnlyConsumer />
          <WriteOnlyConsumer />
        </>
      );
      expect(getByText(INITIAL_NAME)).toBeInTheDocument();
      expect(getByText(INITIAL_AGE)).toBeInTheDocument();

      act(() => getByText('consumerSetAge').click());

      expect(getByText(INITIAL_NAME)).toBeInTheDocument();
      expect(getByText(INITIAL_AGE + 1)).toBeInTheDocument();
      expect(store.get('age')).toBe(INITIAL_AGE + 1);
    });
  });

  describe('multiple unrelated stores', () => {
    type MyFirstTestStoreValue = { name: string };
    type MySecondTestStoreValue = { age: number };

    const initialFirstTestStoreValue: MyFirstTestStoreValue = {
      name: 'My name',
    };

    const initialSecondTestStoreValue: MySecondTestStoreValue = {
      age: 72,
    };

    const myFirstTestStoreStore = createZustandStore(
      () => initialFirstTestStoreValue,
      {
        name: 'myFirstTestStore',
        persist: {
          enabled: true,
        },
      }
    );
    const mySecondTestStoreStore = createZustandStore(
      () => initialSecondTestStoreValue,
      {
        name: 'mySecondTestStore',
      }
    );

    const FirstReadOnlyConsumer = () => {
      const name = myFirstTestStoreStore.useValue('name');

      return (
        <div>
          <span>{name}</span>
        </div>
      );
    };

    const SecondReadOnlyConsumer = () => {
      const age = mySecondTestStoreStore.useValue('age');

      return (
        <div>
          <span>{age}</span>
        </div>
      );
    };

    it('returns the value for the correct store', () => {
      const { getByText } = render(
        <>
          <FirstReadOnlyConsumer />
          <SecondReadOnlyConsumer />
        </>
      );

      expect(getByText('My name')).toBeInTheDocument();
      expect(getByText(72)).toBeInTheDocument();
    });
  });
});
