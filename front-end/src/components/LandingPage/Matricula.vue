<script lang="ts" setup>
import { reactive } from "vue";

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
const matricula = reactive({ nome: "", email: "", telefone: "", plano: "" });

function enviarMatricula() {
  alert("Inscrição recebida!");
  matricula.nome = "";
  matricula.email = "";
  matricula.telefone = "";
  matricula.plano = "";
}
</script>

<template>
  <v-card class="mt-13 pa-6">
    <v-row id="matricular">
      <v-col cols="12" md="6">
        <v-card-title class="text-h5 font-weight-bold px-0 mx-0"
          >Matricule-se</v-card-title
        >
        <v-card-subtitle class="pa-0 ma-0 mb-4">
          Preencha o formulário abaixo para iniciar sua jornada fitness.
        </v-card-subtitle>
        <v-form @submit.prevent="enviarMatricula">
          <v-text-field
            label="Nome"
            v-model="matricula.nome"
            required
          ></v-text-field>
          <v-text-field
            label="Email"
            v-model="matricula.email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            label="Telefone/WhatsApp"
            v-model="matricula.telefone"
            required
          ></v-text-field>
          <v-select
            :items="planos.map((p) => p.nome)"
            label="Plano"
            v-model="matricula.plano"
          ></v-select>
          <v-btn color="primary" type="submit">Enviar inscrição</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>
