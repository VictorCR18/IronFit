<script lang="ts" setup>
import type { Props } from "@/types/types";
import ConfirmDialog from "@/components/Administrativo/ConfirmDialog.vue";
import { ref, computed } from "vue";
import { z, ZodError } from "zod";

const props = withDefaults(
  defineProps<
    Props & {
      loading?: boolean;
    }
  >(),
  {
    loading: false,
  }
);

const emit = defineEmits<{
  (e: "save", item: any): void;
  (e: "delete", id: number): void;
}>();

const dialog = ref(false);
const editando = ref(false);
const dialogDelete = ref(false);
const idParaExcluir = ref<number | null>(null);
let itemOriginalId: any = null;

const search = ref("");

const formState = ref<Record<string, any>>({});
const formErrors = ref<Record<string, string[] | undefined>>({});

const formSchema = computed(() => {
  const shape: Record<string, z.ZodTypeAny> = {};
  props.fields.forEach((field) => {
    if (field.validation) {
      shape[field.key] = field.validation;
    }
  });
  return z.object(shape);
});

function onFormSubmit() {
  try {
    formSchema.value.parse(formState.value);

    formErrors.value = {};
    const itemParaSalvar = editando.value
      ? { ...formState.value, id: itemOriginalId }
      : formState.value;

    emit("save", itemParaSalvar);
    dialog.value = false;
  } catch (error) {
    if (error instanceof ZodError) {
      formErrors.value = error.flatten().fieldErrors;
    }
  }
}

function abrirEdicao(item: any) {
  editando.value = true;
  itemOriginalId = item.id;
  formErrors.value = {};

  const initialValues: Record<string, any> = { ...item };
  if (typeof item.plano === "object" && item.plano !== null) {
    initialValues.plano = item.plano.id;
  }
  formState.value = initialValues;
  dialog.value = true;
}

function abrirAdicionar() {
  editando.value = false;
  itemOriginalId = null;
  formErrors.value = {};

  const initialState: Record<string, any> = {};
  props.fields.forEach((field) => {
    if (field.type === "checkbox") {
      initialState[field.key] = false;
    } else if (field.type === "select") {
      initialState[field.key] = null;
    } else {
      initialState[field.key] = "";
    }
  });
  formState.value = initialState;
  dialog.value = true;
}

function fecharDialog() {
  dialog.value = false;
}

function abrirConfirmacaoExclusao(id: number) {
  idParaExcluir.value = id;
  dialogDelete.value = true;
}

function confirmarExclusao() {
  if (idParaExcluir.value != null) {
    emit("delete", idParaExcluir.value);
  }
  dialogDelete.value = false;
}
</script>

<template>
  <v-data-table
    :headers="[
      ...props.headers,
      { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
    ]"
    :items="props.items"
    :loading="props.loading"
    :search="search"
    class="elevation-1"
    density="comfortable"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>{{ props.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mr-4"
        />

        <v-btn
          variant="elevated"
          class="mr-4"
          color="primary"
          :disabled="props.loading"
          @click="abrirAdicionar"
        >
          Adicionar
        </v-btn>
      </v-toolbar>
    </template>

    <template #[`item.pagamento`]="{ item }">
      <v-chip :color="item.pagamento ? 'green' : 'red'" size="small">
        {{ item.pagamento ? "Sim" : "Não" }}
      </v-chip>
    </template>

    <template #[`item.actions`]="{ item }">
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

  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-form @submit.prevent="onFormSubmit">
      <v-card class="py-4">
        <v-card-title>
          <span class="text-h5">
            {{ editando ? "Editar" : "Adicionar" }}
            {{ props.title.slice(0, -1) }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <template v-for="field in props.fields" :key="field.key">
                <v-col cols="12">
                  <v-select
                    v-if="field.type === 'select'"
                    :label="field.label"
                    :items="field.options"
                    :item-title="field.optionLabel"
                    :item-value="field.optionValue"
                    v-model="formState[field.key]"
                    :error-messages="formErrors[field.key]"
                    variant="outlined"
                  />
                  <v-checkbox
                    v-else-if="field.type === 'checkbox'"
                    :label="field.label"
                    v-model="formState[field.key]"
                    :error-messages="formErrors[field.key]"
                  />
                  <v-text-field
                    v-else
                    :label="field.label"
                    :type="field.type || 'text'"
                    v-model="formState[field.key]"
                    :error-messages="formErrors[field.key]"
                    variant="outlined"
                    @update:modelValue="
                      (val) =>
                        (formState[field.key] = field.formatter
                          ? field.formatter(val)
                          : val)
                    "
                  />
                </v-col>
              </template>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-spacer></v-spacer>
          <v-btn text @click="fecharDialog">Cancelar</v-btn>
          <v-btn variant="elevated" class="px-4" color="primary" type="submit">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <ConfirmDialog
    v-model="dialogDelete"
    title="Excluir item"
    message="Tem certeza que deseja excluir este item?"
    @confirm="confirmarExclusao"
  />
</template>
