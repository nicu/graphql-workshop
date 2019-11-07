const Collection = require('./collection');

describe('Collection', () => {
  it('Empty collection', () => {
    const collection = new Collection([]);
    const items = collection.findAll();
    expect(items).toEqual([]);
  });

  it('Creates new item', () => {
    const collection = new Collection([]);
    const item = collection.create({ id: 1, foo: 'bar' });
    expect(item).toEqual({ id: 1, foo: 'bar' });

    const items = collection.findAll();
    expect(items).toEqual([{ id: 1, foo: 'bar' }]);
  });

  it('Finds one item', () => {
    const collection = new Collection([
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
      { id: 3, name: 'Third' }
    ]);

    const found = collection.findOne({ id: 2 });
    expect(found).toEqual({ id: 2, name: 'Second' });
  });

  it('Finds items', () => {
    const collection = new Collection([
      { id: 1, name: 'First', match: true },
      { id: 2, name: 'Second', match: false },
      { id: 3, name: 'Third', match: true }
    ]);

    const found = collection.find({ match: true });
    expect(found).toEqual([
      { id: 1, name: 'First', match: true },
      { id: 3, name: 'Third', match: true }
    ]);
  });

  it('Update items', () => {
    const collection = new Collection([
      { id: 1, name: 'First', flag: true },
      { id: 2, name: 'Second' },
      { id: 3, name: 'Third', flag: true }
    ]);

    const updated = collection.update({ flag: true }, { flag: false });
    expect(updated).toEqual([
      { id: 1, name: 'First', flag: false },
      { id: 3, name: 'Third', flag: false }
    ]);

    const items = collection.findAll();
    expect(items).toEqual([
      { id: 1, name: 'First', flag: false },
      { id: 2, name: 'Second' },
      { id: 3, name: 'Third', flag: false }
    ]);
  });

  it('Removes items', () => {
    const collection = new Collection([
      { id: 1, name: 'First', flag: true },
      { id: 2, name: 'Second' },
      { id: 3, name: 'Third', flag: true }
    ]);

    const removed = collection.remove({ flag: true });
    expect(removed).toEqual([
      { id: 1, name: 'First', flag: true },
      { id: 3, name: 'Third', flag: true }
    ]);

    const items = collection.findAll();
    expect(items).toEqual([{ id: 2, name: 'Second' }]);
  });

  describe('associations', () => {
    it('belongsTo', () => {
      const books = new Collection([
        { id: 'b1', name: 'Book 1', authorId: 'a1' }
      ]);
      const authors = new Collection([{ id: 'a1', name: 'Author 1' }]);

      books.belongsTo(authors, 'author');

      const book = books.findOne({ id: 'b1' });
      expect(book.author).toEqual({
        id: 'a1',
        name: 'Author 1'
      });
    });

    it('hasMany', () => {
      const books = new Collection([
        { id: 'b1', name: 'Book 1', authorId: 'a1' },
        { id: 'b2', name: 'Book 2', authorId: 'a1' },
        { id: 'b3', name: 'Book 3', authorId: 'a2' }
      ]);
      const authors = new Collection([
        { id: 'a1', name: 'Author 1' },
        { id: 'a2', name: 'Author 2' }
      ]);

      authors.hasMany(books, 'books', 'authorId');

      const author = authors.findOne({ id: 'a1' });
      expect(author.books).toEqual([
        { id: 'b1', name: 'Book 1', authorId: 'a1' },
        { id: 'b2', name: 'Book 2', authorId: 'a1' }
      ]);
    });

    it('hasAndBelongsToMany', () => {
      const books = new Collection([
        { id: 'b1', title: 'Book 1' },
        { id: 'b2', title: 'Book 2' },
        { id: 'b3', title: 'Book 3' }
      ]);
      const authors = new Collection([
        { id: 'a1', name: 'Author 1' },
        { id: 'a2', name: 'Author 2' },
        { id: 'a3', name: 'Author 3' }
      ]);
      const authorsBooks = new Collection([
        { id: 1, authorId: 'a1', bookId: 'b1' },
        { id: 2, authorId: 'a1', bookId: 'b2' },
        { id: 3, authorId: 'a2', bookId: 'b3' },
        { id: 4, authorId: 'a3', bookId: 'b1' }
      ]);

      authors.hasAndBelongsToMany(
        books,
        'books',
        'authorId',
        'bookId',
        authorsBooks
      );
      books.hasAndBelongsToMany(
        authors,
        'authors',
        'bookId',
        'authorId',
        authorsBooks
      );

      const author = authors.findOne({ id: 'a1' });
      expect(author.books).toEqual([
        { id: 'b1', title: 'Book 1' },
        { id: 'b2', title: 'Book 2' }
      ]);

      const book = books.findOne({ id: 'b1' });
      expect(book.authors).toEqual([
        { id: 'a1', name: 'Author 1' },
        { id: 'a3', name: 'Author 3' }
      ]);
    });
  });
});
