import React from 'react';

import { Column, Item } from '@/types/board/kanbanBoard';
import Card from '../ui/Card';

interface ColumnProps {
  columnId: string;
  column: Column;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, toColumnId: string) => void;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    item: Item,
    columnId: string
  ) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  draggedItem: { item: Item; fromColumn: string } | null;
  dragOverColumn: string | null;
  dragOverItemId: string | null;
  dropPreviewIndex: number | null;
}

const KanbanColumn: React.FC<ColumnProps> = ({
  columnId,
  column,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  draggedItem,
  dragOverColumn,
  dragOverItemId,
  dropPreviewIndex,
}) => {
  return (
    <div
      key={columnId}
      className='w-72'
      onDragOver={(e) => onDragOver(e, columnId)}
      onDrop={(e) => onDrop(e, columnId)}
    >
      <div className='bg-white border rounded shadow-sm'>
        <div className='bg-gray-100 px-4 py-2 font-semibold'>
          {column.title}
        </div>
        <div className='p-4 min-h-[200px] transition-all duration-200'>
          {column.items.map((item, index) => (
            <React.Fragment key={item.id}>
              {dragOverColumn === columnId &&
                dropPreviewIndex === index &&
                draggedItem?.item.id !== item.id && (
                  <div className='h-12 bg-blue-100 border-2 border-blue-300 border-dashed rounded mb-2 transition-all duration-200' />
                )}
              <Card
                item={item}
                onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
                  onDragStart(e, item, columnId)
                }
                onDragEnd={onDragEnd}
                isDragging={draggedItem?.item.id === item.id}
                isDraggedOver={dragOverItemId === item.id}
              />
            </React.Fragment>
          ))}
          {dragOverColumn === columnId &&
            dropPreviewIndex === column.items.length &&
            draggedItem?.fromColumn !== columnId && (
              <div className='h-12 bg-blue-100 border-2 border-blue-300 border-dashed rounded mb-2 transition-all duration-200' />
            )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
