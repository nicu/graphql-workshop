import React from 'react';
import { render } from 'react-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import Me from './Me';
import Posts from './Posts';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InUxIiwiaWF0IjoxNTczMDUwODk1fQ.zcZ29duZ8QLoBHQsQy7JBG2XukH0b0OQ0wb8CHs_HzU'
  }
});

const App = () => (
  <ApolloProvider client={client}>
    <Me />
    <Posts />
  </ApolloProvider>
);

render(<App />, document.getElementById('app'));
