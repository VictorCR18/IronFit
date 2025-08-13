<script lang="ts" setup>
const treinadores = [
  { iniciais: "MC", nome: "Mariana Costa", especialidade: "Força" },
  {
    iniciais: "RG",
    nome: "Rafael Gomes",
    especialidade: "Condicionamento",
  },
  { iniciais: "LP", nome: "Luísa Pires", especialidade: "Pilates" },
  { iniciais: "TD", nome: "Tiago Duarte", especialidade: "HIIT" },
];
</script>

<template>
  <v-row id="treinadores" class="my-10">
    <v-col cols="12">
      <v-card-title class="text-h5 font-weight-bold pa-0 ma-0">Treinadores</v-card-title>
    </v-col>
    <v-col cols="12" sm="6" md="3" v-for="t in treinadores" :key="t.nome">
      <v-card class="pa-4 text-center text-nowrap">
        <v-avatar size="80" class="mx-auto mt-4" color="primary"rounded="lg">
          <span class="white--text">{{ t.iniciais }}</span>
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