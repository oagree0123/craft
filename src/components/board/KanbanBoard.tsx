'use client';

import useKanbanboard from '@/hooks/useKanbanboard';
import { ColumnMap } from '@/types/board/kanbanBoard';
import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';

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

  const {
    draggedItem,
    dragOverColumn,
    dragOverItemId,
    dropPreviewIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useKanbanboard({ columns, setColumns });

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-6'>칸반 보드</h1>
      <div className='flex gap-4'>
        {Object.entries(columns).map(([columnId, column]) => (
          <KanbanColumn
            key={columnId}
            columnId={columnId}
            column={column}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggedItem={draggedItem}
            dragOverColumn={dragOverColumn}
            dragOverItemId={dragOverItemId}
            dropPreviewIndex={dropPreviewIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
