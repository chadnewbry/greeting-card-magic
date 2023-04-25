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
        onlineStoreUrl
      }
    }
  }
}
`;

const ADD_CARD_MUTATION = `
  mutation createProduct(
    $title: String!
    $descriptionHtml: String
    $productType: String
    $tags: [String!]
    $images: [ImageInput!]
    $sku: String
  ) {
    productCreate(
      input: {
        title: $title
        descriptionHtml: $descriptionHtml
        productType: $productType
        tags: $tags
        images: $images
        variants: [
          {
            price: 10.00
            sku: $sku
          }
        ]
      }
    ) {
      product {
        id
      }
      userErrors {
        field
        message
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

export async function addCard(cardDetails, session) {
  const { _id, title, tags, image, image_alt_text, description_html } = cardDetails;
  const client = new shopify.api.clients.Graphql({ session });
  console.log("Trying to add card...")
  try {
    console.log("Trying to add card...")

    const variables = {
      title,
      descriptionHtml: description_html,
      productType: "Card",
      tags: tags,
      images: [{ src: image, altText: image_alt_text }],
    } 

    console.log("variables", variables)

    const response = await client.query({
      data: {
        query: ADD_CARD_MUTATION,
        variables: variables,
      },
    });

    // if (response.errors) {
    //   throw new Error(response.errors[0].message);
    // }

    return { response };
  } catch (error) {
    throw new Error(`Failed to add card: ${error.message}`);
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
  
