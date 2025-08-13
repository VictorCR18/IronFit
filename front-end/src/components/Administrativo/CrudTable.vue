<script lang="ts" setup>
import type { Props } from "@/types/types";
import ConfirmDialog from "@/components/Administrativo/ConfirmDialog.vue";
import { ref, reactive } from "vue";

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "save", item: any): void;
  (e: "delete", id: number): void;
  (e: "toggle-checkbox", item: any): void;
}>();

const dialog = ref(false);
const editando = ref(false);

const dialogDelete = ref(false);
const idParaExcluir = ref<number | null>(null);

const novoItem = reactive<any>({}); // reativo

function abrirEdicao(item: any) {
  Object.keys(novoItem).forEach((key) => delete novoItem[key]);
  Object.assign(novoItem, item);
  props.fields.forEach((field) => {
    if (field.type === "checkbox") {
      novoItem[field.key] = !!novoItem[field.key];
    }
  });

  editando.value = true;
  dialog.value = true;
}

function abrirAdicionar() {
  Object.keys(novoItem).forEach((key) => delete novoItem[key]);
  props.fields.forEach((field) => {
    if (field.type === "checkbox") novoItem[field.key] = false;
    else novoItem[field.key] = "";
  });
  editando.value = false;
  dialog.value = true;
}

function salvar() {
  emit("save", { ...novoItem });
  Object.keys(novoItem).forEach((key) => delete novoItem[key]);
  dialog.value = false;
  editando.value = false;
}

function abrirConfirmacaoExclusao(id: number) {
  idParaExcluir.value = id;
  dialogDelete.value = true;
}

function confirmarExclusao() {
  if (idParaExcluir.value != null) {
    emit("delete", idParaExcluir.value);
  }
  idParaExcluir.value = null;
}
</script>

<template>
  <v-data-table
    :headers="[
      ...props.headers,
      { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
    ]"
    :items="props.items"
    class="elevation-1"
    density="comfortable"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>{{ props.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          variant="elevated"
          class="mr-4"
          color="primary"
          @click="abrirAdicionar"
        >
          Adicionar
        </v-btn>
      </v-toolbar>
    </template>

    <template #item.pagamento="{ item }">
      {{ item.pagamento ? "Sim" : "Não" }}
    </template>

    <template #item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        color="primary"
        variant="text"
        @click="abrirEdicao(item)"
      />
      <v-btn
        icon="mdi-delete"
        color="error"
        variant="text"
        @click="abrirConfirmacaoExclusao(item.id)"
      />
    </template>
  </v-data-table>

  <v-dialog v-model="dialog" max-width="500px">
    <v-card class="py-4">
      <v-card-title>
        {{ editando ? "Editar" : "Adicionar" }}
        {{ props.title.slice(0, -1) }}
      </v-card-title>
      <v-card-text>
        <template v-for="field in props.fields" :key="field.key">
          <v-select
            v-if="field.type === 'select'"
            :label="field.label"
            :items="field.options"
            :item-title="field.optionLabel"
            :item-value="field.optionValue"
            v-model="novoItem[field.key]"
            variant="outlined"
          />
          <v-checkbox
            v-else-if="field.type === 'checkbox'"
            :label="field.label"
            v-model="novoItem[field.key]"
          />

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
        <v-btn variant="elevated" class="px-4" color="primary" @click="salvar">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ConfirmDialog
    v-model="dialogDelete"
    title="Excluir item"
    message="Tem certeza que deseja excluir este item?"
    @confirm="confirmarExclusao"
  />
</template>
