const Post = {
  author(parent, args, { dataSources }, info) {
    return dataSources.users.findOne({ id: parent.authorId });
  },
  comments(parent, args, { dataSources }, info) {
    return dataSources.comments.find({ postId: parent.id });
  }
};

export default Post;
