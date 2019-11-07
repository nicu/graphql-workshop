# Pseudo-visualization

```
HTTP request
+-------------------------------------------+
| POST /graphql HTTP/1.1                    |
|                                           |
| Authorization: Bearer eyJhbG.ciOiJIU.zI1N |
| Accept : application/json                 |
+-------------------------------------------+
| query {                                   |
|   me {                                    |
|     email                                 |
|   }                                       |
| }                                         |
+--------------------+----------------------+
                     |
                     |
ApolloServer         v
+--------------------+----------------------+
| Middleware                                |
|   * [...]                                 |
|   * parse body                            |
|   * parse query into AST                  |
+-------------------------------------------+
| Middleware ({req, res}) => context        |
+-------------------------------------------+
| Resolvers                                 |
|                                           |
|   me(parent, args, context, info) {       |
|     return ...;                           |
|   }                                       |
|                                           |
+--------------------+----------------------+
                     |
                     |
HTTP response        v
+-------------------------------------------+
| HTTP/1.1 200 OK                           |
|                                           |
| Content-type: application/json            |
+-------------------------------------------+
|  {                                        |
|    "data": {                              |
|      "me": {                              |
|        "id": "u2",                        |
|        "name": "Ellie Smith",             |
|        "email": "ellie@example.com"       |
|      }                                    |
|    }                                      |
|  }                                        |
+-------------------------------------------+
```

# Setup

`yarn add --exact dotenv`

`.env`

```bash
AUTH_SECRET='shush'
```

`server.js`

```js
import jwt from 'jsonwebtoken';
```

```js
context({ req }) {
  const token = req.headers.authorization
    ? req.headers.authorization.replace('Bearer ', '')
    : null;

  if (token) {
    try {
      const loggedInUser = jwt.verify(token, process.env.AUTH_SECRET);
      return { loggedInUser };
    } catch {
      return null;
    }
  }

  return null;
}
```


`schema/index.js`

```js
type Query {
  users(name: String, email: String): [User!]!
  posts: [Post!]!
  comments: [Comment!]!
  me: User
}
```

`resolvers/Query.js`

```js
me(parent, args, { loggedInUser }, info) {
  return users.findOne({ id: loggedInUser.id });
},
```

# Authentication flow

- call the `login` mutation with the desired email address
- receive a token that needs to be sent for any following requests

`schema/index.js`

```js
type Mutation {
  login(email: String!): AuthPayload!
}

type AuthPayload {
  user: User!
  token: String!
}
```

`resolvers/Mutation.js`

```js
login(parent, args, ctx, info) {
  try {
    const user = users.findOne({ email: args.email });
    const token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET);

    return { user, token };
  } catch {
    throw new Error('User does not exist');
  }
}
```
  
# Token expiration

```js
jwt.sign({ data: 'foobar'}, 'secret', { expiresIn: '1h' });
```