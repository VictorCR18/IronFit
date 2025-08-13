<script setup>
const contato = { nome: "", email: "", mensagem: "" };

function enviarContato() {
  alert("Mensagem enviada!");
  contato.nome = "";
  contato.email = "";
  contato.mensagem = "";
}
</script>

<template>
  <v-card class="pa-6">
    <v-row class="align-center" id="contato">
      <v-col cols="12" md="8">
        <v-card-title class="text-h5 font-weight-bold px-0 mx-0">
          Contato</v-card-title
        >
        <v-card-subtitle class="px-0 mx-0 pb-4">
          Fale com a gente para tirar dúvidas ou agendar uma visita.
        </v-card-subtitle>
        <v-form @submit.prevent="enviarContato">
          <v-text-field
            label="Nome"
            v-model="contato.nome"
          ></v-text-field>
          <v-text-field
            label="Email"
            v-model="contato.email"
            type="email"
          ></v-text-field>
          <v-textarea label="Mensagem" v-model="contato.mensagem"></v-textarea>
          <v-btn color="primary" type="submit">Enviar</v-btn>
        </v-form>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="px-4 py-6 text-nowrap" variant="tonal">
          <v-card-title class="text-h6 px-0 mx-0">Endereço</v-card-title>
          <v-card-subtitle class="px-0 mx-0"
            >Rua Exemplo, 123 — Centro, Sua Cidade</v-card-subtitle
          >
          <v-card-title class="text-h6 px-0 mx-0">Horário</v-card-title>
          <v-card-subtitle class="px-0 mx-0"
            >Seg-Sex: 06h-22h<br />Sab: 08h-14h</v-card-subtitle
          >
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
<style scoped>
.text-nowrap {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}
</style>