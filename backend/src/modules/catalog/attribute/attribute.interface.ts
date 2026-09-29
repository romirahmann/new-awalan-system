export interface UpdateAttribute {
  name?: string;
  description?: string | null;
}

export interface UpdateAttributeValue {
  value?: string;
  sort_order?: number;
}

export interface InsertAttributeValue {
  attribute_id: number;
  value: string;
  sort_order: number;
}
