const Query = {
  me(parent, args, { loggedInUser, dataSources }, info) {
    return dataSources.users.findOne({
      id: loggedInUser ? loggedInUser.id : null
    });
  },

  users(parent, args, { dataSources }, info) {
    return dataSources.users.find(args);
  },
  posts(parent, args, { dataSources }, info) {
    return dataSources.posts.find(args);
  },
  comments(parent, args, { dataSources }, info) {
    return dataSources.comments.find(args);
  }
};

export default Query;
