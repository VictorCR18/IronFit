import { CrudService } from "@/api/adapters/CrudService";
import type { Aluno } from "@/types/types";

export class AlunoService extends CrudService<Aluno> {
  constructor() {
    super("/aluno");
  }
}
