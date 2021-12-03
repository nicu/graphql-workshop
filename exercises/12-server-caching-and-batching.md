- apollo hermes video https://youtu.be/Vjf7sjgMqfk
  - slides: https://slides.com/benjamn/apollo-client-caching-in-depth
- resolvers best practices: https://medium.com/paypal-engineering/graphql-resolvers-best-practices-cd36fdbcef55#af23
- data-loader: https://github.com/graphql/dataloader#caching-per-request
- https://www.apollographql.com/docs/react/caching/cache-configuration/#data-normalization

# Caching (per request) and batching

- data-loader

```bash
yarn add --exact dataloader
```

`data-loaders/users.loader.js`

```js
import DataLoader from 'dataloader';

export default users => {
  const batchUsers = ids => {
    // console.log('--- [BATCH] users', ids);
    return Promise.resolve(users.findAll(ids));
  };

  return new DataLoader(batchUsers);
};
```
