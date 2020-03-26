# use-optimistic-mutation

>

[![NPM](https://img.shields.io/npm/v/use-optimistic-mutation.svg)](https://www.npmjs.com/package/use-optimistic-mutation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-optimistic-mutation
```

## Usage

```tsx
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
      resolve(USER_DB_MOCK);
    }, 1000)
  );
}

function updateUser(user: IUser): Promise<IUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      USER_DB_MOCK = user;
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
```

## License

MIT © [FrimJo](https://github.com/FrimJo)
