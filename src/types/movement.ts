export type MovementType = "SEND" | "EXPENSE" | "SAVING" | "ADJUSTMENT";

export type Workspace = "family" | "demo";

export interface Movement {
  id: string;
  workspace: Workspace;
  type: MovementType;
  amount: number;
  person: string | null;
  category: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MovementRow {
  id: string;
  workspace: string;
  type: string;
  amount: number;
  person: string | null;
  category: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface MovementInput {
  type: MovementType;
  amount: number;
  person: string;
  category?: string | null;
  description?: string | null;
  createdAt?: string;
}

export type MovementFilter = "ALL" | "SEND" | "EXPENSE" | "SAVING";
