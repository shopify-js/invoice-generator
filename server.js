// Import Koa / Dotenv / Fetch modules
require("isomorphic-fetch");
const Koa = require("koa");
const KoaRouter = require('koa-router');
const next = require('next');
const dotenv = require("dotenv");

// Import Shopify/Koa modules to assist with authentication
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { default: Shopify, ApiVersion } = require('@shopify/shopify-api');

// Env Configuration
dotenv.config();
const port = process.env.PORT || 3000;

Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: ["read_products", "write_products", "read_orders"],
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

app.prepare().then(() => {
    const server = new Koa();
    const router = new KoaRouter();

    server.keys = [Shopify.Context.API_SECRET_KEY];

    server.use(
        createShopifyAuth({
          afterAuth(ctx) {
            const {shop, scope} = ctx.state.shopify;
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

    // Routes
    router.get('/test', ctx => {
        ctx.body = `Hello, World`
    });

    router.get("(/_next/static/.*)", handleRequest);
    router.get("/_next/webpack-hmr", handleRequest);
    router.get("(.*)", verifyRequest(), handleRequest);

    server.use(router.allowedMethods());
    server.use(router.routes());

    server.listen(port, () => {
        console.log(`server listening to port --> ${port}`)
    });
});