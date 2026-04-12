export type MesheryPatternFile = string;

export type MesheryCatalogData = Record<string, unknown> & {
  description?: string;
  imageURL?: string[];
  compatibility?: string[];
  published_version?: string;
  type?: string;
};

export interface MesheryPatternData {
  id: string;
  name: string;
  pattern_file: MesheryPatternFile;
  catalog_data?: MesheryCatalogData;
  created_at?: string;
  updated_at?: string;
  description?: MesheryCatalogData;
  visibility?: string;
  user_id?: string;
  canSupport?: boolean;
  errmsg?: string;
  type?: {
    String?: string;
    Valid?: boolean;
  };
}

export interface MesheryFilterData {
  id: string;
  name: string;
  filter_file?: string;
  filter_resource?: string;
  catalog_data?: MesheryCatalogData;
  created_at?: string;
  updated_at?: string;
  description?: MesheryCatalogData;
  visibility?: string;
  user_id?: string;
}

export interface MesheryPatternGridSelectedState {
  show: boolean;
  pattern: MesheryPatternData | null;
}

export interface MesheryPatternPublishModalState {
  open: boolean;
  pattern: Partial<MesheryPatternData> | null;
  name: string;
}

export interface MesheryPatternGridSubmitPayload {
  data: string;
  id: string;
  type: string;
  name: string;
  catalog_data?: MesheryCatalogData;
  metadata?: {
    name?: string;
  };
}

export interface MesheryRJSFSchema extends Record<string, unknown> {
  properties?: Record<string, unknown>;
}

export type MesheryRJSFFormData = Record<string, unknown>;
