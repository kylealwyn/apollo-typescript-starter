import db from '../database';

export const typeDef = `
  type Author {
    id: ID!
    firstName: String
    lastName: String

    books(limit: Int, offset: Int): [Book]
  }
`;

export const queries = [
  {
    name: 'author',
    definition: `author(firstName: String): Author!`,
    resolve(_, { firstName = '' }) {
      return db
        .query('authors')
        .where({ firstName })
        .first();
    },
  },
  {
    name: 'authors',
    definition: 'authors: [Author]!',
    resolve: () => db.query('authors'),
  },
];

export const mutations = [
  {
    name: 'createAuthor',
    definition: `createAuthor(firstName: String!, lastName: String!): Author`,
    async resolve(root, args) {
      const [author] = await db
        .query('authors')
        .insert(args)
        .returning('*');

      return author;
    },
  },
];

export const resolvers = {
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
