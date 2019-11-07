import React from 'react';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const ME = gql`
  query {
    me {
      name
      email
    }
  }
`;

const Me = () => {
  const { loading, error, data } = useQuery(ME);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (!data.me) return <p>Not logged in</p>;

  return (
    <p>
      {data.me.name} ( <strong> {data.me.email} </strong> )
    </p>
  );
};

export default Me;
