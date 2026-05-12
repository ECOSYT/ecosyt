export type NodeID = string;
export type PageID = string;
export type ProjectID = string;
export type OrganizationID = string;
export type UserID = string;
export type SchemaVersion = string;

export interface ProjectSummary {
  id: ProjectID;
  name: string;
  updatedAt: string;
}
