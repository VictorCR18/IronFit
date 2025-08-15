<script lang="ts" setup>
import type { Treinador } from "@/types/types";
import { TreinadorService } from "@/api/services/TreinadorService";
import { onMounted, ref } from "vue";

// Firebase
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const treinadorService = new TreinadorService();

const treinadores = ref<Treinador[]>([]);
const erro = ref(false);

// Fallback Firebase
async function buscarTreinadoresFirebase(): Promise<Treinador[]> {
  try {
    const treinadoresCollection = collection(db, "treinadores");
    const snapshot = await getDocs(treinadoresCollection);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        nome: data.nome,
        especialidade: data.especialidade,
      } as unknown as Treinador;
    });
  } catch (error) {
    console.error("Erro ao buscar treinadores no Firebase:", error);
    return [];
  }
}

async function carregarTreinadores() {
  erro.value = false;
  try {
    const backendTreinadores = await treinadorService.list();
    if (backendTreinadores.length > 0) {
      treinadores.value = backendTreinadores;
    } else {
      treinadores.value = await buscarTreinadoresFirebase();
    }
    if (treinadores.value.length === 0) erro.value = true;
  } catch (e) {
    console.warn("Backend indisponível, buscando treinadores no Firebase...");
    treinadores.value = await buscarTreinadoresFirebase();
    if (treinadores.value.length === 0) erro.value = true;
  }
}

onMounted(() => {
  carregarTreinadores();
});
</script>

<template>
  <v-row id="treinadores" class="my-10 justify-center">
    <v-col cols="12">
      <v-card-title class="text-h5 font-weight-bold pa-0 ma-0">
        Treinadores
      </v-card-title>
    </v-col>

    <v-col cols="12" v-if="erro">
      <v-alert type="warning" border="start" colored-border>
        Sem informações
      </v-alert>
    </v-col>

    <v-col cols="12" sm="6" md="3" v-for="t in treinadores" :key="t.id" v-else>
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
