- https://www.apollographql.com/docs/apollo-server/security/authentication/#authorization-via-custom-directives

- https://blog.apollographql.com/reusable-graphql-schema-directives-131fb3a177d1

# Custom directive proposal

```js
directive @visibleToOwner(message: String) on FIELD_DEFINITION

type User {
  id: ID!
  name: String!
  email: String! @visibleToOwner(message: "private")
  posts: [Post!]!
  comments: [Comment!]!
}
  ```

`VisibleToOwner.js`

```js
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';

class VisibleToOwner extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { message } = this.args;

    field.resolve = async function(source, args, context, info) {
      if (!context.loggedInUser || context.loggedInUser.id !== source.id) {
        return message;
      }

      return await resolve.call(this, source, args, context, info);
    };
  }
}

export default VisibleToOwner;
```