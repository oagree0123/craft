'use client';

import { useState } from 'react';

type Item = {
  id: string;
  content: string;
};

type Columns = {
  box1: Item[];
};

type DraggedItem = {
  item: Item;
  sourceBox: keyof Columns;
} | null;

const DragBox = () => {
  const [dragContents, setDragContent] = useState<Columns>({
    box1: [
      { id: '1', content: 'Item 1' },
      { id: '2', content: 'Item 2' },
      { id: '3', content: 'Item 3' },
      { id: '4', content: 'Item 4' },
    ],
  });

  const [draggedItem, setDraggedItem] = useState<DraggedItem>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item) => {
    setDraggedItem({ item, sourceBox: 'box1' });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item } = draggedItem;
    const updatedItems = [...dragContents.box1];
    const itemIndex = updatedItems.findIndex((i) => i.id === item.id);

    // 아이템 위치를 반대로 변경
    updatedItems.splice(itemIndex, 1);
    updatedItems.push(item);

    // 상태 업데이트
    setDragContent({ box1: updatedItems });

    // 드래그 중인 아이템 초기화
    setDraggedItem(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        backgroundColor: '#f0f0f0',
        padding: '16px',
        width: '300px',
        minHeight: '200px',
        borderRadius: '4px',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {dragContents.box1.map((item) => {
        return (
          <div
            key={item.content}
            style={{
              backgroundColor: Number(item.id) % 2 == 0 ? '#fff' : 'red',
              width: '40px',
              height: '40px',
              borderRadius: '25%',
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
          ></div>
        );
      })}
    </div>
  );
};

export default DragBox;
