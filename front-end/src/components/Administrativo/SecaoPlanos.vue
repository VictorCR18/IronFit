<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import { PlanoService } from "@/api/services/PlanoService";
import type { Plano, Field } from "@/types/types"; 
import { z } from "zod";

const planoService = new PlanoService();
const planos = ref<Plano[]>([]);

async function carregarPlanos() {
  try {
    planos.value = await planoService.list();
  } catch (error) {
    console.error("Erro ao carregar planos:", error);
  }
}

async function salvarPlano(plano: Plano) {
  try {
    let planoSalvo: Plano;
    if (plano.id) {
      planoSalvo = await planoService.update(plano, plano.id);
      const index = planos.value.findIndex((p) => p.id === plano.id);
      if (index !== -1) planos.value[index] = planoSalvo;
    } else {
      planoSalvo = await planoService.create(plano);
      planos.value.push(planoSalvo);
    }
  } catch (error) {
    console.error("Erro ao salvar plano:", error);
  }
}

async function deletarPlano(id: number) {
  try {
    await planoService.delete(id);
    planos.value = planos.value.filter((p) => p.id !== id);
  } catch (error) {
    console.error("Erro ao deletar plano:", error);
  }
}

onMounted(async () => {
  await carregarPlanos();
});

const tableFields: Field[] = [
  {
    label: "Nome do Plano",
    key: "nome",
    validation: z
      .string({ required_error: "O nome do plano é obrigatório." })
      .min(1, "O nome deve ter no mínimo 1 caracteres."),
  },
  {
    label: "Preço",
    key: "preco",
    type: "number",
    validation: z.coerce 
      .number({
        required_error: "O preço é obrigatório.",
        invalid_type_error: "Digite um preço válido.",
      })
      .positive("O preço deve ser um valor positivo."),
  },
  {
    label: "Descrição",
    key: "descricao",
    validation: z.string().optional(), 
  },
];
</script>

<template>
  <CrudTable
    title="Planos"
    :headers="[
      { title: 'Plano', key: 'nome' },
      { title: 'Preço', key: 'preco' },
      { title: 'Descrição', key: 'descricao' },
    ]"
    :items="planos"
    :fields="tableFields"
    @save="salvarPlano"
    @delete="deletarPlano"
  />
</template>
