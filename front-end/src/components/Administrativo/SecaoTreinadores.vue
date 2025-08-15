<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import type { Treinador, Field } from "@/types/types";
import { TreinadorService } from "@/api/services/TreinadorService";
import { z } from "zod";

const treinadorService = new TreinadorService();
const treinadores = ref<Treinador[]>([]);

async function buscarTreinadores() {
  try {
    treinadores.value = await treinadorService.list();
  } catch (error) {
    console.error("Erro ao buscar treinadores:", error);
  }
}

async function salvarTreinador(item: Treinador) {
  try {
    let treinadorSalvo: Treinador;
    if (item.id) {
      treinadorSalvo = await treinadorService.update(item, item.id);
      const idx = treinadores.value.findIndex((t) => t.id === item.id);
      if (idx !== -1) treinadores.value[idx] = treinadorSalvo;
    } else {
      treinadorSalvo = await treinadorService.create(item);
      treinadores.value.push(treinadorSalvo);
    }
  } catch (error) {
    console.error("Erro ao salvar treinador:", error);
  }
}

async function deletarTreinador(id: number) {
  try {
    await treinadorService.delete(id);
    treinadores.value = treinadores.value.filter((t) => t.id !== id);
  } catch (error) {
    console.error("Erro ao excluir treinador:", error);
  }
}

onMounted(async () => {
  await buscarTreinadores();
});

const tableFields: Field[] = [
  {
    label: "Nome",
    key: "nome",
    validation: z
      .string({ required_error: "O nome é obrigatório." })
      .min(1, "O nome deve ter no mínimo 1 caracteres."),
  },
  {
    label: "Especialidade",
    key: "especialidade",
    validation: z
      .string({ required_error: "A especialidade é obrigatória." })
      .min(1, "A especialidade deve ter no mínimo 1 caracteres."),
  },
];
</script>

<template>
  <CrudTable
    title="Treinadores"
    :headers="[
      { title: 'Nome', key: 'nome' },
      { title: 'Especialidade', key: 'especialidade' },
    ]"
    :items="treinadores"
    :fields="tableFields"
    @save="salvarTreinador"
    @delete="deletarTreinador"
  />
</template>
