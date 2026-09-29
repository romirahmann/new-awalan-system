export interface UpdatedCategory {
  id?: number;
  name?: string;
  description?: string;
  type?: string;
}

export interface CreateCategory {
  name: string;
  description: string;
  type: string;
}
