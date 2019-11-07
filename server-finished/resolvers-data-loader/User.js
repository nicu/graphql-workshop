const User = {
  posts(parent, args, { dataSources }, info) {
    return dataSources.posts.find({ authorId: parent.id });
  },
  comments(parent, args, { dataSources }, info) {
    return dataSources.comments.find({ authorId: parent.id });
  }
};

export default User;
