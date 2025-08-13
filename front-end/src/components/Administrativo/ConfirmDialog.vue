<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  message?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();

function cancelar() {
  emit("update:modelValue", false);
}

function confirmar() {
  emit("confirm");
  emit("update:modelValue", false);
}
</script>

<template>
  <v-dialog v-model="props.modelValue" max-width="400px">
    <v-card class="px-4 py-6">
      <v-card-title class="text-h6">{{
        props.title || "Confirmar"
      }}</v-card-title>
      <v-card-text>{{
        props.message || "Tem certeza que deseja continuar?"
      }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancelar">Cancelar</v-btn>
        <v-btn color="error" variant="elevated" @click="confirmar"
          >Confirmar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
