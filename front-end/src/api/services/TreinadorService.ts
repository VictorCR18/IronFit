import { CrudService } from "@/api/adapters/CrudService";
import type { Treinador } from "@/types/types";

export class TreinadorService extends CrudService<Treinador> {
  constructor() {
    super("/treinador");
  }
}
