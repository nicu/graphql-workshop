import DataLoader from 'dataloader';

export default users => {
  const batchUsers = ids => {
    // console.log('--- [BATCH] users', ids);
    return Promise.resolve(users.findAll(ids));
  };

  return new DataLoader(batchUsers);
};
