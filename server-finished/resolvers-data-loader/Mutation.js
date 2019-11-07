import jwt from 'jsonwebtoken';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const Mutation = {
  async createPost(parent, args, { loggedInUser, dataSources }, info) {
    // TODO validate
    await delay(3000);
    const authorId = loggedInUser.id;
    return dataSources.posts.create({ authorId, ...args.post });
  },

  updatePost(parent, args, { dataSources }, info) {
    const [updated] = dataSources.posts.update({ id: args.id }, args.post);
    return updated;
  },

  removePost(parent, args, { dataSources }, info) {
    const [removed] = dataSources.posts.remove({ id: args.id });
    return removed;
  },

  createComment(parent, args, { loggedInUser, dataSources }, info) {
    // TODO validate
    const authorId = loggedInUser.id;
    return dataSources.comments.create({ authorId, ...args.post });
  },

  updateComment(parent, args, { dataSources }, info) {
    const [updated] = dataSources.comments.update(
      { id: args.id },
      args.comment
    );
    return updated;
  },

  removeComment(parent, args, { dataSources }, info) {
    const [removed] = dataSources.comments.remove({ id: args.id });
    return removed;
  },

  login(parent, args, { dataSources }, info) {
    try {
      const user = dataSources.usersLoader.load({ email: args.email });
      const token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET);

      return { user, token };
    } catch {
      throw new Error('User does not exist');
    }
  }
};

export default Mutation;
