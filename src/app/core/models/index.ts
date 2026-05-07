export interface User {
  idUser: number;
  name: string;
  email: string;
  contrasena?: string;
  role: string;
}

export interface Categorie {
  idCategorie: number;
  name: string;
  description: string;
}

export interface Payment {
  idPayment: number;
  name: string;
  idType: number;
}

export interface IncomeType {
  idType: number;
  name: string;
  description: string;
}

export interface Spent {
  idSpent: number;
  name: string;
  amount: number;
  description: string;
  date: string;
  hour: string;
  idPayment: number;
  idCategorie: number;
  idUser: number;
}

export interface Income {
  idIncome: number;
  amount: number;
  source: string;
  date: string;
  description: string;
  idUser: number;
}
