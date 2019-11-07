import server from './server-data-loader';

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
