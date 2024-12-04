import { Item } from '@/types/board/kanbanBoard';

const Card: React.FC<{
  item: Item;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  isDraggedOver: boolean;
}> = ({ item, onDragStart, onDragEnd, isDragging, isDraggedOver }) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`p-3 mb-2 bg-white border rounded shadow-sm cursor-move
        hover:shadow-md transition-all duration-200
        ${isDragging ? 'opacity-50 scale-105' : ''}
        ${isDraggedOver ? 'border-blue-500' : ''}`}
    >
      {item.content}
    </div>
  );
};

export default Card;
