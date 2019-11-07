import DataLoader from 'dataloader';

export default posts => {
  const batchPosts = ids => {
    // console.log('--- [BATCH] posts', ids);
    return Promise.resolve(posts.findAll(ids));
  };

  return new DataLoader(batchPosts);
};
