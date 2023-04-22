import shopify from "./shopify.js";
import { GraphqlQueryError } from "@shopify/shopify-api"

const GET_FULFILLMENT = `
query {
  shop {
    fulfillmentServices {
    id
    serviceName
    handle
    }
  }
}
`;


export default async function getFullfillments(
    session
) {
    const client = new shopify.api.clients.Graphql({ session })

    try {
        const response = await client.query({
            data: {
                query: GET_FULFILLMENT,
                variables: {
                    input: {},
                },
            },
        });

        // get the data 
        // Extract the fulfillment data from the response
        // const fulfillments = response.data.shop.fulfillmentServices.edges.map(
        //     (edge) => edge.node
        // );

        // console.log(response)
    
        return { response }

    } catch (error) {
        if (error instanceof GraphqlQueryError) {
            throw new Error(
              `${error.message}\n${JSON.stringify(error.response, null, 2)}`
            );
          } else {
            throw error;
          }
    }


}