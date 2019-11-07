`resolvers/User.js`

```js
import { posts, comments } from '../data-sources/memoryDb';

const User = {
  posts(parent, args, ctx, info) {
    return posts.find({ authorId: parent.id });
  },
  comments(parent, args, ctx, info) {
    return comments.find({ authorId: parent.id });
  }
};

export default User;
```

`resolvers/Post.js`

```js
import { users, comments } from '../data-sources/memoryDb';

const Post = {
  author(parent, args, ctx, info) {
    return users.findOne({ id: parent.authorId });
  },
  comments(parent, args, ctx, info) {
    return comments.find({ postId: parent.id });
  }
};

export default Post;
```

`resolvers/Comment.js`

```js
import { users, posts } from '../data-sources/memoryDb';

const Comment = {
  author(parent, args, ctx, info) {
    return users.findOne({ id: parent.authorId });
  },
  post(parent, args, ctx, info) {
    return posts.findOne({ id: parent.postId });
  }
};

export default Comment;
```