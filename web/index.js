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
import { getCards, addCard, deleteCards } from "./card-creator.js";




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

  let fulfillments = response?.response.body.data.shop.fulfillmentServices

  res.status(status).send({ success: status === 200, error, fulfillments});
});

// Get Cards (with a "Cards" tag)
// Add this new route to fetch cards
app.get("/api/cards", async (_req, res) => {
  try {
    const response = await getCards(res.locals.shopify.session);
    // console.log(response)
    // console.log(response?.response.body.data.products.edges)

    let cards = response?.response.body.data.products.edges.map(edge => edge.node);

    res.status(200).json({ cards });
  } catch (error) {
    res.status(500).send(`Error fetching cards: ${error.message}`);
  }
});

app.post("/api/cards/add", async (req, res) => {
  try {
    const cardDetails = req.body;

    // Here, create the product in the Shopify store using the provided card details
    await addCard(cardDetails, res.locals.shopify.session);
    
    res.status(201).send(); // 201 Created, indicates successful addition
  } catch (error) {
    res.status(500).send(`Error adding card: ${error.message}`);
  }
});

// Delete Cards
// app.delete("/api/cards", async (req, res) => {
//   try {
//     const { cardIds } = req.body;

//     console.log("Trying to delete cards in the index.js file")

//     await deleteCards(cardIds, res.locals.shopify.session);
//     res.status(204).send(); // 204 No Content, indicates successful deletion
//   } catch (error) {
//     res.status(500).send(`Error deleting cards: ${error.message}`);
//   }
// });
app.delete("/api/cards", async (req, res) => {
  try {
    const { cardIds } = req.body;
    await deleteCards(cardIds, res.locals.shopify.session);
    res.status(204).send(); // 204 No Content, indicates successful deletion
  } catch (error) {
    res.status(500).send(`Error deleting cards: ${error.message}`);
  }
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
