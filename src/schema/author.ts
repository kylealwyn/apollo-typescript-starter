import db from '../database';

export const type = `
type Author {
  id: ID!,
  firstName: String,
  lastName: String

  books(limit: Int, offset: Int): [Book]
}
`;

export const queries = {
  author: {
    definition: `author(firstName: String): Author!`,
    resolve(root, { firstName = '' }) {
      return db
        .query('authors')
        .where({ firstName })
        .first();
    },
  },
  authors: {
    definition: 'authors: [Author]!',
    resolve: () => db.query('authors'),
  },
};

export const mutations = {
  createAuthor: {
    definition: `createAuthor(firstName: String!, lastName: String!): Author`,
    async resolve(root, args) {
      const [author] = await db
        .query('authors')
        .insert(args)
        .returning('*');

      return author;
    },
  },
};

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
