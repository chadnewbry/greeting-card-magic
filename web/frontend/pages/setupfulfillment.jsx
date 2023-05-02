import { useState } from "react";
import { Card, Page, DataTable, Link, Layout, TextContainer, Heading, Subheading, List, DescriptionList, Button } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { TitleBar, useNavigate } from "@shopify/app-bridge-react";
// import { useQuery, gql } from 'react-query';
// import { useAdminApi } from './hooks/useAdminApi';
// import { useNavigate } from "@shopify/app-bridge-react";


const SetupFullfilment = () => {
    // const customFulfillmentServiceName = 'Greeting Card Fulfillment';

    const [isLoading, setIsLoading] = useState(false);
    const [fulfillments, setFulfillments] = useState([]);
     // this ensures we add the proper auth headers
     // Missing Authorization header, was the request made with authenticatedFetch? | {isOnline: false}
    const fetch = useAuthenticatedFetch();
    const navigate = useNavigate()

    const hasGreetingCardFulfillment = fulfillments.some(
        (fulfillment) => fulfillment.serviceName === "Greeting Card Fulfillment"
      );

      const handleButtonClick = () => {
        navigate("/addcards"); // Navigate to the other page
      };

    const handleLoadFulfillments = async () => {
        setIsLoading(true)
        const response = await fetch("/api/fulfillments/");

        console.log(response)
        

        if (response.ok) {
            // todo maybe show a toast indicating success? 
            const json = await response.json();
            console.log(json)
   
            setFulfillments(json.fulfillments);
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    };

    const renderAddFulfillmentInstructions = () => {
        if (!hasGreetingCardFulfillment) {
            return (
                <Card sectioned>
                <TextContainer>
                <Heading>
                    Why?
                </Heading>
                <p>To fulfill the greeting cards you sell in your store I need to get an email indicating I should ship the greeting card. To do this you'll add Custom Fullfilment Service.</p>
                
                <Subheading>
                    Let's get started
                </Subheading>
                <p>
                    Use the name and email below and follow the documentation here: <Link url="https://help.shopify.com/en/manual/shipping/fulfillment-services/custom">https://help.shopify.com/en/manual/shipping/fulfillment-services/custom</Link>
                </p>
                <p>The only step you need to do is the the "Activate a fulfillment service" step.</p>
                <DescriptionList
                items={
                    [
                        {
                            term: 'name:',
                            description: 'Greeting Card Fulfillment'
                        },
                        {
                            term: 'email:',
                            description: 'chad.newbry@gmail.com'
                        }
                    ]
                }
                spacing = "tight"
                >

                </DescriptionList>
                </TextContainer>
            </Card>
            )
        }

        // otherwise we have our fulfilment with chad.newbry@gmail.com email 
        return (
            <Card sectioned>
            <Heading>
                SUCCESS!!
            </Heading>
            <Button onClick={ handleButtonClick }>
                Go to Step Two
            </Button>
            </Card>
            
        )
    }

    const renderFulfillments = () => {
        if (!fulfillments.length) {
          return <p>No fulfillments found.</p>;
        }
      
        const headings = ['Service Name', 'Handle', 'Email']; // 'ID', 
        const rows = fulfillments.map((fulfillment) => [
        //   fulfillment.id,
          fulfillment.serviceName,
          fulfillment.handle,
          fulfillment.email
        ]);
      
        return (
          <DataTable
            columnContentTypes={['text', 'text', 'text']}
            headings={headings}
            rows={rows}
          />
        );
      };

    return (
        <Page>
             <TitleBar
        title="Setup Custom Fulfillment"
      />
        <Layout>
            <Layout.Section>
            
            {renderAddFulfillmentInstructions()}
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
            </Layout.Section>
        </Layout>
      
          
        </Page>
         
    );
}
  
  export default SetupFullfilment;

