// @ts-check
import { join } from "path";
import { readFileSync, stat } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
// import { getFulfillmentServices } from "./fulfillmentServices.js";
import getFullfillments from "./fulfillment-creator.js";



const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

// trying to add support to ask for fullfilment services

app.get("/api/fulfillments/", async (_req, res) => {
  let status = 200;
  let error = null;
  // let fulfillments = [];
  let response
  try {
    response = await getFullfillments(res.locals.shopify.session);
    console.log(response)
  } catch (e) {
    console.log(`Failed to process /fulfillments: ${e.message} `);
    status = 500;
    error = e.message;
  }

  res.status(status).send({ success: status === 200, error, response});
});


app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});


// trying to add support for my frontend to ask for what fulfillment services we already have ... 

// Add this new route to fetch fulfillment services
// app.get('/api/fulfillment-services', async (req, res) => {
//   const session = res.locals.shopify.session;

//   if (!session) {
//     res.status(401).send('Unauthorized');
//     return;
//   }

//   try {
//     const fulfillmentServices = await getFulfillmentServices(session.shop, session.accessToken);
//     res.json(fulfillmentServices);
    
//   } catch (error) {
//     res.status(500).send(`Error fetching fulfillment services: ${error.message}`);
//   }
// });

// ...


app.listen(PORT);
