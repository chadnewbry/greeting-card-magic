import { useState } from "react";
import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
// import { TitleBar } from "@shopify/app-bridge-react";
// import { useQuery, gql } from 'react-query';
// import { useAdminApi } from './hooks/useAdminApi';


const SetupFullfilment = () => {
    // const customFulfillmentServiceName = 'Greeting Card Fulfillment';

    const [isLoading, setIsLoading] = useState(false);
    const [fulfillments, setFulfillments] = useState([]);
     // this ensures we add the proper auth headers
     // Missing Authorization header, was the request made with authenticatedFetch? | {isOnline: false}
    const fetch = useAuthenticatedFetch();

    const handleLoadFulfillments = async () => {
        setIsLoading(true)
        const response = await fetch("/api/fulfillments/");

        console.log(response)
        

        if (response.ok) {
            // todo maybe show a toast indicating success? 
            const json = await response.json();
            console.log(json)
            console.log(json.response)
            console.log(json.response.response)
            console.log(json.response.response.body)
            console.log(json.response.response.body.data.shop.fulfillmentServices)
            // console.log(data.fulfillments)
            // setFulfillments(data.fulfillments);
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    };

    const renderFulfillments = () => {
        if (!fulfillments.length) {
          return <p>No fulfillments found.</p>;
        }
    
        return (
            <Text>We have fulfillments</Text>
        //   <ul>
        //     {fulfillments.map((fulfillment, index) => (
        //       <li key={index}>{fulfillment.name}</li>
        //     ))}
        //   </ul>
        );
      };

    return (
        <Page>
               <Card
        title="Load Fulfillments"
        sectioned
        primaryFooterAction={{
          content: "Load Fulfillments",
          onAction: handleLoadFulfillments,
          loading: isLoading,
        }}
        >
             {renderFulfillments()}
        </Card> 
        {/* <Card>
            if (!fulfillments.length) {
       <p>No fulfillments found.</p>
    }
        </Card> */}
        </Page>
         
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

