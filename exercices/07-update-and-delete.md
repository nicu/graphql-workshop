`schema/index.js`

```js
type Mutation {
  createPost(post: CreatePostInput): Post!
  updatePost(id: ID!, post: UpdatePostInput!): Post!
  removePost(id: ID!): Post!
  createComment(comment: CreateCommentInput): Comment!
  updateComment(id: ID!, comment: UpdateCommentInput!): Comment!
  removeComment(id: ID!): Comment!
}

input CreatePostInput {
  title: String!
  body: String!
  authorId: ID!
}

input UpdatePostInput {
  title: String!
  body: String!
}

input CreateCommentInput {
  text: String!
  postId: ID!
  authorId: ID!
}

input UpdateCommentInput {
  text: String!
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

  updatePost(parent, args, ctx, info) {
    const [updated] = posts.update({ id: args.id }, args.post);
    return updated;
  },

  removePost(parent, args, ctx, info) {
    const [removed] = posts.remove({ id: args.id });

    // remove all comments for this post
    comments.remove({ postId: removed.id });

    return removed;
  },

  createComment(parent, args, ctx, info) {
    // TODO validate
    return comments.create(args.comment);
  },

  updateComment(parent, args, ctx, info) {
    const [updated] = comments.update({ id: args.id }, args.comment);
    return updated;
  },

  removeComment(parent, args, ctx, info) {
    const [removed] = comments.remove({ id: args.id });
    return removed;
  }
};

export default Mutation;
```