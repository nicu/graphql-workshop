const Comment = {
  author(parent, args, { dataSources }, info) {
    return dataSources.users.findOne({ id: parent.authorId });
  },
  post(parent, args, { dataSources }, info) {
    return dataSources.posts.findOne({ id: parent.postId });
  }
};

export default Comment;
