import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  Subheading,
  List,
  // Text,
} from "@shopify/polaris";

import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title="Greeting Card Magic" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading>Thanks for installing Greeting Card Magic 🎉</Heading>
                {/* <Text variant="heading4xl" as="h1">Thanks for installing Greeting Card Magic 🎉</Text> */}
                  <p>
                    I'm Chad 👋 the Founder / Programmer behind this project. 
                    </p>
                    <p>
                    I'm here to help you get this plugin up and running! If at any time you
                    need help please email me <a href="mailto:chad.newbry@gmail.com">chad.newbry@gmail.com< /a>
                    </p>
                    <Subheading>
                      How Greeting Card Magic works...
                    </Subheading>
                    
                    <List>
                      <List.Item>
                        A customer goes to buy a gift from your store
                      </List.Item>
                      <List.Item>
                        They see a greeting card they love once they've added their 
                        gift to their cart
                      </List.Item>
                      <List.Item>
                        They click on the card, write a custom message for it, then add it to their cart
                      </List.Item>
                      <List.Item>
                        They check out. 
                      </List.Item>
                      <List.Item>
                        You open the store admin and fulfill the order normally. In the admin you 
                        see their card order and click "Request Fulfillment" > "Send fulfillment request"
                      </List.Item>
                      <List.Item>
                        Greeting Card Magic gets an email with the order and handles, printing, and shipping
                        the card to it's destination. 
                      </List.Item>
                    </List>

                    <Subheading>

                    Do the following to start using Greeting Card Magic: 
                    </Subheading>
                    <p>

              
                    <List type="bullet">
                      <List.Item>Visit 
                      
                      {" "}
                    <Link
                      url=" https://www.cardly.net/"
                      external
                    >
                       https://www.cardly.net/
                    </Link>{" "}
                      and email me with the links
                       to the cards you want on your store. Alternatively, email me saying 
                       you'd like me to pick out cards that make sense for your store.</List.Item>
                      <List.Item> Give me  
                     {" "}
                    <Link
                      url="https://help.shopify.com/en/manual/shopify-plus/users/user-access"
                      external
                    >
                      admin access
                    </Link>{" "}
                      to your store so I can add the cards you
                       picked out as products. As part of this process I'll update your 
                       Cart page so the cards are shown as an upsell option. Please make sure 
                       I have the following permissions: "View products", "View product cost	
                        ", "Create and edit products", "Edit product cost", "Edit product price"]  </List.Item>
                      <List.Item>Once I've gotten your store all setup I'll email you to get feedback and 
                      make sure everything is working exactly as you'd expect</List.Item>
                    </List>
               
                    
                  </p>

                  <p>
                    Looking forward to working with you! 
                  </p>

                  <p>
                    - Chad
                  </p>
                
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={trophyImage}
                    alt="Nice work on building a Shopify app"
                    width={120}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
