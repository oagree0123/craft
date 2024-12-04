export interface Item {
  id: string;
  content: string;
}

export interface Column {
  title: string;
  items: Item[];
}

export interface ColumnMap {
  [key: string]: Column;
}
