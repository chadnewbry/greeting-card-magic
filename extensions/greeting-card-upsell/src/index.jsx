import React from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  Button,
  useTranslate,
  BlockStack,
  Image,
  Text,
  InlineStack,
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::Dynamic::Render', () => <App />);

function App() {
  const {extensionPoint} = useExtensionApi();
  const translate = useTranslate();
  return (
    // <Banner title="greeting-card-upsell">
    //   {translate('welcome', {extensionPoint})}       
    // </Banner>

     // small https://i.imgur.com/K44HxVl.png
    <InlineStack>
    <Image source="https://i.imgur.com/K44HxVl.png"  style={{ width: '200px', height: 'auto' }}/>
    <BlockStack>
      <Text size="large">Add a Custom Greeting Card</Text>
      <Text size="small">Delight your gift recipient with a greeting card</Text>
    </BlockStack>
    <Button
      onPress={() => {
        console.log('button was pressed');
      }}
    >
      Pick Card
    </Button>
  </InlineStack>
    

  );
}