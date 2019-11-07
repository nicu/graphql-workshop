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
