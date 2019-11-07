const Comment = {
  author(parent, args, { dataSources }, info) {
    return dataSources.usersLoader.load(parent.authorId);
  },
  post(parent, args, { dataSources }, info) {
    return dataSources.postsLoader.load(parent.postId);
  }
};

export default Comment;
