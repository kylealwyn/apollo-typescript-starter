import { merge } from 'lodash';
import { makeExecutableSchema } from 'apollo-server';
import * as schemas from './schemas';

interface IQueryDefintion {
  name: string;
  definition: string;
  resolve: (root: any, args?: any, context?: any, info?: any) => any;
}

interface ISchema {
  typeDef: string;
  queries: IQueryDefintion[];
  mutations: IQueryDefintion[];
  resolvers?: object;
}

interface IRootSchema {
  typeDefs: string[];
  queries: string[];
  mutations: string[];
  resolvers: {
    [key: string]: any;
  };
}

const extractDefinitionStrings = (definitions: IQueryDefintion[]): string =>
  definitions.map(({ definition }) => definition).join('\n');

const extractResolversFromDefinitions = (definitions: IQueryDefintion[]) =>
  definitions.reduce((acc, { name, resolve }) => {
    acc[name] = resolve;
    return acc;
  }, {});

const buildSchemaResolvers = (schema: ISchema): object => {
  const { queries = [], mutations = [], resolvers = {} } = schema;

  return {
    Query: extractResolversFromDefinitions(queries),
    Mutation: extractResolversFromDefinitions(mutations),
    ...resolvers,
  };
};

const rootSchema = Object.values(schemas).reduce(
  (builder, schema) => {
    const { typeDef, queries, mutations } = schema;

    return {
      typeDefs: [...builder.typeDefs, typeDef],
      queries: [...builder.queries, extractDefinitionStrings(queries)],
      mutations: [...builder.mutations, extractDefinitionStrings(mutations)],
      resolvers: merge(builder.resolvers, buildSchemaResolvers(schema)),
    };
  },
  {
    typeDefs: [],
    queries: [],
    mutations: [],
    resolvers: {},
  }
);

// Construct the schema
const typeDefs = `
  type Query {
    ${rootSchema.queries.join('\n')}
  }

  type Mutation {
    ${rootSchema.mutations.join('\n')}
  }

  ${rootSchema.typeDefs.join('\n')}

  schema {
    query: Query
    mutation: Mutation
  }
`;

// Now bind it with resolers
export default makeExecutableSchema({
  typeDefs,
  resolvers: rootSchema.resolvers,
});
