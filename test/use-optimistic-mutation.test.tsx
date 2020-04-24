import { cleanup, render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
// import {act} from react-dom/test-utils
import * as React from 'react';
import { useQuery } from 'react-query';
import useOptimisticMutation from '../src';
// import TestRenderer from 'react-test-renderer'

// const { act } = TestRenderer

afterEach(cleanup);

const fetchTest = (): Promise<string> =>
  new Promise(resolve => {
    setTimeout(() => resolve('test'), 1000);
  });

const mutateTest = (): Promise<string> =>
  new Promise(resolve => {
    setTimeout(() => resolve('test'), 1000);
  });

describe('', () => {
  test('', async () => {
    function Page() {
      const queryState = useQuery('hookTest', fetchTest);
      return (
        <>
          <div data-testid="use-query">{JSON.stringify(queryState)}</div>
        </>
      );
    }
    const { getByTestId } = render(<Page />);
    const queryState = JSON.parse(
      getByTestId('use-query').textContent || JSON.stringify({})
    );
    expect(queryState.data).toEqual(undefined);

    const { result, waitForNextUpdate } = renderHook(() =>
      useOptimisticMutation('hookTest', mutateTest)
    );
    const [mutate] = result.current;
    await act(async () => {
      await mutate();
    });

    await waitForNextUpdate();

    // expect(queryState.data).toEqual('test')
  });
});
