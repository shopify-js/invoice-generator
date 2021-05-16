// This file is where you will create routes for your application. Backend routes are required within your app as the Admin API won’t accept client-side requests.

const Router = require('koa-router');
const parse = require('co-body');
const axios = require('axios');

const router = new Router();

// const prepareAuth = (ctx) => {
//     const accessToken = ctx.cookies.get("accessToken");
//     const shopOrigin = ctx.cookies.get("shopOrigin");
//     return {
//         token: accessToken,
//         shop: shopOrigin
//     }
// };

// // Create the 'products' route
// router.get('/api/products', async (ctx) => {
//     const auth = prepareAuth(ctx);
//     const url = `https://${auth.shop}/admin/api/2021-04/products.json`
//     let response = await axios.get(url);
//     console.log(response);
// });

// // Create the 'products' route
// router.get('/api/orders', async (ctx) => {
//     const auth = prepareAuth(ctx);
//     await getOrders(auth).then(response => {console.log(response.data); ctx.body = response.data.data.orders});
// });

// Test Route
router.get('/test/:name', ctx => {
    ctx.body = `Hello, ${ctx.params.name}`
});

router.get('/test', ctx => {
    ctx.body = `Hello, Test`
});

router.get('/test1', ctx => {
    ctx.body = `Hello, Test 1`
});

router.get('/test2', ctx => {
    ctx.body = `Hello, Test 2`
});

module.exports = router;
