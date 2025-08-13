<script setup>
import { ref, computed } from "vue";
import SideBar from "@/components/Administrativo/SideBar.vue";
import SecaoAluno from "@/components/Administrativo/SecaoAluno.vue";
import SecaoTreinadores from "@/components/Administrativo/SecaoTreinadores.vue";
import SecaoPlanos from "@/components/Administrativo/SecaoPlanos.vue";

const section = ref("alunos");

const sectionTitle = computed(() => {
  if (section.value === "alunos") return "Gerenciar Alunos";
  if (section.value === "treinadores") return "Gerenciar Treinadores";
  if (section.value === "planos") return "Gerenciar Planos";
  return "";
});
</script>

<template>
  <v-app>
    <SideBar v-model:section="section" />
    <v-main>
      <v-container>
        <v-card-title class="text-h5 font-weight-bold px-0 mx-0">{{ sectionTitle }}</v-card-title>

        <!-- Renderização por seção -->
        <SecaoAluno v-if="section === 'alunos'" />
        <SecaoTreinadores v-else-if="section === 'treinadores'" />
        <SecaoPlanos v-else-if="section === 'planos'" />
      </v-container>
    </v-main>
  </v-app>
</template>
