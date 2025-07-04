
import type { Database } from "./database.types";

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Partial';
export type CompletionStatus = 'Pending' | 'In Progress' | 'Completed';

export type Customer = Database['public']['Tables']['customers']['Row'] & {
  measurements?: Measurement[];
};

export type Measurement = Database['public']['Tables']['measurements']['Row'];
