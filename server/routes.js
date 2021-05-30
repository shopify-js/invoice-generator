const Router = require('koa-router');
const router = new Router();
const parse = require('co-body');

// Import queries and mutations here
const { getOrders, getProducts } = require('./queries.js');

const prepareAuth = (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const shopOrigin = ctx.cookies.get("shopOrigin");
    return {
        token: accessToken,
        shop: shopOrigin
    }
};

// GET products
router.get('/api/products', async (ctx) => {
    const auth = prepareAuth(ctx);
    await getProducts(auth)
        .then(response => ctx.body = response.data.data.products);
});

// GET orders
router.get('/api/orders', async (ctx) => {
    const auth = prepareAuth(ctx);
    await getOrders(auth)
        .then(response => ctx.body = response.data.data.orders);
});

// GET order detail
router.get('/api/orders', async (ctx) => {
    const auth = prepareAuth(ctx);
    await getOrders(auth)
        .then(response => ctx.body = response.data.data.orders);
});

module.exports = {
    router
}

// the Admin API won’t accept client-side API requests 
// we need to pass the data through a backend route in our app in order to make it available to our front end.