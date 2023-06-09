import { useState, useEffect } from "react";

import { createClient } from "@sanity/client"; 
import "@sanity/image-url"

import { IndexTable, Heading, Card, useIndexResourceState } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";
import imageURLBuilder from '@sanity/image-url'

const client = createClient({
  projectId: 'nyralf7b',
  dataset: 'production',
  useCdn: true,
});

export function SanityCards({ onAddCardCallback }) {
  // ...
  // Move sanityCards related state, useEffect, and helper functions here
  // ...

  const fetch = useAuthenticatedFetch();

  const builder = imageURLBuilder(client);

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
        const fetchedSanityCards = await client.fetch('*[_type == "card"]', {}, { signal });
    
        //console.log('Sanity cards:', fetchedSanityCards[0]);
        if (fetchedSanityCards) {
          console.log('interior Sanity cards:', fetchedSanityCards);
    
          const fetchedSanityCardsWithId = fetchedSanityCards.map((card) => {
            return {
              ...card,
              id: card._id,
              image_url: builder.image(card.image.asset._ref).url()
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

  async function onAddCard(selectedResources) {
    try {
      for (const resourceId of selectedResources) {

        const resource = sanityCards.find((card) => card._id === resourceId);

          if (!resource) {
            throw new Error(`Resource with ID ${resourceId} not found`);
          }

        const { title, sku, tags, image_url, image_alt_text, description_html } = resource;


        // Check if tags is an array before using it
        const tagsArray = Array.isArray(tags) ? tags : [tags]; // ensure tags is an array : to do clean up
        console.log("Trying on add card...")
        console.log(resource)
        

        // const imageUrl = builder.image(resource.image.asset._ref).url();
        // console.log(imageUrl)
        const jsonBlob = JSON.stringify({ title, sku, tags, image: image_url, image_alt_text, description_html })
        console.log(jsonBlob)
        const response = await fetch("/api/cards/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonBlob,
        });

        onAddCardCallback()
        
  
        if (!response.ok) {
          throw new Error(`Error adding card for resource ${resource._id}`);
        }
      }
  
      // await fetchSanityCards();
    } catch (error) {
      console.error(`Error adding cards: ${error.message}`);
    }
  }

  const promotedBulkActions = [
    // Add actions as needed
    {
      content: "Add Card",
      onAction: () => onAddCard(selectedResources),
    }
  ];

  const sanityRowMarkup = sanityCards.map(({ _id, title, sku, tags, image_url, image_alt_text, description_html }, index) => (
    <IndexTable.Row
      id={_id}
      key={_id}
      selected={selectedResources.includes(_id)}
      position={index}
    >
      <IndexTable.Cell style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
        <Card sectioned>
        {title}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={image_url} alt={image_alt_text} style={{ maxHeight: "250px", marginRight: "20px" }} />
            {/* {description_html} */}
            {/* <div style={{ width: '200px' }} dangerouslySetInnerHTML={{ __html: description_html } } /> */}
          </div>
        </Card>
      </IndexTable.Cell>
      <IndexTable.Cell>{sku} </IndexTable.Cell>
      <IndexTable.Cell>{tags ? tags.join(", ") : ""}</IndexTable.Cell>
      {/* <IndexTable.Cell>
        {description_html}
        
      </IndexTable.Cell> */}
      
    </IndexTable.Row>
  ));

  return (
    <Card sectioned>
    <Heading>Available Cards to add to your store 👇</Heading>
    <IndexTable
      resourceName={{ singular: "card", plural: "cards" }}
      itemCount={sanityCards.length}
      selectedItemsCount={ selectedResources.length}
      onSelectionChange={handleSelectionChange}
      headings={[
        { title: "Card" },
        { title: "SKU" },
        { title: "Tags" },
        // { title: "Description" }
      ]}
      promotedBulkActions={promotedBulkActions}
      // condensed = {true}
    >
      {sanityRowMarkup}
    </IndexTable>
  </Card>
  );
}
