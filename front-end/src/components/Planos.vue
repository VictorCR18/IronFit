<script lang="ts" setup>
const planos = [
  {
    nome: "Básico",
    preco: "R$ 89/mês",
    descricao: "Acesso às máquinas e vestiários.",
  },
  {
    nome: "Popular",
    preco: "R$ 129/mês",
    descricao: "Aulas coletivas + avaliação mensal.",
  },
  {
    nome: "Premium",
    preco: "R$ 199/mês",
    descricao: "Treinador exclusivo + benefícios.",
  },
];
</script>

<template>
  <v-row id="planos" class="my-10">
    <v-col cols="12">
      <v-card-title class="text-h5 font-weight-bold pa-0 ma-0">Planos</v-card-title>
    </v-col>
    <v-col cols="12" md="4" v-for="p in planos" :key="p.nome">
      <v-card class="text-center pa-4">
        <v-card-title>{{ p.nome }}</v-card-title>
        <v-card-text class="text-h5 font-weight-bold ma-0 pa-0 ">{{ p.preco }}</v-card-text>
        <v-card-subtitle>{{ p.descricao }}</v-card-subtitle>
        <v-card-actions class="justify-center">
          <v-btn variant="elevated" color="primary">Assinar</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
