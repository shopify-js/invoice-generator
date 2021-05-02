// uses the popular http client Axios to provide an easy way to query the API.

const axios = require('axios/index');

const graphQLClient = (query, auth) => {

    const settings = {
        async: true,
        crossDomain: true,
        url: `https://${auth.shop}/admin/api/2021-04/graphql.json`,
        method: 'POST',
        headers: {
            'X-Shopify-Access-Token': auth.token,
            'Content-Type': 'application/graphql'
        },
        data: {},
        timeout: 10000
    };

    return axios(Object.assign({}, settings, {data: query}));
};

module.exports = {
    graphQLClient
};
