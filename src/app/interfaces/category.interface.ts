export interface Category {
  id: number;
  name: string;
  imageUrl: string | null;
  parentId: number | null;
  subCategories: Category[];
}
