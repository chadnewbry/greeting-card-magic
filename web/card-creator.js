import shopify from "./shopify.js";

const GET_CARDS = `
query {
  products(first: 15, query: "tag:Card") {
    edges {
      node {
        id
        title
        productType
        tags
      }
    }
  }
}
`;

export default async function getCards(session) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    console.log("Trying to load cards....")
    const response = await client.query({
      data: {
        query: GET_CARDS,
      },
    });

    // const cards = response.data.products.edges.map(edge => edge.node);
    // console.log(cards)
    // return cards;
    return { response }
  } catch (error) {
    throw new Error(`Failed to fetch cards: ${error.message}`);
  }
}
