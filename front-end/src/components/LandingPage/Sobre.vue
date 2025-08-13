<template>
  <v-card class="pa-6">
    <v-row id="sobre" class="my-10">
      <v-col cols="12">
        <v-card-title class="text-h5 font-weight-bold pa-0 ma-0"
          >Sobre a IronFit</v-card-title
        >
        <v-card-subtitle class="pa-0 ma-0 text-nowrap">
          Somos uma academia comprometida em entregar programas de treino
          sustentáveis com foco na saúde e resultados duradouros.
        </v-card-subtitle>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="tonal" class="h-100 pb-4">
          <v-card-title class="text-nowrap">Equipamentos de ponta</v-card-title>
          <v-card-subtitle class="text-nowrap"
            >Linhas modernas para força e cardio.</v-card-subtitle
          >
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="tonal" class="h-100 pb-4">
          <v-card-title class="text-nowrap"
            >Treinos personalizados</v-card-title
          >
          <v-card-subtitle class="text-nowrap"
            >Planos adaptados ao seu objetivo.</v-card-subtitle
          >
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="tonal" class="h-100 pb-4">
          <v-card-title class="text-nowrap">Suporte nutricional</v-card-title>
          <v-card-subtitle class="text-nowrap"
            >Profissionais credenciados para orientar sua
            dieta.</v-card-subtitle
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
