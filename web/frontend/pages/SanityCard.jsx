import { useState, useEffect } from "react";
import sanityClient from "../../sanityClient";
import { IndexTable, Heading, Card, useIndexResourceState } from "@shopify/polaris";

export function SanityCards({ onAddCard }) {
  // ...
  // Move sanityCards related state, useEffect, and helper functions here
  // ...

  const [sanityCards, setSanityCards] = useState([]); // cards from my sanity headless CMS 

    //console.log('sanityCards:', sanityCards);
    const {selectedResources, allResourcesSelected, handleSelectionChange} = 
    useIndexResourceState(sanityCards);
    //console.log("selectedSanityResources:", selectedSanityResources);
  //console.log("allSanityResourcesSelected:", allSanityResourcesSelected);
  //console.log("handleSanitySelectionChange:", handleSanitySelectionChange);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
  
    // async function fetchCards() {
    //   const response = await fetch("/api/cards", { signal });
    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log("Cards data.cards", data.cards);
    //     setCards(data.cards);
    //   }
    // }
  
    async function fetchSanityCards() {
      try {
        const fetchedSanityCards = await sanityClient.fetch('*[_type == "card"]', {}, { signal });
    
        //console.log('Sanity cards:', fetchedSanityCards[0]);
        if (fetchedSanityCards) {
          console.log('interior Sanity cards:', fetchedSanityCards);
    
          const fetchedSanityCardsWithId = fetchedSanityCards.map((card) => {
            return {
              ...card,
              id: card._id,
            };
          });
    
          setSanityCards(fetchedSanityCardsWithId);
          console.log('after Sanity cards:', sanityCards);
        }
      } catch (error) {
        setSanityCards([]); // set to empty array if we encounter an error
        console.error('Error fetching Sanity cards:', error);
      }
    }

    fetchSanityCards();
  
    return () => {
      abortController.abort();
    };
  }, []);

  async function onAddCard(title, tags, description, image, image_alt_text, description_html) {
    try {
      const response = await fetch("/api/cards/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, tags, description, image, image_alt_text, description_html }),
      });
  
      if (response.ok) {
        await fetchCards();
      } else {
        throw new Error("Error adding card");
      }
    } catch (error) {
      console.error(`Error adding card: ${error.message}`);
    }
  }

  const promotedBulkActions = [
    // Add actions as needed
    {
      content: "Add Card",
      onAction: () => onAddCard(title, tags, description, image, image_alt_text, description_html),
    }
  ];

  const sanityRowMarkup = sanityCards.map(({ _id, title, tags, description, image, image_alt_text, description_html }, index) => (
    <IndexTable.Row
      id={_id}
      key={_id}
      selected={selectedResources.includes(_id)}
      position={index}
    >
      <IndexTable.Cell>{title}</IndexTable.Cell>
      <IndexTable.Cell>{tags ? tags.join(", ") : ""}</IndexTable.Cell>
      <IndexTable.Cell>
        {description || description_html}
        {/* Render the image if available */}
        {image && <img src={image.asset.url} alt={image_alt_text} />}
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Card sectioned>
    <Heading>Sanity Cards</Heading>
    <IndexTable
      resourceName={{ singular: "card", plural: "cards" }}
      itemCount={sanityCards.length}
      selectedItemsCount={ selectedResources.length}
      onSelectionChange={handleSelectionChange}
      headings={[
        { title: "Title" },
        { title: "Tags" },
        { title: "Description" },
      ]}
      promotedBulkActions={promotedBulkActions}
    >
      {sanityRowMarkup}
    </IndexTable>
  </Card>
  );
}
