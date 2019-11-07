`tests/Mutation.test.js`

```js
import { gql } from 'apollo-server';
import createServer from './test-server';

import Collection from '../../db/collection';

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

describe('Posts', () => {
  it('should create a new post', async () => {
    const { mutate, query } = createServer({
      loggedInUser: { id: 'u1' },
      dataSources: {
        users: new Collection(initialUsers),
        posts: new Collection([])
      }
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
```
