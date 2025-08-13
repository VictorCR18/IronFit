<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import { AlunoService } from "@/api/services/AlunoService";
import { PlanoService } from "@/api/services/PlanoService";
import type { Aluno, Plano } from "@/types/types";

// Serviços
const alunoService = new AlunoService();
const planoService = new PlanoService();

// States
const alunos = ref<Aluno[]>([]);
const planos = ref<Plano[]>([]);

// Buscar todos os alunos
async function buscarAlunos() {
  try {
    alunos.value = await alunoService.list();
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
  }
}

// Buscar todos os planos
async function buscarPlanos() {
  try {
    planos.value = await planoService.list();
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
  }
}

// Adicionar aluno
async function adicionarAluno(item: Aluno) {
  try {
    const planoId = typeof item.plano === "object" && item.plano !== null ? item.plano.id : item.plano;
    const planoCompleto = planos.value.find((p) => p.id === planoId);
    if (!planoCompleto) {
      throw new Error("Plano selecionado não encontrado.");
    }
    const payload: Aluno = {
      ...item,
      plano: planoCompleto,
    };
    const response = await alunoService.create(payload);
    alunos.value.push(response);
  } catch (error) {
    console.error("Erro ao adicionar aluno:", error);
  }
}

// Montar componente
onMounted(() => {
  buscarAlunos();
  buscarPlanos();
});
</script>

<template>
  <CrudTable
    title="Alunos"
    :headers="[
      { title: 'Nome', key: 'nome' },
      { title: 'E-mail', key: 'email' },
      { title: 'Contato', key: 'contato' },
      { title: 'Plano', key: 'plano.nome' },
    ]"
    :items="alunos"
    :fields="[
      { label: 'Nome', key: 'nome' },
      { label: 'E-mail', key: 'email' },
      { label: 'Contato', key: 'contato' },
      {
        label: 'Plano',
        key: 'plano',
        type: 'select',
        options: planos.map((p) => ({ id: p.id!, nome: p.nome })),
        optionLabel: 'nome',
        optionValue: 'id'
      }
    ]"
    @save="adicionarAluno"
  />
</template>
