require("isomorphic-fetch");
const Koa = require("koa");
const Router = require('koa-router');
const next = require('next');
const dotenv = require("dotenv");

// const { gqlRoutes } = require('./server/graphql/routes');
const { restApiRoutes } = require('./server/rest/routes');

// Import Shopify/Koa modules to assist with authentication
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { default: Shopify, ApiVersion } = require('@shopify/shopify-api');

// Env Configuration and Context
dotenv.config();
const port = process.env.PORT || 3000;
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: ["read_products", "write_products", "read_orders", "read_draft_orders"],
  HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Next app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: dev });
const handle = app.getRequestHandler();

const ACTIVE_SHOPIFY_SHOPS = {};

// Koa Server
const server = new Koa();


// Router 
const router = new Router();

// Test Route
router.get('/test', ctx => {
  ctx.body = `Hello, World`
});

// GraphQL / REST Routes
// server.use(gqlRoutes.routes()).use(gqlRoutes.allowedMethods());
server.use(restApiRoutes.routes()).use(restApiRoutes.allowedMethods());
server.use(router.routes()).use(router.allowedMethods());

// 
app.prepare().then(() => {
  server.keys = [Shopify.Context.API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      afterAuth(ctx) {
        const { shop, scope } = ctx.state.shopify;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        ctx.redirect(`/?shop=${shop}`);
      },
    }),
  );

  const handleRequest = async (ctx) => {
    console.log(`Inside handleRequest`);
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get("/", async (ctx) => {
    const shop = ctx.query.shop;
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  // Next static files
  router.get("(/_next/static/.*)", handleRequest);
  router.get("/_next/webpack-hmr", handleRequest);
  router.get("(.*)", verifyRequest(), handleRequest);

  server.listen(port, () => {
    console.log(`server listening to port --> ${port}`)
  });
});