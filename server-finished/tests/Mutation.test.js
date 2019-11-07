import { gql } from 'apollo-server';
import createServer from './test-server';

import Collection from '../../db/collection';
import { usersLoader, postsLoader } from '../data-loaders';

const initialUsers = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com' }
];

const CREATE_POSTS = gql`
  mutation createPostMutation($post: CreatePostInput) {
    createPost(post: $post) {
      title
      body
    }
  }
`;

const POSTS = gql`
  query {
    posts {
      title
      body
    }
  }
`;

const users = new Collection(initialUsers, 'Users');
const posts = new Collection([], 'Posts');

const dataSources = {
  users,
  posts,
  usersLoader: usersLoader(users),
  postsLoader: postsLoader(posts)
};

describe('Posts', () => {
  it('should create a new post', async () => {
    const { mutate, query } = createServer({
      loggedInUser: { id: 'u1' },
      dataSources
    });

    const post = {
      title: 'New post',
      body: 'Created from a test, via variables'
    };

    let res = await mutate({ mutation: CREATE_POSTS, variables: { post } });
    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual({
      createPost: post
    });

    res = await query({ query: POSTS });
    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual({
      posts: [post]
    });
  });
});
