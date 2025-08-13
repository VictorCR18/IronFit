<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import type { Treinador } from "@/types/types";
import { TreinadorService } from "@/api/services/TreinadorService";

// Serviço
const treinadorService = new TreinadorService();

// State
const treinadores = ref<Treinador[]>([]);

// Buscar todos os treinadores
async function buscarTreinadores() {
  try {
    treinadores.value = await treinadorService.list();
  } catch (error) {
    console.error("Erro ao buscar treinadores:", error);
  }
}

// Adicionar treinador
async function adicionarTreinador(item: Treinador) {
  try {
    console.log(item);
    const response = await treinadorService.create(item);
    treinadores.value.push(response); // adiciona na lista local
  } catch (error) {
    console.error("Erro ao adicionar treinador:", error);
  }
}

// Montar componente
onMounted(() => {
  buscarTreinadores();
});
</script>

<template>
  <CrudTable
    title="Treinadores"
    :headers="[
      { title: 'Nome', key: 'nome' },
      { title: 'Especialidade', key: 'especialidade' },
    ]"
    :items="treinadores"
    :fields="[
      { label: 'Nome', key: 'nome' },
      { label: 'Especialidade', key: 'especialidade' },
    ]"
    @save="adicionarTreinador"
  />
</template>
