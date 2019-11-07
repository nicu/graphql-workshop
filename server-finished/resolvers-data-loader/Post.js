const Post = {
  author(parent, args, { dataSources }, info) {
    // return dataSources.users.findOne({ id: parent.authorId });
    return dataSources.usersLoader.load(parent.authorId);
  },
  comments(parent, args, { dataSources }, info) {
    return dataSources.comments.find({ postId: parent.id });
  }
};

export default Post;
