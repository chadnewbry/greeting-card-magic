import {
  Page,
  Layout,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { SanityCards } from "./SanityCard";
import { ShopifyCards } from "./ShopifyCard";


export default function AddCards() {
  return (
    <Page>
      <TitleBar title="Add Cards" />
      <Layout>
        <Layout.Section>
        <ShopifyCards />
  
        </Layout.Section>
        <Layout.Section>
       
        <SanityCards />
      </Layout.Section>
      </Layout>
    </Page>
  );
}
