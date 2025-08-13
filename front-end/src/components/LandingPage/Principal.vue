<script setup></script>

<template>
  <v-row class="my-10" align="center">
    <v-col cols="12" md="8">
      <v-card class="pa-6">
        <v-card-title
        class="text-h4 font-weight-bold"
          :style="{
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'clip',
          }"
        >
          Alcance sua melhor versão —<br/> Treinos personalizados e estrutura
          completa
        </v-card-title>

        <v-card-subtitle
          :style="{
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'clip',
          }"
        >
          Plano com acompanhamento presencial e online, horários flexíveis,
          programas para hipertrofia, perda de gordura e condicionamento.
        </v-card-subtitle>

        <v-card-actions class="flex-column align-start px-6 pt-6 mb-2">
          <v-row class="d-flex ga-2">
            <v-btn variant="elevated" color="primary" class="mr-2"
              >Teste Grátis 7 dias</v-btn
            >
            <v-btn  class="border-sm" color="secondary" to="#planos">Ver Planos</v-btn>
          </v-row>
        </v-card-actions>
        <row class="d-flex ga-3 ml-2">
          <v-chip color="secondary">Aulas coletivas</v-chip>
          <v-chip color="secondary">Avaliação física</v-chip>
          <v-chip color="secondary">App para treinos</v-chip>
        </row>
        <row class="flex-column">
          <v-card-text class="text-start">
            Horários Populares
          </v-card-text>
          <div class="d-flex ga-3 ml-2">
            <v-chip color="secondary">06:00 - 07:30</v-chip>
            <v-chip color="secondary">12:00 - 13:30</v-chip>
            <v-chip color="secondary">18:00 - 20:00</v-chip>
          </div>
        </row>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="pa-6">
        <v-card-title class="ml-n4">Plano Popular</v-card-title>
        <v-card-subtitle class="ml-n4">R$ 129/mês</v-card-subtitle>
        <v-card-text>
          <ul>
            <li>Treinos ilimitados</li>
            <li>Aulas coletivas</li>
            <li>Avaliação mensal</li>
          </ul>
        </v-card-text>
        <v-card-actions class="ml-n2">
          <v-btn variant="elevated" color="primary">Assinar</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
