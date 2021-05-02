// This is where you write your queries for the GraphQL version of the Admin API. These ‘queries’ will be responsible for accessing data from your store.

const { graphQLClient } = require('./apiClient.js');

module.exports = {
  // Returns a list of products
  getProducts(auth) {
    const query = `{
                    products(first: 10) {
                      edges {
                          node {
                             title
                             id
                          }
                      }
                  }
                }`;

    return graphQLClient(query, auth);
  },

  getOrders(auth) {
    const query = `{
                    orders(first: 10) {
                      edges {
                        node {
                            id
                            phone
                          }
                      }
                  }
                }`;

    return graphQLClient(query, auth);
  },
}