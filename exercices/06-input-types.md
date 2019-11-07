`schema/index.js`

```js
input CreatePostInput {
  title: String!
  body: String!
  authorId: ID!
}

input CreateCommentInput {
  text: String!
  postId: ID!
  authorId: ID!
}

type Mutation {
  createPost(post: CreatePostInput): Post!
  createComment(comment: CreateCommentInput): Comment!
}
```


`resolvers/Mutation.js`

```js
import { posts, comments } from '../data-sources/memoryDb';

const Mutation = {
  createPost(parent, args, ctx, info) {
    // TODO validate
    return posts.create(args.post);
  },
  createComment(parent, args, ctx, info) {
    // TODO validate
    return comments.create(args.comment);
  }
};

export default Mutation;
```