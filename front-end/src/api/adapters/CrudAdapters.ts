export interface CrudAdapters<T> {
  create(objeto: T): Promise<T>;
  update(objeto: T, id: number): Promise<T>;
  delete(id: number): void;
  list(): Promise<T[]>;
  getById(id: number): Promise<T>;
}
