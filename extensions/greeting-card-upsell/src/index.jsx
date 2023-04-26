import React from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  useTranslate,
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::Dynamic::Render', () => <App />);

function App() {
  const {extensionPoint} = useExtensionApi();
  const translate = useTranslate();
  return (
    <Banner title="greeting-card-upsell">
      {translate('welcome', {extensionPoint})}       
    </Banner>

  //   <InlineStack>
  //   <Image source="/url/for/image" />
  //   <BlockStack>
  //     <Text size="large">Heading</Text>
  //     <Text size="small">Description</Text>
  //   </BlockStack>
  //   <Button
  //     onPress={() => {
  //       console.log('button was pressed');
  //     }}
  //   >
  //     Button
  //   </Button>
  // </InlineStack>
    

  );
}