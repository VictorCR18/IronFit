<script lang="ts" setup>
const emit = defineEmits<{
  (e: "update:section", value: string): void;
}>();

function changeSection(value: string) {
  emit("update:section", value);
}
</script>
<template>
  <v-navigation-drawer app permanent>
    <v-list>
      <v-row class="ga-4 pa-2 ml-2" align="center" justify="center" no-gutters>
        <v-avatar class="custom-gradient" size="44" rounded="lg">IF</v-avatar>
        <v-toolbar-title>IronFit</v-toolbar-title>
      </v-row>

      <v-list-item class="mb-2" title="Painel Administrativo" />
      <v-divider></v-divider>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Alunos"
        @click="changeSection('alunos')"
      />
      <v-list-item
        prepend-icon="mdi-dumbbell"
        title="Treinadores"
        @click="changeSection('treinadores')"
      />
      <v-list-item
        prepend-icon="mdi-cash"
        title="Planos"
        @click="changeSection('planos')"
      />
    </v-list>
  </v-navigation-drawer>
</template>
<style scoped>
.custom-gradient {
  background: var(--v-theme-gradient);
  color: white;
}
</style>
