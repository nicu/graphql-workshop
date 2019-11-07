import { ApolloServer } from 'apollo-server';
import jwt from 'jsonwebtoken';

import { users, posts, comments } from './data-sources/memoryDb';

import typeDefs from './schema';
import resolvers from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req }) {
    const token = req.headers.authorization
      ? req.headers.authorization.replace('Bearer ', '')
      : null;

    if (token) {
      try {
        const loggedInUser = jwt.verify(token, process.env.AUTH_SECRET);
        return { loggedInUser };
      } catch {
        return null;
      }
    }

    return null;
  },
  dataSources: () => ({
    users,
    posts,
    comments
  })
});

export default server;
export { typeDefs, resolvers };
