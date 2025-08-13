<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import type { Treinador } from "@/types/types";
import { TreinadorService } from "@/api/services/TreinadorService";

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

onMounted(() => {
  buscarTreinadores();
});
</script>

<template>
  <CrudTable
    title="Treinadores"
    :headers="[
      { title: 'Nome', key: 'nome' },
      { title: 'Especialidade', key: 'especialidade' }
    ]"
    :items="treinadores"
    :fields="[
      { label: 'Nome', key: 'nome' },
      { label: 'Especialidade', key: 'especialidade' }
    ]"
    @save="salvarTreinador"
    @delete="deletarTreinador"
  />
</template>
