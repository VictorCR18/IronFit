<template>
  <v-app-bar class="py-4" color="background" app :elevation="0">
    <v-avatar class="custom-gradient" size="44" rounded="lg">IF</v-avatar>
    <v-toolbar-title>IronFit</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-card-actions class="ga-6">
      <v-btn variant="outlined" class="border-sm" color="secondary" to="#sobre">Sobre</v-btn>
      <v-btn variant="outlined" class="border-sm" color="secondary" to="#planos">Planos</v-btn>
      <v-btn variant="outlined" class="border-sm" color="secondary" to="#treinadores"
        >Treinadores</v-btn
      >
      <v-btn variant="outlined" class="border-sm" color="secondary" to="#contato">Contato</v-btn>
      <v-btn variant="elevated" color="primary" to="#matricular">
        Matricule-se
      </v-btn>
    </v-card-actions>
  </v-app-bar>
</template>
<style scoped>
.custom-gradient {
  background: var(--v-theme-gradient);
  color: white;
}
</style>
