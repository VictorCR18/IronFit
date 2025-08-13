<script lang="ts" setup>
import type { Props } from "@/types/types";
import { ref } from "vue";

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "save", item: any): void;
}>();

const dialog = ref(false);
const novoItem = ref<any>({});

function salvar() {
  if (props.fields.some((f) => !novoItem.value[f.key])) return;

  emit("save", { ...novoItem.value });
  novoItem.value = {};
  dialog.value = false;
}
</script>

<template>
  <v-data-table
    :headers="props.headers"
    :items="props.items"
    class="elevation-1"
    density="comfortable"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>{{ props.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" class="mr-4" color="primary" @click="dialog = true">Adicionar</v-btn>
      </v-toolbar>
    </template>
  </v-data-table>

  <v-dialog v-model="dialog" max-width="500px">
    <v-card class="py-4">
      <v-card-title>Adicionar {{ props.title.slice(0, -1) }}</v-card-title>
      <v-card-text>
        <template v-for="field in props.fields" :key="field.key">
          <!-- Campo SELECT -->
          <v-select
            v-if="field.type === 'select'"
            :label="field.label"
            :items="field.options"
            :item-title="field.optionLabel"
            :item-value="field.optionValue"
            v-model="novoItem[field.key]"
            variant="outlined"
          />
          <!-- Campo padrão -->
          <v-text-field
            v-else
            :label="field.label"
            :type="field.type || 'text'"
            v-model="novoItem[field.key]"
            variant="outlined"
          />
        </template>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancelar</v-btn>
        <v-btn variant="elevated" class="px-4" color="primary" @click="salvar">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
