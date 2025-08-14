<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { AlunoService } from "@/api/services/AlunoService";
import { PlanoService } from "@/api/services/PlanoService";
import type { Aluno, Plano } from "@/types/types";

import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const alunoService = new AlunoService();
const planoService = new PlanoService();

const alunos = ref<Aluno[]>([]);
const planos = ref<Plano[]>([]);

const matriculaSchema = z.object({
  nome: z
    .string({
      required_error: "Campo obrigatório.",
    })
    .nonempty("Campo obrigatório")
    .min(1, "Campo obrigatório"),
  email: z
    .string({
      required_error: "Campo obrigatório.",
    })
    .nonempty("Campo obrigatório")
    .email("Digite um e-mail válido"),
  contato: z
    .string({
      required_error: "Campo obrigatório.",
    })
    .nonempty("Campo obrigatório")
    .min(9, "Digite um contato válido"),
  plano: z
    .string({
      required_error: "Campo obrigatório.",
    })
    .nonempty("Selecione um plano"),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(matriculaSchema),
});

const { value: nome, errorMessage: nomeError } = useField<string>("nome", {
  initialValue: "",
});
const { value: email, errorMessage: emailError } = useField<string>("email", {
  initialValue: "",
});
const { value: contato, errorMessage: contatoError } = useField<string>(
  "contato",
  { initialValue: "" }
);
const { value: plano, errorMessage: planoError } = useField<string>("plano", {
  initialValue: "",
});

async function buscarPlanos() {
  try {
    planos.value = await planoService.list();
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const planoSelecionado = planos.value.find((p) => p.nome === values.plano);
    if (!planoSelecionado) throw new Error("Plano selecionado não encontrado.");

    const payload: Aluno = {
      id: undefined,
      nome: values.nome,
      email: values.email,
      contato: values.contato,
      plano: planoSelecionado,
    };

    const alunoSalvo = await alunoService.create(payload);
    alunos.value.push(alunoSalvo);
    resetForm();
    alert("Matrícula realizada com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar aluno:", error);
  }
});

onMounted(() => {
  buscarPlanos();
});
</script>

<template>
  <v-card class="mt-13 pa-6">
    <v-row id="matricular">
      <v-col cols="12" md="6">
        <v-card-title class="text-h5 font-weight-bold px-0 mx-0">
          Matricule-se
        </v-card-title>
        <v-card-subtitle class="pa-0 ma-0 mb-4">
          Preencha o formulário abaixo para iniciar sua jornada fitness.
        </v-card-subtitle>

        <v-form @submit.prevent="onSubmit">
          <v-text-field
            label="Nome"
            v-model="nome"
            :error-messages="nomeError"
          />

          <v-text-field
            label="Email"
            v-model="email"
            :error-messages="emailError"
            type="email"
          />

          <v-text-field
            label="Telefone/WhatsApp"
            v-model="contato"
            :error-messages="contatoError"
          />

          <v-select
            :items="planos.map((p) => p.nome)"
            label="Plano"
            v-model="plano"
            :error-messages="planoError"
          />

          <v-btn color="primary" type="submit">Enviar inscrição</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>
