import { useState } from "react";
import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
// import { TitleBar } from "@shopify/app-bridge-react";
// import { useQuery, gql } from 'react-query';
// import { useAdminApi } from './hooks/useAdminApi';


const SetupFullfilment = () => {
    // const customFulfillmentServiceName = 'Greeting Card Fulfillment';

    const [isLoading, setIsLoading] = useState(false);
     // this ensures we add the proper auth headers
     // Missing Authorization header, was the request made with authenticatedFetch? | {isOnline: false}
    const fetch = useAuthenticatedFetch();

    const handleLoadFulfillments = async () => {
        setIsLoading(true)
        const response = fetch("/api/fulfillments/");

        if (response.ok) {
            // todo maybe show a toast indicating success? 

            setIsLoading(false)
        } else {
            setIsLoading(false)
        }

    };

    return (
            <Card
        title="Load Fulfillments"
        sectioned
        primaryFooterAction={{
          content: "Load Fulfillments",
          onAction: handleLoadFulfillments,
          loading: isLoading,
        }}
        >
        </Card> 
        

    );
}
  
    // const { isLoading, error, data } = useQuery('fetchFulfillmentServices', async () => {
    //   const response = await fetch('/api/fulfillment-services');
    //   return response.json();
    // });
  
    // if (isLoading) {
    //   return <Text> Loading...</Text>
    // }
  
    // if (error) {
    //   return <div>Error: {error.message}</div>;
    // }
  
    // const customFulfillmentService = data.find(({ node }) => {
    //   return node.serviceName === customFulfillmentServiceName;
    // });

    

  
  
  export default SetupFullfilment;

