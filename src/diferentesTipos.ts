export type NotasJSON = {
  usuario: string;
  titulo: string;
  contenido?: string;
  color?: string;
}

export type RequestType = {
  tipo: 'add' | 'update' | 'remove' | 'read' | 'list';
  usuario: string,
  titulo?: string;
  contenido?: string;
  color?: string;
};

export type ResponseType = {
  tipo: 'add' | 'update' | 'remove' | 'read' | 'list';
  exito: boolean;
  color?: boolean
  notas?: NotasJSON[];
};