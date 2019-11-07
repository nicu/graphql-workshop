import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from '../server';
import { createTestClient } from 'apollo-server-testing';

const createServer = context => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => context
  });

  return createTestClient(server);
};

export default createServer;
