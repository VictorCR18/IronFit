<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import { PlanoService } from "@/api/services/PlanoService";
import type { Plano } from "@/types/types";

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
      const index = planos.value.findIndex(p => p.id === plano.id);
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
    planos.value = planos.value.filter(p => p.id !== id);
  } catch (error) {
    console.error("Erro ao deletar plano:", error);
  }
}

onMounted(() => {
  carregarPlanos();
});
</script>

<template>
  <CrudTable
    title="Planos"
    :headers="[
      { title: 'Plano', key: 'nome' },
      { title: 'Preço', key: 'preco' },
      { title: 'Descrição', key: 'descricao' }
    ]"
    :items="planos"
    :fields="[
      { label: 'Nome do Plano', key: 'nome' },
      { label: 'Preço', key: 'preco' },
      { label: 'Descrição', key: 'descricao' }
    ]"
    @save="salvarPlano"
    @delete="deletarPlano"
  />
</template>
