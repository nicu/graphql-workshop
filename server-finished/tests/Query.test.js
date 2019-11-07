import { gql } from 'apollo-server';
import createServer from './test-server';

import Collection from '../../db/collection';

import { usersLoader, postsLoader, commentsLoader } from '../data-loaders';

const initialUsers = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com' },
  { id: 'u2', name: 'Ellie Smith', email: 'ellie@example.com' }
];

const initialPosts = [
  {
    id: 'p1',
    authorId: 'u1',
    title: 'Understanding ECMAScript 6',
    body:
      'ECMAScript 6 represents the biggest change to the core of JavaScript in the history of the language'
  },
  {
    id: 'p2',
    authorId: 'u2',
    title: 'Speaking JavaScript ',
    body:
      'Due to its prevalence on the Web and other factors, JavaScript has become hard to avoid.'
  }
];
const initialComments = [
  { id: 'c1', postId: 'p1', authorId: 'u1', text: 'Fantastic post!' },
  { id: 'c2', postId: 'p1', authorId: 'u2', text: 'Fine' },
  { id: 'c3', postId: 'p2', authorId: 'u1', text: 'Cool' }
];

const users = new Collection(initialUsers, 'Users');
const posts = new Collection(initialPosts, 'Posts');
const comments = new Collection(initialComments, 'Comments');

const dataSources = {
  users,
  posts,
  comments,
  usersLoader: usersLoader(users),
  postsLoader: postsLoader(posts),
  commentsLoader: commentsLoader(comments)
};

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

const ALL_DATA = gql`
  query {
    users {
      id
      name
      email
    }
    posts {
      id
      title
      body
      author {
        name
      }
    }
    comments {
      id
      text
      post {
        title
      }
      author {
        name
      }
    }
  }
`;

describe('Query', () => {
  it('should return null for non authenticated user', async () => {
    const { query } = createServer({ dataSources });
    const res = await query({ query: ME });
    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual({ me: null });
  });

  it('should return the correct email for an authenticated user', async () => {
    const { query } = createServer({
      loggedInUser: { id: 'u1' },
      dataSources
    });
    const res = await query({ query: ME });
    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual({ me: { email: 'john@example.com' } });
  });

  it('should return a list of users', async () => {
    const { query } = createServer({ dataSources });
    const res = await query({ query: USERS });
    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual({
      users: [
        { id: 'u1', name: 'John Doe', email: 'john@example.com' },
        { id: 'u2', name: 'Ellie Smith', email: 'ellie@example.com' }
      ]
    });
  });

  it('should query all data', async () => {
    Collection.DEBUG_ENABLED = true;
    const { query } = createServer({ dataSources });
    const res = await query({ query: ALL_DATA });

    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual({
      users: [
        { id: 'u1', name: 'John Doe', email: 'john@example.com' },
        { id: 'u2', name: 'Ellie Smith', email: 'ellie@example.com' }
      ],
      posts: [
        {
          id: 'p1',
          title: 'Understanding ECMAScript 6',
          body:
            'ECMAScript 6 represents the biggest change to the core of JavaScript in the history of the language',
          author: {
            name: 'John Doe'
          }
        },
        {
          id: 'p2',
          title: 'Speaking JavaScript ',
          body:
            'Due to its prevalence on the Web and other factors, JavaScript has become hard to avoid.',
          author: {
            name: 'Ellie Smith'
          }
        }
      ],
      comments: [
        {
          id: 'c1',
          text: 'Fantastic post!',
          post: {
            title: 'Understanding ECMAScript 6'
          },
          author: {
            name: 'John Doe'
          }
        },
        {
          id: 'c2',
          text: 'Fine',
          post: {
            title: 'Understanding ECMAScript 6'
          },
          author: {
            name: 'Ellie Smith'
          }
        },
        {
          id: 'c3',
          text: 'Cool',
          post: {
            title: 'Speaking JavaScript '
          },
          author: {
            name: 'John Doe'
          }
        }
      ]
    });
    Collection.DEBUG_ENABLED = false;
  });
});
