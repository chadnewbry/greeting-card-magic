import { useState, useEffect } from "react";
import { IndexTable, Card, Heading, Button, useIndexResourceState } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";

export function ShopifyCards({ onDeleteSingleCard, onDeleteCards, onCardAdded}) {
  // ...
  // Move cards related state, useEffect, and helper functions here
  // ...
  const [cards, setCards] = useState([]); // cards on the merchant store
  
  const fetch = useAuthenticatedFetch();
  const {selectedResources, allResourcesSelected, handleSelectionChange} =
  useIndexResourceState(cards);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
  
    async function fetchCards() {
      const response = await fetch("/api/cards", { signal });
      if (response.ok) {
        const data = await response.json();
        console.log("Cards data.cards", data.cards);
        setCards(data.cards);
      }
    }
  
    fetchCards();
  
    return () => {
      abortController.abort();
    };
  }, [onCardAdded]);

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

  return (
    <>
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
    </>
  );
}
