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
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import sanityClient from "../../sanityClient";


export default function AddCards() {
  const [cards, setCards] = useState([]); // cards on the merchant store
  const [sanityCards, setSanityCards] = useState([]); // cards from my sanity headless CMS 

  const fetch = useAuthenticatedFetch();
  const {selectedResources, allResourcesSelected, handleSelectionChange} =
  useIndexResourceState(cards);

  useEffect(() => {
    fetchCards();
    fetchSanityCards();
  }, []);

  async function fetchCards() { 
    const response = await fetch("/api/cards");
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      setCards(data.cards);
    }
  }

  async function fetchSanityCards() {
    try {
      const fetchedSanityCards = await sanityClient.fetch('*[_type == "card"]');
      console.log('Sanity cards:', fetchedSanityCards);
      setSanityCards(fetchedSanityCards);
    } catch (error) {
      console.error('Error fetching Sanity cards:', error);
    }
  }


  // async function onDeleteCards() {
  //   try {
  //     const response = await fetch("/api/cards", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ cardIds: selectedResources }),
  //     });
  
  //     if (response.ok) {
  //       await fetchCards();
  //     } else {
  //       throw new Error("Error deleting cards");
  //     }
  //   } catch (error) {
  //     console.error(`Error deleting cards: ${error.message}`);
  //   }
  // }

  async function onDeleteCards() {
    try {
      const response = await fetch("/api/cards", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardIds: selectedResources }),
      });
  
      if (response.ok) {
        await fetchCards();
      } else {
        throw new Error("Error deleting cards");
      }
    } catch (error) {
      console.error(`Error deleting cards: ${error.message}`);
    }
  }
  
  

  const rowMarkup = cards.map(
    (
      { id, title, tags, description  }, 
      index,
    ) => (
      <IndexTable.Row 
        id={id} 
        key={id} 
        selected={selectedResources.includes(id)} 
        position={index}
        actions={[
          {
            content: "Delete",
            destructive: true, // Makes the button red
            onAction: () => onDeleteSingleCard(id),
          },
        ]}
      >
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>{tags ? tags.join(", ") : ""}</IndexTable.Cell>
        <IndexTable.Cell>{description}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const sanityRowMarkup = sanityCards.map(({ _id, title, tags, description, image, image_alt_text, description_html }, index) => (
    <IndexTable.Row
      id={_id}
      key={_id}
      position={index}
      // Add actions as needed
    >
      <IndexTable.Cell>{title}</IndexTable.Cell>
      <IndexTable.Cell>{tags.join(", ")}</IndexTable.Cell>
      <IndexTable.Cell>
        {description || description_html}
        {/* Render the image if available */}
        {image && <img src={image.asset.url} alt={image_alt_text} />}
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

                // const media = null; // Add media if necessary

  return (
    <Page>
      <TitleBar title="Add Cards" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Heading>Cards in your Store! :)</Heading>
            <IndexTable
              resourceName={{ singular: "card", plural: "cards" }}
              itemCount={cards.length}
              selectedItemsCount={selectedResources.length}
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "Title" },
                { title: "Tags" },
                { title: "Description" },
              ]}
            >
              {rowMarkup}
            </IndexTable>
            
            
          </Card>
          <Card sectioned>
          <Button
              onClick={() => {
                // Add the delete function here
                onDeleteCards(selectedResources)
              }}
              disabled={selectedResources.length === 0}
              destructive={selectedResources.length > 0}
            >
              {selectedResources.length === 1
                ? "Delete 1 Card"
                : `Delete ${selectedResources.length} Cards`}
            </Button>
          </Card>
  
        </Layout.Section>
        <Layout.Section>
        <Card sectioned>
          <Heading>Sanity Cards</Heading>
          <IndexTable
            resourceName={{ singular: "card", plural: "cards" }}
            itemCount={sanityCards.length}
            headings={[
              { title: "Title" },
              { title: "Tags" },
              { title: "Description" },
            ]}
          >
            {sanityRowMarkup}
          </IndexTable>
        </Card>
        {/* Add any actions needed for the Sanity cards */}
      </Layout.Section>
      </Layout>
    </Page>
  );
}
