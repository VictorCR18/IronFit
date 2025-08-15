<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import { AlunoService } from "@/api/services/AlunoService";
import { PlanoService } from "@/api/services/PlanoService";
import type { Aluno, Plano, Field } from "@/types/types";
import { z } from "zod";
import { useFormatters } from "@/utils/useFormatters";

import { db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const { formatTelefone } = useFormatters();

const isLoading = ref(true);

const alunoService = new AlunoService();
const planoService = new PlanoService();

const alunos = ref<Aluno[]>([]);
const planos = ref<Plano[]>([]);
const tableHeaders = [
  { title: "Nome", key: "nome" },
  { title: "E-mail", key: "email" },
  { title: "Contato", key: "contato" },
  { title: "Plano", key: "plano.nome" },
  { title: "Pagamento", key: "pagamento", align: "center" },
];
const tableFields = ref<Field[]>([]);

// ---------- Firebase Fallback ----------

async function buscarAlunosFirebase(): Promise<Aluno[]> {
  try {
    const alunosCollection = collection(db, "alunos");
    const snapshot = await getDocs(alunosCollection);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        nome: data.nome,
        email: data.email,
        contato: data.contato,
        plano: { id: null, nome: data.plano } as unknown as Plano,
        pagamento: false,
      } as unknown as Aluno;
    });
  } catch (error) {
    console.error("Erro ao buscar alunos no Firebase:", error);
    return [];
  }
}

async function buscarPlanosFirebase(): Promise<Plano[]> {
  try {
    const planosCollection = collection(db, "planos");
    const snapshot = await getDocs(planosCollection);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
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

async function salvarNoFirebase(aluno: Aluno) {
  try {
    if (aluno.id) {
      const alunoRef = doc(db, "alunos", aluno.id.toString());
      await setDoc(alunoRef, {
        nome: aluno.nome,
        email: aluno.email,
        contato: aluno.contato,
        plano:
          typeof aluno.plano === "object" && aluno.plano !== null
            ? aluno.plano.nome
            : aluno.plano,
        pagamento: aluno.pagamento || false,
        timestamp: new Date(),
      });
    } else {
      const alunosCollection = collection(db, "alunos");
      await addDoc(alunosCollection, {
        nome: aluno.nome,
        email: aluno.email,
        contato: aluno.contato,
        plano:
          typeof aluno.plano === "object" && aluno.plano !== null
            ? aluno.plano.nome
            : aluno.plano,
        pagamento: aluno.pagamento || false,
        timestamp: new Date(),
      });
    }
    console.log("Aluno salvo no Firebase com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar aluno no Firebase:", error);
  }
}

async function deletarNoFirebase(id: string) {
  try {
    const alunoRef = doc(db, "alunos", id);
    await deleteDoc(alunoRef);
    console.log("Aluno deletado no Firebase:", id);
  } catch (error) {
    console.error("Erro ao deletar aluno no Firebase:", error);
  }
}

// ---------- Backend / Fallback ----------

async function buscarAlunos() {
  try {
    alunos.value = await alunoService.list();
  } catch (backendError) {
    console.warn("Backend indisponível, buscando alunos no Firebase...");
    alunos.value = await buscarAlunosFirebase();
  }
}

async function buscarPlanos() {
  try {
    planos.value = await planoService.list();
  } catch (backendError) {
    console.warn("Backend indisponível, buscando planos no Firebase...");
    planos.value = await buscarPlanosFirebase();
  }
}

async function salvarAluno(item: any) {
  isLoading.value = true;
  try {
    const planoCompleto = planos.value.find((p) => p.id === item.plano) || {
      nome: item.plano,
    };
    const payload: Aluno = { ...item, plano: planoCompleto };

    if (item.id) {
      try {
        const alunoSalvo = await alunoService.update(payload, item.id);
        const idx = alunos.value.findIndex((a) => a.id === item.id);
        if (idx !== -1) alunos.value[idx] = alunoSalvo;
      } catch (backendError) {
        console.warn("Backend indisponível, salvando aluno no Firebase...");
        await salvarNoFirebase(payload);
        const idx = alunos.value.findIndex((a) => a.id === item.id);
        if (idx !== -1) alunos.value[idx] = payload;
      }
    } else {
      try {
        const alunoSalvo = await alunoService.create(payload);
        alunos.value.push(alunoSalvo);
      } catch (backendError) {
        console.warn("Backend indisponível, salvando aluno no Firebase...");
        await salvarNoFirebase(payload);
        alunos.value.push(payload);
      }
    }
  } catch (error) {
    console.error("Erro ao salvar aluno:", error);
  } finally {
    isLoading.value = false;
  }
}

async function deletarAluno(id: number | string) {
  isLoading.value = true;
  try {
    try {
      await alunoService.delete(Number(id));
      alunos.value = alunos.value.filter((a) => a.id !== Number(id));
    } catch (backendError) {
      console.warn("Backend indisponível, deletando aluno no Firebase...");
      await deletarNoFirebase(id.toString());
      alunos.value = alunos.value.filter((a) => a.id !== id);
    }
  } catch (error) {
    console.error("Erro ao deletar aluno:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await buscarPlanos();

    tableFields.value = [
      {
        key: "nome",
        label: "Nome Completo",
        validation: z
          .string({ required_error: "O nome é obrigatório." })
          .min(1),
      },
      {
        key: "email",
        label: "E-mail",
        type: "text",
        validation: z
          .string({ required_error: "O e-mail é obrigatório." })
          .email(),
      },
      {
        key: "contato",
        label: "Contato (Telefone/WhatsApp)",
        formatter: formatTelefone,
        validation: z
          .string({ required_error: "O contato é obrigatório." })
          .min(10),
      },
      {
        key: "plano",
        label: "Plano",
        type: "select",
        options: planos.value.map((p) => ({
          id: p.id ?? p.nome, 
          nome: p.nome,
        })),
        optionLabel: "nome",
        optionValue: "id",
        validation: z
          .union([z.number(), z.string()])
          .refine((val) => val !== null && val !== undefined, {
            message: "Selecione um plano.",
          }),
      },
      {
        key: "pagamento",
        label: "Pagamento em dia",
        type: "checkbox",
      },
    ];

    await buscarAlunos();
  } catch (error) {
    console.error("Erro na montagem do componente:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <CrudTable
    title="Alunos"
    :headers="tableHeaders"
    :items="alunos"
    :fields="tableFields"
    :loading="isLoading"
    @save="salvarAluno"
    @delete="deletarAluno"
  />
</template>
