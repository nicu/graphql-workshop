import Collection from '../../db/collection';

import usersData from './data/users.json';
import postsData from './data/posts.json';
import commentsData from './data/comments.json';

const users = new Collection(usersData, 'Users');
const posts = new Collection(postsData, 'Posts');
const comments = new Collection(commentsData, 'Comments');

export { users, posts, comments };
