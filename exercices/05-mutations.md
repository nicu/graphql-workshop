`schema/index.js`

```js
type Mutation {
  createPost(title: String!, body: String!, authorId: ID!): Post!
  createComment(text: String!, postId: ID!, authorId: ID!): Comment!
}
```


`resolvers/Mutation.js`

```js
import { posts, comments } from '../data-sources/memoryDb';

const Mutation = {
  createPost(parent, args, ctx, info) {
    // TODO validate
    return posts.create(args);
  },
  createComment(parent, args, ctx, info) {
    // TODO validate
    return comments.create(args);
  }
};

export default Mutation;
```