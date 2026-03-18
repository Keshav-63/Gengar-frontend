export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  storage_used: number;
  storage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  full_name?: string;
  email?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface File {
  id: string;
  name: string;
  original_name: string;
  owner_id: string;
  folder_id?: string;
  file_size: number;
  mime_type: string;
  file_type: string;
  is_compressed: boolean;
  compression_status: "pending" | "processing" | "completed" | "failed" | "skipped";
  compressed_size?: number;
  compression_ratio?: number;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  name: string;
  owner_id: string;
  parent_folder_id?: string;
  path: string;
  created_at: string;
  updated_at: string;
}

export interface FolderTreeNode {
  id: string;
  name: string;
  path: string;
  children: FolderTreeNode[];
  file_count: number;
}

export interface StorageInfo {
  storage_used: number;
  storage_limit: number;
  storage_available: number;
  usage_percentage: number;
}

export interface ShareResponse {
  id: string;
  resource_type: string;
  resource_id: string;
  owner_id: string;
  shared_with_user_id?: string | null;
  permission: string;
  access_token: string;
  is_public: boolean;
  expires_at?: string;
  created_at: string;
  is_active: boolean;
  access_count: number;
  share_url: string;
}

export interface ShareListResponse {
  shares: ShareResponse[];
  total: number;
}

export interface ShareAccessResponse {
  resource_type: string;
  resource_name: string;
  permission: string;
  download_url?: string;
  owner_name: string;
  created_at: string;
  expires_at?: string;
}

export interface ShortURLResponse {
  id: string;
  short_code: string;
  share_id: string;
  short_url: string;
  original_url: string;
  created_at: string;
  expires_at?: string;
  click_count: number;
  is_active: boolean;
}

export interface ShortURLListResponse {
  short_urls: ShortURLResponse[];
  total: number;
}

export interface Upload {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}
