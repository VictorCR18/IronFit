<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import { PlanoService } from "@/api/services/PlanoService";
import type { Plano, Field } from "@/types/types";
import { z } from "zod";

import { db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

const planoService = new PlanoService();
const planos = ref<Plano[]>([]);
const isLoading = ref(true);

// ---------- Firebase Fallback ----------

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

async function salvarNoFirebase(plano: Plano) {
  try {
    const planosCollection = collection(db, "planos");
    if (plano.id) {
      const planoRef = doc(db, "planos", plano.id.toString());
      await setDoc(planoRef, {
        nome: plano.nome,
        preco: plano.preco,
        descricao: plano.descricao || "",
        timestamp: new Date(),
      });
    } else {
      await addDoc(planosCollection, {
        nome: plano.nome,
        preco: plano.preco,
        descricao: plano.descricao || "",
        timestamp: new Date(),
      });
    }
    console.log("Plano salvo no Firebase com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar plano no Firebase:", error);
  }
}

async function deletarNoFirebase(id: string) {
  try {
    const planoRef = doc(db, "planos", id);
    await deleteDoc(planoRef);
    console.log("Plano deletado no Firebase:", id);
  } catch (error) {
    console.error("Erro ao deletar plano no Firebase:", error);
  }
}

// ---------- Backend / Fallback ----------

async function carregarPlanos() {
  isLoading.value = true;
  try {
    planos.value = await planoService.list();
  } catch (backendError) {
    console.warn("Backend indisponível, buscando planos no Firebase...");
    planos.value = await buscarPlanosFirebase();
  } finally {
    isLoading.value = false;
  }
}

async function salvarPlano(plano: Plano) {
  isLoading.value = true;
  try {
    let planoSalvo: Plano;
    if (plano.id) {
      try {
        planoSalvo = await planoService.update(plano, plano.id);
        const index = planos.value.findIndex((p) => p.id === plano.id);
        if (index !== -1) planos.value[index] = planoSalvo;
      } catch (backendError) {
        console.warn("Backend indisponível, salvando plano no Firebase...");
        await salvarNoFirebase(plano);
        const index = planos.value.findIndex((p) => p.id === plano.id);
        if (index !== -1) planos.value[index] = plano;
      }
    } else {
      try {
        planoSalvo = await planoService.create(plano);
        planos.value.push(planoSalvo);
      } catch (backendError) {
        console.warn("Backend indisponível, salvando plano no Firebase...");
        await salvarNoFirebase(plano);
        planos.value.push(plano);
      }
    }
  } catch (error) {
    console.error("Erro ao salvar plano:", error);
  } finally {
    isLoading.value = false;
  }
}

async function deletarPlano(id: number | string) {
  isLoading.value = true;
  try {
    try {
      await planoService.delete(Number(id));
      planos.value = planos.value.filter((p) => p.id !== Number(id));
    } catch (backendError) {
      console.warn("Backend indisponível, deletando plano no Firebase...");
      await deletarNoFirebase(id.toString());
      planos.value = planos.value.filter((p) => p.id !== id);
    }
  } catch (error) {
    console.error("Erro ao deletar plano:", error);
  } finally {
    isLoading.value = false;
  }
}

const tableFields: Field[] = [
  {
    label: "Nome do Plano",
    key: "nome",
    validation: z
      .string({ required_error: "O nome do plano é obrigatório." })
      .min(1, "O nome deve ter no mínimo 1 caracteres."),
  },
  {
    label: "Preço",
    key: "preco",
    type: "number",
    validation: z.coerce
      .number({
        required_error: "O preço é obrigatório.",
        invalid_type_error: "Digite um preço válido.",
      })
      .positive("O preço deve ser um valor positivo."),
  },
  {
    label: "Descrição",
    key: "descricao",
    validation: z.string().optional(),
  },
];

onMounted(() => {
  carregarPlanos();
});
</script>

<template>
  <CrudTable
    title="Planos"
    :headers="[
      { title: 'Plano', key: 'nome' },
      { title: 'Preço', key: 'preco' },
      { title: 'Descrição', key: 'descricao' },
    ]"
    :items="planos"
    :fields="tableFields"
    :loading="isLoading"
    @save="salvarPlano"
    @delete="deletarPlano"
  />
</template>
