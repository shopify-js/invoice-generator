require("isomorphic-fetch");
const Koa = require("koa");
const Router = require('koa-router');
const next = require('next');
const dotenv = require("dotenv");
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const session = require("koa-session");


// const { gqlRoutes } = require('./server/graphql/routes');
// const { restApiRoutes } = require('./server/rest/routes');
// const router = require('./server/router')

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

const ACTIVE_SHOPIFY_SHOPS = {};
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY } = process.env;

// GraphQL / REST Routes
// server.use(gqlRoutes.routes()).use(gqlRoutes.allowedMethods());
// server.use(restApiRoutes.routes()).use(restApiRoutes.allowedMethods());

// next app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  // Koa Server
  const server = new Koa();
  const router = new Router();

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

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Server listening to port --> ${port}`)
  });
});