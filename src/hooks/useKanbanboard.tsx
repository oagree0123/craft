import { ColumnMap, Item } from '@/types/board/kanbanBoard';
import { useState } from 'react';

interface hookParms {
  columns: ColumnMap;
  setColumns: (value: ColumnMap) => void;
}

export default function useKanbanboard({ columns, setColumns }: hookParms) {
  const [draggedItem, setDraggedItem] = useState<{
    item: Item;
    fromColumn: string;
  } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  const [dropPreviewIndex, setDropPreviewIndex] = useState<number | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: Item,
    columnId: string
  ) => {
    setDraggedItem({ item, fromColumn: columnId });
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50', 'scale-105');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItem(null);
    setDragOverColumn(null);
    setDragOverItemId(null);
    setDropPreviewIndex(null);
    e.currentTarget.classList.remove('opacity-50', 'scale-105');
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string
  ) => {
    e.preventDefault();
    if (!draggedItem) return;

    setDragOverColumn(columnId);

    const items = columns[columnId].items;
    const itemElements =
      e.currentTarget.querySelectorAll<HTMLDivElement>('.draggable-item');

    let insertIndex = items.length;

    itemElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (e.clientY < midY) {
        if (insertIndex === items.length) {
          insertIndex = index;
        }
      }
    });

    setDropPreviewIndex(insertIndex);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    toColumnId: string
  ) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item, fromColumn } = draggedItem;
    const updatedColumns = { ...columns };

    console.log(item);
    console.log(updatedColumns);
    console.log(fromColumn);

    console.log(updatedColumns[fromColumn]);

    updatedColumns[fromColumn].items = updatedColumns[fromColumn].items.filter(
      (i) => i.id !== item.id
    );

    const targetItems = [...updatedColumns[toColumnId].items];
    if (dropPreviewIndex !== null) {
      targetItems.splice(dropPreviewIndex, 0, item);
    } else {
      targetItems.push(item);
    }
    updatedColumns[toColumnId].items = targetItems;

    setColumns(updatedColumns);
    handleDragEnd(e);
  };

  return {
    draggedItem,
    dragOverColumn,
    dragOverItemId,
    dropPreviewIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
}
