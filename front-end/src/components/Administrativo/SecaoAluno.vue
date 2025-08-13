<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import { AlunoService } from "@/api/services/AlunoService";
import { PlanoService } from "@/api/services/PlanoService";
import type { Aluno, Plano } from "@/types/types";

const alunoService = new AlunoService();
const planoService = new PlanoService();

const alunos = ref<Aluno[]>([]);
const planos = ref<Plano[]>([]);

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

async function salvarAluno(item: Aluno) {
  try {
    const planoId =
      typeof item.plano === "object" && item.plano !== null
        ? item.plano.id
        : item.plano;
    const planoCompleto = planos.value.find((p) => p.id === planoId);
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
      { title: 'Pagamento', key: 'pagamento' },
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
      },
      {
        label: 'Pagamento',
        key: 'pagamento',
        type: 'checkbox',
      }
    ]"
    @save="salvarAluno"
    @delete="deletarAluno"
  />
</template>
