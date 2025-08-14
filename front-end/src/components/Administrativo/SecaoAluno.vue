<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import { AlunoService } from "@/api/services/AlunoService";
import { PlanoService } from "@/api/services/PlanoService";
import type { Aluno, Plano, Field } from "@/types/types";
import { z } from "zod";

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
  }
}

async function deletarAluno(id: number) {
  try {
    await alunoService.delete(id);
    alunos.value = alunos.value.filter((a) => a.id !== id);
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
  }
}

onMounted(async () => {
  await Promise.all([buscarPlanos(), buscarAlunos()]);

  tableFields.value = [
    {
      key: "nome",
      label: "Nome Completo",
      validation: z
        .string({ required_error: "O nome é obrigatório." })
        .min(3, "O nome deve ter no mínimo 3 caracteres."),
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

});
</script>

<template>
  <CrudTable
    title="Alunos"
    :headers="tableHeaders"
    :items="alunos"
    :fields="tableFields"
    @save="salvarAluno"
    @delete="deletarAluno"
  />
</template>