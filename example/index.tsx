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
  console.log('data', data)
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
