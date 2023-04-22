// import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
// import { TitleBar } from "@shopify/app-bridge-react";

// export default function AddCards() {
//   return (
//     <Page>
//       <TitleBar
//         title="Add Cards"
//         // primaryAction={{
//         //   content: "Primary action",
//         //   onAction: () => console.log("Primary action"),
//         // }}
//         // secondaryActions={[
//         //   {
//         //     content: "Secondary action",
//         //     onAction: () => console.log("Secondary action"),
//         //   },
//         // ]}
//       />
//       // test
//       <Layout>
//         <Layout.Section>
//           <Card sectioned>
//             <Heading>Heading</Heading>
//             <TextContainer>
//               <p>Body</p>
//             </TextContainer>
//           </Card>
//         </Layout.Section>
//       </Layout>
//     </Page>
//   );
// }

import { useState, useEffect } from "react";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Heading,
  IndexTable,
  useIndexResourceState,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";

export default function AddCards() {
  const [cards, setCards] = useState([]);
  const fetch = useAuthenticatedFetch();
  const {selectedResources, allResourcesSelected, handleSelectionChange} =
  useIndexResourceState(cards);

  useEffect(() => {
    async function fetchCards() {
      const response = await fetch("/api/cards");
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setCards(data.cards);
      }
    }
    fetchCards();
  }, []);

  console.log(cards);

  const rowMarkup = cards.map(
    (
      { id, title, productType, tags }, 
      index,
    ) => (
      <IndexTable.Row id={id} key={id} selected={selectedResources.includes(id)} position={index}>
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>{productType}</IndexTable.Cell>
        {/* <IndexTable.Cell>{tags.join(", ")}</IndexTable.Cell> */}
      </IndexTable.Row>
    ),
  );

                // const media = null; // Add media if necessary

  return (
    <Page>
      <TitleBar title="Add Cards" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Heading>Card List</Heading>
            <IndexTable
              resourceName={{ singular: "card", plural: "cards" }}
              itemCount={cards.length}
              selectedItemsCount={selectedResources.length}
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "Title" },
                { title: "Product Type" },
                { title: "Tags" },
              ]}
            >
              {rowMarkup}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
