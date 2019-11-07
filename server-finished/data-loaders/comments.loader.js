import DataLoader from 'dataloader';

export default comments => {
  const batchComments = ids => {
    // console.log('--- [BATCH] comments', ids);
    return Promise.resolve(comments.find(ids));
  };

  return new DataLoader(batchComments);
};
