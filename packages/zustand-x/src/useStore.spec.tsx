import '@testing-library/jest-dom';

import React from 'react';
import { act, render, renderHook } from '@testing-library/react';

import { createZustandStore } from './createStore';

describe('createAtomStore', () => {
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

    const store = createZustandStore('myTestStore')(initialTestStoreValue);
    const useSelectors = () => store.use;
    const actions = store.set;
    const selectors = store.get;

    const ReadOnlyConsumer = () => {
      const name = useSelectors().name();
      const age = useSelectors().age();

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
            selectors.age();
            actions.age(selectors.age() + 1);
          }}
        >
          consumerSetAge
        </button>
      );
    };

    const MUTABLE_PROVIDER_INITIAL_AGE = 19;
    const MUTABLE_PROVIDER_NEW_AGE = 20;

    // const MutableProvider = ({ children }: { children: ReactNode }) => {
    //   const [age, setAge] = useState(MUTABLE_PROVIDER_INITIAL_AGE);
    //
    //   return (
    //     <>
    //       <MyTestStoreProvider age={age}>{children}</MyTestStoreProvider>
    //
    //       <button
    //         type="button"
    //         onClick={() => setAge(MUTABLE_PROVIDER_NEW_AGE)}
    //       >
    //         providerSetAge
    //       </button>
    //     </>
    //   );
    // };

    beforeEach(() => {
      renderHook(() => actions.name(INITIAL_NAME));
      renderHook(() => actions.age(INITIAL_AGE));
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
      expect(store.store.getState().age).toBe(INITIAL_AGE + 1);
    });
  });
});
