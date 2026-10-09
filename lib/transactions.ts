export type TransactionType = "income" | "expense";

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  title: string;
  category: string;
  amount: string;
  date: string;
}
