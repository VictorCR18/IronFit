<script lang="ts" setup>
import { PlanoService } from "@/api/services/PlanoService";
import type { Plano } from "@/types/types";
import { onMounted, ref } from "vue";

const planoService = new PlanoService();

const planos = ref<Plano[]>([]);
const erro = ref(false);

async function carregarPlanos() {
  try {
    planos.value = await planoService.list();
    if (planos.value.length === 0) erro.value = true;
  } catch (e) {
    console.error("Erro ao carregar planos:", e);
    erro.value = true;
  }
}

onMounted(() => {
  carregarPlanos();
});
</script>

<template>
  <v-row id="planos" class="my-10">
    <v-col cols="12">
      <v-card-title class="text-h5 font-weight-bold pa-0 ma-0">Planos</v-card-title>
    </v-col>

    <v-col cols="12" v-if="erro">
      <v-alert type="warning" border="start" colored-border>
        Sem informações
      </v-alert>
    </v-col>

    <v-col cols="12" md="4" v-for="p in planos" :key="p.nome" v-else>
      <v-card class="text-center pa-4 text-nowrap">
        <v-card-title>{{ p.nome || "Sem informações" }}</v-card-title>
        <v-card-text class="text-h5 font-weight-bold ma-0 pa-0">
          {{ p.preco ? "R$ " + p.preco + "/mês" : "00,00/mês" }}
        </v-card-text>
        <v-card-subtitle>{{ p.descricao || "Sem informações" }}</v-card-subtitle>
        <v-card-actions class="justify-center">
          <v-btn variant="elevated" color="primary">Assinar</v-btn>
        </v-card-actions>
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
