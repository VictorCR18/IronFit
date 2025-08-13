<script setup>
import NavBar from "@/components/LandingPage/NavBar.vue";
import Sobre from "@/components/LandingPage/Sobre.vue";
import Treinadores from "@/components/LandingPage/Treinadores.vue";
import Planos from "@/components/LandingPage/Planos.vue";
import Matricula from "@/components/LandingPage/Matricula.vue";
import Contato from "@/components/LandingPage/Contato.vue";
import Principal from "@/components/LandingPage/Principal.vue";
</script>

<template>
  <v-app class="pa-7">
    <v-container>
      <NavBar />
      <v-main>
        <Principal />
        <Sobre />
        <Treinadores />
        <Planos />
        <Contato />
        <Matricula />
      </v-main>

      <v-footer padless>
        <v-col class="text-center" cols="12"
          >© IronFit — Todos os direitos reservados • (99) 99999-9999 •
          contato@ironfit.com</v-col
        >
      </v-footer>
    </v-container>
  </v-app>
</template>
