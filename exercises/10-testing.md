# Testing

https://www.apollographql.com/docs/apollo-server/testing/testing

# Setup

> ## Note!
>
> Refactor the server to export a server definition instead and  
>  start listening in a separate file so we can import the server in our tests

```bash
yarn add --exact -D apollo-server-testing
```

`package.json`

```bash
"scripts": {
  "test": "jest"
},
"jest": {
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/db/"
  ]
}
```

`tests/test-server.js`

```js
import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from '../server';
import { createTestClient } from 'apollo-server-testing';

const defaultContext = () => ({});

const createServer = ({ context = defaultContext } = {}) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });

  return createTestClient(server);
};

export default createServer;
```

`tests/Query.test.js`

```js
import { gql } from 'apollo-server';
import createServer from '../tests/test-server';

const ME = gql`
  query {
    me {
      email
    }
  }
`;

const USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

describe('Query', () => {
  it('should return null for non authenticated user', async () => {
    const { query } = createServer();
    const res = await query({ query: ME });
    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual({ me: null });
  });

  it('should return the correct email for an authenticated user', async () => {
    const { query } = createServer({
      context: () => ({
        loggedInUser: { id: 'u1' }
      })
    });
    const res = await query({ query: ME });
    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual({ me: { email: 'john@example.com' } });
  });

  it('should return a list of users', async () => {
    const { query } = createServer();
    const res = await query({ query: USERS });
    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual({
      users: [
        {
          id: 'u1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        {
          id: 'u2',
          name: 'Ellie Smith',
          email: 'ellie@example.com'
        }
      ]
    });
  });
});
```
