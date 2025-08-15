<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import { AlunoService } from "@/api/services/AlunoService";
import { PlanoService } from "@/api/services/PlanoService";
import type { Aluno, Plano, Field } from "@/types/types";
import { z } from "zod";

import { useFormatters } from "@/utils/useFormatters";

const { formatTelefone, unformat } = useFormatters();

const isLoading = ref(true);

const alunoService = new AlunoService();
const planoService = new PlanoService();

const alunos = ref<Aluno[]>([]);
const planos = ref<Plano[]>([]);
const tableHeaders = [
  { title: "Nome", key: "nome" },
  { title: "E-mail", key: "email" },
  { title: "Contato", key: "contato" },
  { title: "Plano", key: "plano.nome" },
  { title: "Pagamento", key: "pagamento", align: "center" },
];
const tableFields = ref<Field[]>([]);

async function buscarAlunos() {
  try {
    alunos.value = await alunoService.list();
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
  }
}

async function buscarPlanos() {
  try {
    planos.value = await planoService.list();
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
  }
}

async function salvarAluno(item: any) {
  isLoading.value = true;
  try {
    const planoCompleto = planos.value.find((p) => p.id === item.plano);
    if (!planoCompleto) throw new Error("Plano selecionado não encontrado.");
    const payload: Aluno = { ...item, plano: planoCompleto };

    let alunoSalvo: Aluno;
    if (item.id) {
      alunoSalvo = await alunoService.update(payload, item.id);
      const idx = alunos.value.findIndex((a) => a.id === item.id);
      if (idx !== -1) alunos.value[idx] = alunoSalvo;
    } else {
      alunoSalvo = await alunoService.create(payload);
      alunos.value.push(alunoSalvo);
    }
  } catch (error) {
    console.error("Erro ao salvar aluno:", error);
  } finally {
    isLoading.value = false;
  }
}

async function deletarAluno(id: number) {
  isLoading.value = true;
  try {
    await alunoService.delete(id);
    alunos.value = alunos.value.filter((a) => a.id !== id);
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await buscarPlanos();

    tableFields.value = [
      {
        key: "nome",
        label: "Nome Completo",
        validation: z
          .string({ required_error: "O nome é obrigatório." })
          .min(1, "O nome deve ter no mínimo 1 caracteres."),
      },
      {
        key: "email",
        label: "E-mail",
        type: "text",
        validation: z
          .string({ required_error: "O e-mail é obrigatório." })
          .email("Digite um e-mail válido."),
      },
      {
        key: "contato",
        label: "Contato (Telefone/WhatsApp)",
        formatter: formatTelefone,
        validation: z
          .string({ required_error: "O contato é obrigatório." })
          .min(10, "Digite um contato válido com DDD."),
      },

      {
        key: "plano",
        label: "Plano",
        type: "select",
        options: planos.value,
        optionLabel: "nome",
        optionValue: "id",
        validation: z.number({
          required_error: "Selecione um plano.",
          invalid_type_error: "Selecione um plano.",
        }),
      },
      {
        key: "pagamento",
        label: "Pagamento em dia",
        type: "checkbox",
      },
    ];

    await buscarAlunos();
  } catch (error) {
    console.error("Erro na montagem do componente:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <CrudTable
    title="Alunos"
    :headers="tableHeaders"
    :items="alunos"
    :fields="tableFields"
    :loading="isLoading"
    @save="salvarAluno"
    @delete="deletarAluno"
  />
</template>
