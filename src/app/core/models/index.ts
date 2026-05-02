export interface User {
  id_user: number;
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface Categorie {
  id_categorie: number;
  name: string;
  description: string;
}

export interface Payment {
  id_payment: number;
  name: string;
  type: string;
}

export interface Type {
  id_type: number;
  name: string;
}

export interface Spent {
  id_spent: number;
  name: string;
  amount: number;
  description: string;
  date: string;
  hour: string;
  id_payment_method: number;
  id_categorie: number;
  id_user: number;
}

export interface Income {
  id_income: number;
  name: string;
  amount: number;
  description: string;
  date: string;
  hour: string;
  source: string;
  id_type: number;
  id_user: number;
}
