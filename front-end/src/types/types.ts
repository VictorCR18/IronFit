import type z from "zod";

export interface Notificacao {
  mensagem: string;
  tipoMensagem: string;
  visibilidade: boolean;
}

export interface Aluno {
  id?: number;
  nome: string;
  email: string;
  contato: string;
  plano: Plano | number;
  pagamento?: boolean;
}

export interface Treinador {
  id?: number;
  nome: string;
  especialidade: string;
}

export interface Plano {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
}

export interface Field {
  label: string;
  key: string;
  type?: "text" | "select" | "checkbox" | "date" | "number";
  options?: { id: number; nome: string }[];
  optionLabel?: string;
  optionValue?: string;
  validation?: z.ZodTypeAny;
}

export interface Header {
  title: string;
  key: string;
}

export interface Props {
  title: string;
  headers: Header[];
  items: any[];
  fields: Field[];
}
