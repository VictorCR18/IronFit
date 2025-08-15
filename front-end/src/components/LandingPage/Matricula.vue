<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { AlunoService } from "@/api/services/AlunoService";
import { PlanoService } from "@/api/services/PlanoService";
import type { Aluno, Plano } from "@/types/types";

import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useFormatters } from "@/utils/useFormatters";

import { db } from "@/firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const { formatTelefone, unformat } = useFormatters();

const alunoService = new AlunoService();
const planoService = new PlanoService();

const alunos = ref<Aluno[]>([]);
const planos = ref<Plano[]>([]);

const matriculaSchema = z.object({
  nome: z
    .string({ required_error: "Campo obrigatório." })
    .nonempty("Campo obrigatório"),
  email: z
    .string({ required_error: "Campo obrigatório." })
    .nonempty("Campo obrigatório")
    .email("Digite um e-mail válido"),
  contato: z
    .string({ required_error: "Campo obrigatório." })
    .nonempty("Campo obrigatório")
    .min(9, "Digite um contato válido"),
  plano: z
    .string({ required_error: "Campo obrigatório." })
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

// Buscar planos do Firebase se backend não funcionar
async function buscarPlanosFirebase(): Promise<Plano[]> {
  try {
    const planosCollection = collection(db, "planos");
    const snapshot = await getDocs(planosCollection);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: undefined,
        nome: data.nome,
        preco: data.preco,
        descricao: data.descricao || "",
      } as unknown as Plano;
    });
  } catch (error) {
    console.error("Erro ao buscar planos no Firebase:", error);
    return [];
  }
}

async function buscarPlanos() {
  try {
    // Tenta buscar do backend
    planos.value = await planoService.list();
  } catch (backendError) {
    console.warn("Backend indisponível, buscando planos no Firebase...");
    planos.value = await buscarPlanosFirebase();
  }
}

// Salvar no Firebase
async function salvarNoFirebase(aluno: Aluno) {
  try {
    const alunosCollection = collection(db, "alunos");
    await addDoc(alunosCollection, {
      nome: aluno.nome,
      email: aluno.email,
      contato: aluno.contato,
      plano:
        typeof aluno.plano === "object" && aluno.plano !== null
          ? aluno.plano.nome
          : aluno.plano,
      createdAt: new Date(),
    });
    console.log("Aluno salvo no Firebase com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar aluno no Firebase:", error);
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

    let alunoSalvo: Aluno;

    // Tenta salvar no backend
    try {
      alunoSalvo = await alunoService.create(payload);
      alunos.value.push(alunoSalvo);
    } catch (backendError) {
      console.warn("Backend indisponível, salvando apenas no Firebase...");
      alunoSalvo = payload;
      alunos.value.push(alunoSalvo);
    }

    // Salvar no Firebase
    await salvarNoFirebase(alunoSalvo);

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
        <v-card-title class="text-h5 font-weight-bold px-0 mx-0"
          >Matricule-se</v-card-title
        >
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
            @input="contato = formatTelefone(unformat(contato))"
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
