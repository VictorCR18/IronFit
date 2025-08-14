<script lang="ts" setup>
import type { Treinador } from "@/types/types";
import { TreinadorService } from "@/api/services/TreinadorService";
import { onMounted, ref } from "vue";

const treinadorService = new TreinadorService();

const treinadores = ref<Treinador[]>([]);
const erro = ref(false);

async function buscarTreinadores() {
  try {
    treinadores.value = await treinadorService.list();
    if (treinadores.value.length === 0) {
      erro.value = true;
    }
  } catch (e) {
    console.error("Erro ao buscar treinadores:", e);
    erro.value = true;
  }
}

onMounted(() => {
  buscarTreinadores();
});
</script>

<template>
  <v-row id="treinadores" class="my-10 justify-center">
    <v-col cols="12">
      <v-card-title class="text-h5 font-weight-bold pa-0 ma-0"
        >Treinadores</v-card-title
      >
    </v-col>

    <v-col cols="12" v-if="erro">
      <v-alert type="warning" border="start" colored-border>
        Sem informações
      </v-alert>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      md="3"
      v-for="t in treinadores"
      :key="t.nome"
      v-else
    >
      <v-card class="pa-4 text-center text-nowrap">
        <v-avatar size="80" class="mx-auto mt-4" color="primary" rounded="lg">
          <span class="white--text">{{
            t.nome.substring(0, 2).toUpperCase()
          }}</span>
        </v-avatar>
        <v-card-title class="justify-center">{{ t.nome }}</v-card-title>
        <v-card-subtitle class="text-center">{{
          t.especialidade
        }}</v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.text-nowrap {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}
</style>
