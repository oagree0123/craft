'use client';

import React, { useState } from 'react';

interface Item {
  id: string;
  content: string;
}

interface Column {
  title: string;
  items: Item[];
}

interface ColumnMap {
  [key: string]: Column;
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnMap>({
    todo: {
      title: '할 일',
      items: [
        { id: '1', content: '프로젝트 기획' },
        { id: '2', content: '디자인 시안 검토' },
      ],
    },
    inProgress: {
      title: '진행 중',
      items: [
        { id: '3', content: '프론트엔드 개발' },
        { id: '4', content: '백엔드 API 연동' },
      ],
    },
    done: {
      title: '완료',
      items: [{ id: '5', content: '요구사항 분석' }],
    },
  });

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

    // const column = e.currentTarget.getBoundingClientRect();
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

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-6'>칸반 보드</h1>
      <div className='flex gap-4'>
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className='w-72'
            onDragOver={(e) => handleDragOver(e, columnId)}
            onDrop={(e) => handleDrop(e, columnId)}
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
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, columnId)}
                      onDragEnd={handleDragEnd}
                      className={`draggable-item p-3 mb-2 bg-white border rounded shadow-sm cursor-move
                        hover:shadow-md transition-all duration-200
                        ${
                          draggedItem?.item.id === item.id
                            ? 'opacity-50 scale-105'
                            : ''
                        }
                        ${dragOverItemId === item.id ? 'border-blue-500' : ''}`}
                    >
                      {item.content}
                    </div>
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
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
