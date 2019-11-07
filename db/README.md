# Collections

- Authors
- Books

# Associations

## Belongs to

```
+--------------+                       +----------+
| Books        |                       | Authors  |
+--------------+                       +----------+
| id           |                 +---->+ id       |
| title        |                 |     | name     |
+--------------+                 |     +----------+
| authorId     +-----------------+
+--------------+     author
```

```js
Book.belongsTo(Author);
```

```
GET /books/b1
GET /authors/a1
```

### Has Many

```
+----------+                     +--------------+
| Authors  |                     | Books        |
+----------+   books             +--------------+
| id       +-----------+         | id           |
| name     |           |         | title        |
+----------+           |         +--------------+
                       +-------->+ authorId     |
                                 +--------------+
```

```js
Author.hasMany(Books);
```

```
GET /authors/a1/books
```

### Many to many

```
+--------+                             +---------+
| Books  |                             | Authors |
+--------+       +-------------+       +---------+
| id     +<--+   | AuthorBooks |   +-->+ id      |
| title  |   |   +-------------+   |   | name    |
+--------+   |   | id          |   |   +---------+
             +---+ authorId    |   |
                 | bookId      +---+
                 +-------------+
```

```js
Author.hasAndBelongsToMany(Books);
Book.hasAndBelongsToMany(Authors);
```

```
GET /authors/a1/books
---------------------
GET /books/b1/authors
```