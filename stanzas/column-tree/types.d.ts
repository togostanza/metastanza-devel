// ツリーデータ構造の型定義
export type Tree<T> = {
  data: T[];
};

// node_modules/togostanza-utils/lib/tree.jsを参照
export interface TreeItem {
  id: number | string;
  parent?: number | string;
  children?: string[] | number[];
  color?: string;
  description?: string;
  group?: string;
  label: string;
  order?: string;
  value?: number;
}

export interface TreeItemWithPath extends TreeItem {
  path?: TreePathNode[];
}

export interface TreePathNode {
  id: number | string;
  label: string;
  parent?: number | string;
}
