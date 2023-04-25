import {
  Page,
  Layout,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { SanityCards } from "./SanityCard";
import { ShopifyCards } from "./ShopifyCard";
import { useState } from "react";



export default function AddCards() {
  const [cardDataChanged, setCardDataChanged] = useState(false);

  function handleCardDataChanged() {
    setCardDataChanged((prevState) => !prevState);
  }

  return (
    <Page>
      <TitleBar title="Add Cards" />
      <Layout>
        <Layout.Section>
        <ShopifyCards onCardAdded={handleCardDataChanged} />
  
        </Layout.Section>
        <Layout.Section>
       
        <SanityCards onAddCardCallback={handleCardDataChanged} />
      </Layout.Section>
      </Layout>
    </Page>
  );
}
