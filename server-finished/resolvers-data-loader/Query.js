const Query = {
  me(parent, args, { loggedInUser, dataSources }, info) {
    if (!loggedInUser || !loggedInUser.id) {
      return null;
    }
    return dataSources.usersLoader.load(loggedInUser.id);
  },

  users(parent, args, { dataSources }, info) {
    const users = dataSources.users.find(args);
    for (let user of users) {
      dataSources.usersLoader.prime(user.id, user);
    }
    return users;
  },
  posts(parent, args, { dataSources }, info) {
    const posts = dataSources.posts.find(args);
    for (let post of posts) {
      dataSources.postsLoader.prime(post.id, post);
    }
    return posts;
  },
  comments(parent, args, { dataSources }, info) {
    const comments = dataSources.comments.find(args);
    for (let comment of comments) {
      dataSources.commentsLoader.prime(comment.id, comment);
    }
    return comments;
  }
};

export default Query;
