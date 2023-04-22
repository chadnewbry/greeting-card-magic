import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
// import { useQuery, gql } from 'react-query';
// import { useAdminApi } from './hooks/useAdminApi';


import { useAdminApi } from './hooks/useAdminApi';

const FETCH_FULFILLMENT_SERVICES = gql`
  query {
    shop {
      fulfillmentServices {
        edges {
          node {
            id
            serviceName
            email
          }
        }
      }
    }
  }
`;

const SetupFulfillment = () => {
  const adminApi = useAdminApi();
  const customFulfillmentServiceName = 'Greeting Card Fulfillment';

  const { isLoading, error, data } = useQuery('fetchFulfillmentServices', async () => {
    const response = await adminApi.graphql(FETCH_FULFILLMENT_SERVICES);
    return response.data.shop.fulfillmentServices.edges;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const customFulfillmentService = data.find(({ node }) => {
    return node.serviceName === customFulfillmentServiceName;
  });

  return (
    <Card>
      {customFulfillmentService ? (
        <div>
          <TextStyle variation="positive">
            Custom Order Fulfillment Setup
          </TextStyle>
          <p>
            <button onClick={() => {}}>Go to App</button>
          </p>
        </div>
      ) : (
        <div>
          <TextStyle variation="negative">
            Custom Order Fulfillment Not Setup
          </TextStyle>
          <p>
            To set up custom fulfillment, follow these instructions...
          </p>
        </div>
      )}
    </Card>
  );
};

export default SetupFullfilment;

