import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const AuthLink = (operation, next) => {
  operation.setContext(context => ({
    ...context,
    headers: {
      ...context.headers
    },
  }));
  
  return next(operation);
};

const link = ApolloLink.from([
  AuthLink,
  new HttpLink({ uri: '/graphql' }),
]);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default apolloClient;