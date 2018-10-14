import db from '../database';

export const typeDef = `
  extend type Query {
    author(firstName: String): Author!
    authors: [Author]!
  }

  extend type Mutation {
    createAuthor(firstName: String!, lastName: String!): Author
  }

  type Author {
    id: ID!
    firstName: String
    lastName: String

    books(limit: Int, offset: Int): [Book]
  }
`;

export const resolvers = {
  Query: {
    author(_, { firstName = '' }) {
      return db
        .query('authors')
        .where({ firstName })
        .first();
    },
    authors: () => db.query('authors'),
  },
  Mutation: {
    async createAuthor(root, args) {
      const [author] = await db
        .query('authors')
        .insert(args)
        .returning('*');

      return author;
    },
  },
  Author: {
    books(author, { limit = 100, offset = 0 }) {
      // TODO: Only query for selected fields (d.fieldNodes[0].selectionSet.selections)
      return db
        .query('books')
        .where({ authorId: author.id })
        .limit(limit)
        .offset(offset);
    },
  },
};
