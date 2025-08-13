import type { CrudAdapters } from "./CrudAdapters";
import httpClient from "./HttpClient";

export class CrudService<T> implements CrudAdapters<T> {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  async create(objeto: T): Promise<T> {
    const { data } = await httpClient.post(this.url, objeto);
    return data;
  }

  async update(objeto: T, id: number): Promise<T> {
    const { data } = await httpClient.patch(`${this.url}/${id}`, objeto);
    return data;
  }

  async delete(id: number) {
    await httpClient.delete(`${this.url}/${id}`);
  }

  async list(coordenadorId?: number): Promise<T[]> {
    const { data } = await httpClient.get(this.url, {
      params: { coordenadorId },
    });
    return data;
  }

  async getById(id: number): Promise<T> {
    const { data } = await httpClient.get(`${this.url}/${id}`);
    return data;
  }
}
