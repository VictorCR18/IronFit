<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import { PlanoService } from "@/api/services/PlanoService";
import type { Plano } from "@/types/types";

// Instância do serviço
const planoService = new PlanoService();

// State
const planos = ref<Plano[]>([]);

// Carregar todos os planos
async function carregarPlanos() {
  try {
    planos.value = await planoService.list(); // método correto do CrudService
  } catch (error) {
    console.error("Erro ao carregar planos:", error);
  }
}

// Adicionar um novo plano
async function adicionarPlano(novoPlano: Plano) {
  try {
    const planoCriado = await planoService.create(novoPlano);
    planos.value.push(planoCriado);
  } catch (error) {
    console.error("Erro ao adicionar plano:", error);
  }
}

// Montar componente
onMounted(() => {
  carregarPlanos();
});
</script>

<template>
  <CrudTable
    title="Planos"
    :headers="[
      { title: 'Plano', key: 'nome' },
      { title: 'Preço', key: 'preco' }
    ]"
    :items="planos"
    :fields="[
      { label: 'Nome do Plano', key: 'nome' },
      { label: 'Preço', key: 'preco' }
    ]"
    @save="adicionarPlano"
  />
</template>
