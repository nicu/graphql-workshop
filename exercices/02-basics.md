# Basics

https://graphql.org/learn/schema

`schema/index.js`

```js
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

export default typeDefs;
```

`resolvers.js`

```js
const Query = {
  hello(parent, args, ctx, info) {
    return 'world';
  }
};

export default { Query };
```

# Examples

- query arguments
- async resolver
- arrays
- custom types
- errors (https://www.apollographql.com/docs/apollo-server/data/errors)
