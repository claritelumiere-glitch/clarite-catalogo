export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    PostgrestVersion: "12";
    Tables: {
      categorias: {
        Row: {
          id: string;
          nome: string;
          slug: string;
          descricao: string | null;
          imagem_url: string | null;
          ordem: number;
          ativo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          slug: string;
          descricao?: string | null;
          imagem_url?: string | null;
          ordem?: number;
          ativo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          slug?: string;
          descricao?: string | null;
          imagem_url?: string | null;
          ordem?: number;
          ativo?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      produtos: {
        Row: {
          id: string;
          categoria_id: string | null;
          codigo: string;
          nome: string;
          slug: string;
          descricao: string | null;
          preco: number | null;
          imagens: string[];
          ativo: boolean;
          destaque: boolean;
          estoque: number;
          caracteristicas: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          categoria_id?: string | null;
          codigo: string;
          nome: string;
          slug: string;
          descricao?: string | null;
          preco?: number | null;
          imagens?: string[];
          ativo?: boolean;
          destaque?: boolean;
          estoque?: number;
          caracteristicas?: Record<string, string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          categoria_id?: string | null;
          codigo?: string;
          nome?: string;
          slug?: string;
          descricao?: string | null;
          preco?: number | null;
          imagens?: string[];
          ativo?: boolean;
          destaque?: boolean;
          estoque?: number;
          caracteristicas?: Record<string, string>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never & { Row: Record<string, unknown>; Relationships: [] }>;
    Functions: Record<string, never & { Args: Record<string, unknown>; Returns: unknown }>;
    Enums: Record<string, never>;
  };
}

export type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
export type Produto = Database["public"]["Tables"]["produtos"]["Row"];
export type ProdutoInsert = Database["public"]["Tables"]["produtos"]["Insert"];
export type ProdutoUpdate = Database["public"]["Tables"]["produtos"]["Update"];

export interface ProdutoVariante {
  id: string;
  produto_id: string;
  nome: string;
  codigo: string;
  preco: number | null;
  estoque: number;
  ativo: boolean;
  ordem: number;
  imagem: string | null;
  created_at: string;
}
