import { CrudService } from "@/api/adapters/CrudService";
import type { Plano } from "@/types/types";

export class PlanoService extends CrudService<Plano> {
  constructor() {
    super("/plano");
  }
}
