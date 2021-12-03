# Table representation

```
+--------------------------------------+
| Users                                |
+----+-------------+-------------------+
| id | name        | email             |
+------------------+-------------------+
| u1 | John Doe    | john@example.com  |
+------------------+-------------------+
| u2 | Ellie Smith | ellie@example.com |
+----+-------------+-------------------+

+---------------------------------------------------+
| Posts                                             |
+----+----------+----------------------------+------+
| id | authorId | title                      | body |
+---------------+-----------------------------------+
| p1 |       u1 | Speaking JavaScript        | ...  |
+---------------+-----------------------------------+
| p2 |       u2 | Understanding ECMAScript 6 | ...  |
+----+----------+----------------------------+------+

+------------------------------------------+
| Comments                                 |
+----+--------+----------+-----------------+
| id | postId | authorId | text            |
+------------------------------------------+
| c1 |     p1 |       u1 | Fantastic post! |
+------------------------------------------+
| c2 |     p1 |       u2 | Fine            |
+------------------------------------------+
| c3 |     p2 |       u1 | Cool            |
+----+--------+----------+-----------------+
```

# Graph representation

```
  +-------------------+                id      +----+
  |                   |              +-------->+ u1 |
  |                   |              |         +----+
  |      comments     v              |
  |               +------+           | name    +----------+
  |   +-----------+ User +-----------+-------->+ John Doe |
  |   |           +------+           |         +----------+
  |   |              ^ |             |
  |   |              | |             | email   +------------------+
  |   |              | |             +-------->+ john@example.com |
  |   |              | |                       +------------------+
  |   |              | |
  |   |              | |
  |   |              | |
  |   |        author| |post
  |   |              | |               id           +----+
  |   |              | |             +------------->+ p2 |
  |   |              | |             |              +----+
  |   |              | v             |
  |   |            +------+          | title        +----------------------------+
  |   |            | Post +----------+------------->+ Understanding ECMAScript 6 |
  |   |            +------+          |              +----------------------------+
  |   |               ^ |            |
  |   |               | |            | body         +------------------------------+
  |   |               | |            +------------->+ the biggest change to the JS |
  |   |               | |                           +------------------------------+
  |   |           post| |comments
  |   |               | |
  |   |               | |
  |   |               | |
  |   |               | |
  |   |               | |              id      +----+
  |   |               | v            +-------->+ c1 |
  |   |           +---------         |         +----+
  |   +---------->+ Comment +--------+
  |               +---------         | text    +-----------------+
  |                    |             +-------->+ Fantastic post! |
  +--------------------+                       +-----------------+
          author
```

# Custom types

```js
type Query {
  users(name: String, email: String): [User!]!
  posts: [Post!]!
  comments: [Comment!]!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  comments: [Comment!]!
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
  comments: [Comment!]!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}
```

`resolvers.js`

```js
import Collection from '../../db/collection';

import usersData from '../mocks/users.json';
import postsData from '../mocks/posts.json';
import commentsData from '../mocks/comments.json';

const users = new Collection(usersData);
const posts = new Collection(postsData);
const comments = new Collection(commentsData);

const Query = {
  users(parent, args, ctx, info) {
    return users.find(args);
  },
  posts(parent, args, ctx, info) {
    return posts.find(args);
  },
  comments(parent, args, ctx, info) {
    return comments.find(args);
  }
};

export default { Query };
```
