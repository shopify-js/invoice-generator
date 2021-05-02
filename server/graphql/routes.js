// This file is where you will create routes for your application. Backend routes are required within your app as the Admin API won’t accept client-side requests.

const Router = require('koa-router');
const router = new Router();
const parse = require('co-body');
const { getProducts, getOrders } = require('./queries.js');

// Import queries and mutations here

const prepareAuth = (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const shopOrigin = ctx.cookies.get("shopOrigin");
    return {
        token: accessToken,
        shop: shopOrigin
    }
};

// Define routes here

// Create the 'products' route
router.get('/products', async (ctx) => {
    const auth = prepareAuth(ctx);
    await getProducts(auth).then(response => ctx.body = response.data.data.products);
});

// Create the 'products' route
router.get('/orders', async (ctx) => {
    const auth = prepareAuth(ctx);
    await getOrders(auth).then(response => {console.log(response.data); ctx.body = response.data.data.orders});
});

module.exports = {
    router
}
