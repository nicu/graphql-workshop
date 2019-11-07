import { ApolloServer } from 'apollo-server';
import jwt from 'jsonwebtoken';

import { users, posts, comments } from './data-sources/memoryDb';
import { usersLoader, postsLoader, commentsLoader } from './data-loaders';

import typeDefs from './schema';
import resolvers from './resolvers-data-loader';

import VisibleToOwner from './custom-directive/VisibleToOwner';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req }) {
    let loggedInUser = null;

    const token = req.headers.authorization
      ? req.headers.authorization.replace('Bearer ', '')
      : null;

    if (token) {
      try {
        loggedInUser = jwt.verify(token, process.env.AUTH_SECRET);
      } catch {
        loggedInUser = null;
      }
    }

    return {
      loggedInUser
    };
  },
  dataSources: () => ({
    users,
    posts,
    comments,

    usersLoader: usersLoader(users),
    postsLoader: postsLoader(posts),
    commentsLoader: commentsLoader(comments)
  }),
  schemaDirectives: {
    visibleToOwner: VisibleToOwner
  }
});

export default server;
export { typeDefs, resolvers };
