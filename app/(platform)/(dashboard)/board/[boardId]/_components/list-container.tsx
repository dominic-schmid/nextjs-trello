"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { toast } from "sonner";

import { ListWithCards } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

// Reorders by indices
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess(data) {
      toast.success("List reordered");
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess(data) {
      toast.success("Cards reordered");
    },
    onError(error) {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (list, index) => ({ ...list, order: index })
      );
      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // User moves a card
    else if (type === "card") {
      let newOrderedData = [...orderedData];
      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) return;

      // Check if cards exists on the soruceList
      if (!sourceList.cards) sourceList.cards = [];

      // Check if cards exists on the destList
      if (!destList.cards) destList.cards = [];

      // Moving to the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        // reorder the indices
        reorderedCards.forEach((card, idx) => (card.order = idx));
        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({ items: reorderedCards, boardId });
      } else {
        // Moving to a different list
        // Remove from source
        const [moveCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        moveCard.listId = destination.droppableId;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, moveCard);

        // Update order on both lists
        sourceList.cards.forEach((card, idx) => (card.order = idx));
        destList.cards.forEach((card, idx) => (card.order = idx));

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({ items: destList.cards, boardId });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
