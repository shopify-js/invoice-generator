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
  // Returns a list of products
  getOrders(auth) {
    const query = `{
      orders(first: 10) {
        edges {
          node {
            id
            email
          }
        }
      }
    }`;

    return graphQLClient(query, auth);
  }
}