import db from '../database';

export const typeDef = `
type Book {
  id: ID!,
  title: String
  author: Author
}
`;

export const queries = {
  book: {
    definition: 'book(title: String): Book',
    resolve(root, { title = '' }) {
      return db
        .query('books')
        .where({ title })
        .first();
    },
  },
  books: {
    definition: 'books(limit: Int): [Book]',
    resolve(root, { limit = 100, offset = 0 }) {
      return db
        .query('books')
        .limit(limit)
        .offset(offset);
    },
  },
};

export const mutations = {
  createBook: {
    definition: `createBook(title: String!, authorId: ID!): Book`,
    async resolve(root, args) {
      const [book] = await db
        .query('books')
        .insert(args)
        .returning('*');

      return book;
    },
  },
};

export const resolvers = {
  Book: {
    author(book) {
      return db
        .query('authors')
        .where({ id: book.authorId })
        .first();
    },
  },
};
