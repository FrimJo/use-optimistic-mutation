import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useQuery } from 'react-query';
import useOptimisticMutation from '../.';

interface IUser {
  name: string;
}
let USER_DB_MOCK: IUser = { name: 'Lisa' };

function getUser(): Promise<IUser> {
  return new Promise(resolve =>
    setTimeout(() => {
      console.log('getUser USER_DB_MOCK', USER_DB_MOCK);
      resolve(USER_DB_MOCK);
    }, 1000)
  );
}

function updateUser(user: IUser): Promise<IUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // return reject('Some error');
      console.log('updateUser', user);
      USER_DB_MOCK = user;
      console.log('updateUser USER_DB_MOCK', USER_DB_MOCK);
      return resolve(USER_DB_MOCK);
    }, 1000);
  });
}

const App = () => {
  const { data, status } = useQuery(['user'], getUser);
  const [update] = useOptimisticMutation(['user'], updateUser);

  if (status === 'loading') {
    return <h5>Fetching name…</h5>;
  }
  if (data === undefined) {
    return <h5>No user received</h5>;
  }
  return (
    <div>
      <h4>Name: {data.name}</h4>
      <button onClick={() => update({ name: 'Marge' })}>
        Update name optimisticly
      </button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// type OptimisticMutateFunction<
//   TResults,
//   TVariables extends object
// > = MutateFunction<TResults, TVariables>;

// /**
//  * Proivded updateQuery key is used to expose a function to optimistically mutate that query.
//  * When using exposed mutate function, query will be set to provided value, while running the mutation,
//  * if the mutation fails, query is reset to previous value.
//  *
//  * @param queryKey The query key of the query to optimistically mutate.
//  * @param mutationFn  The function to use to mutate the query.
//  * @param mutationOptions Options to use in the useMutation hook.
//  */
// export default function useOptimisticMutation<
//   TResults,
//   TVariables extends object
// >(
//   queryKey: QueryKey,
//   mutationFn: MutationFunction<TResults, TVariables>,
//   mutationOptions: MutationOptions<TResults, TVariables> = {}
// ): [OptimisticMutateFunction<TResults, TVariables>, MutationState<TResults>] {
//   return useMutation(mutationFn, {
//     ...mutationOptions,
//     onMutate: newVariables => {
//       console.log('onMutate newVariables', newVariables);
//       console.log('onMutate queryKey', queryKey);
//       if (!queryKey) {
//         return undefined;
//       }

//       const updateQuery: string | [string, object] =
//         typeof queryKey === 'string' ? queryKey : [queryKey[0], queryKey[1]];
//       console.log('onMutate updateQuery', updateQuery);

//       // Snapshot the previous value
//       const previousTodo = queryCache.getQueryData<TResults>(updateQuery);

//       // Optimistically update to the new value
//       queryCache.setQueryData(queryKey, newVariables);

//       // Return the snapshotted value
//       return previousTodo;
//     },
//     onError: (error, newVariables, previousVariables) => {
//       console.log('onError err', error);
//       console.log('onError newVariables', newVariables);
//       console.log('onError previousVariables', previousVariables);
//       console.log('onError queryKey', queryKey);
//       queryCache.setQueryData(queryKey, previousVariables);
//       // return error;
//     },
//     onSettled: () => {
//       console.log('onSettled queryKey', queryKey);
//       return queryCache.refetchQueries(queryKey);
//     },
//   });
// }
