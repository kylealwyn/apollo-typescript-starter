import db from '../database';

export const typeDef = `
  extend type Query {
    book(title: String): Book
    books(limit: Int): [Book]
  }

  extend type Mutation {
    createBook(title: String!, authorId: ID!): Book
  }

  type Book {
    id: ID!
    title: String
    author: Author
  }
`;

export const resolvers = {
  Query: {
    book(root, { title = '' }) {
      return db
        .query('books')
        .where({ title })
        .first();
    },
    books(root, { limit = 100, offset = 0 }) {
      return db
        .query('books')
        .limit(limit)
        .offset(offset);
    },
  },
  Mutation: {
    async createBook(root, args) {
      const [book] = await db
        .query('books')
        .insert(args)
        .returning('*');

      return book;
    },
  },
  Book: {
    author(book) {
      return db
        .query('authors')
        .where({ id: book.authorId })
        .first();
    },
  },
};
