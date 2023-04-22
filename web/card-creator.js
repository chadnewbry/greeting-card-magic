import shopify from "./shopify.js";

const GET_CARDS = `
query {
  products(first: 15, query: "tag:Card") {
    edges {
      node {
        id
        title
        description
        productType
        tags
      }
    }
  }
}
`;

const DELETE_CARDS_MUTATION = `
  mutation deleteProduct($id: ID!) {
    productDelete(input: { id: $id }) {
      deletedProductId
      userErrors {
        field
        message
      }
    }
  }
`;

export async function getCards(session) {
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


export async function deleteCards(cardIds, session) {
    const client = new shopify.api.clients.Graphql({ session });
  
    console.log("Trying to delete cards in the card-creator.js file");
  
    // Create the mutations string for deleting cards
    const mutations = cardIds
      .map(
        (id, index) => `
        cardDelete${index}: productDelete(input: { id: "${id}" }) {
          deletedProductId
        }
      `
      )
      .join("\n");
  
    // Combine all mutations into a single GraphQL mutation
    const DELETE_CARDS_MUTATION = `
      mutation {
        ${mutations}
      }
    `;
  
    // Send the mutation to delete the cards
    const response = await client.query({
      data: {
        query: DELETE_CARDS_MUTATION,
      },
    });
  
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
  
    return { response };
  }
  
