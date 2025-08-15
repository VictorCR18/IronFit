<script lang="ts" setup>
import { ref, onMounted } from "vue";
import CrudTable from "@/components/Administrativo/CrudTable.vue";
import type { Treinador, Field } from "@/types/types";
import { TreinadorService } from "@/api/services/TreinadorService";
import { z } from "zod";

import { db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const treinadorService = new TreinadorService();
const treinadores = ref<Treinador[]>([]);
const isLoading = ref(true); // <-- Loading

// ---------- Firebase fallback ----------

async function buscarTreinadoresFirebase(): Promise<Treinador[]> {
  try {
    const treinadoresCollection = collection(db, "treinadores");
    const snapshot = await getDocs(treinadoresCollection);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        nome: data.nome,
        especialidade: data.especialidade,
      } as unknown as Treinador;
    });
  } catch (error) {
    console.error("Erro ao buscar treinadores no Firebase:", error);
    return [];
  }
}

async function salvarNoFirebase(treinador: Treinador) {
  try {
    if (treinador.id) {
      const treinadorRef = doc(db, "treinadores", treinador.id.toString());
      await setDoc(treinadorRef, {
        nome: treinador.nome,
        especialidade: treinador.especialidade,
        timestamp: new Date(),
      });
    } else {
      const treinadoresCollection = collection(db, "treinadores");
      await addDoc(treinadoresCollection, {
        nome: treinador.nome,
        especialidade: treinador.especialidade,
        timestamp: new Date(),
      });
    }
    console.log("Treinador salvo no Firebase com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar treinador no Firebase:", error);
  }
}

async function deletarNoFirebase(id: string) {
  try {
    const treinadorRef = doc(db, "treinadores", id);
    await deleteDoc(treinadorRef);
    console.log("Treinador deletado no Firebase:", id);
  } catch (error) {
    console.error("Erro ao deletar treinador no Firebase:", error);
  }
}

// ---------- Backend / Fallback ----------

async function buscarTreinadores() {
  isLoading.value = true;
  try {
    treinadores.value = await treinadorService.list();
  } catch (backendError) {
    console.warn("Backend indisponível, buscando treinadores no Firebase...");
    treinadores.value = await buscarTreinadoresFirebase();
  } finally {
    isLoading.value = false;
  }
}

async function salvarTreinador(item: Treinador) {
  isLoading.value = true;
  try {
    if (item.id) {
      try {
        const treinadorSalvo = await treinadorService.update(item, item.id);
        const idx = treinadores.value.findIndex((t) => t.id === item.id);
        if (idx !== -1) treinadores.value[idx] = treinadorSalvo;
      } catch (backendError) {
        console.warn("Backend indisponível, salvando treinador no Firebase...");
        await salvarNoFirebase(item);
        const idx = treinadores.value.findIndex((t) => t.id === item.id);
        if (idx !== -1) treinadores.value[idx] = item;
      }
    } else {
      try {
        const treinadorSalvo = await treinadorService.create(item);
        treinadores.value.push(treinadorSalvo);
      } catch (backendError) {
        console.warn("Backend indisponível, salvando treinador no Firebase...");
        await salvarNoFirebase(item);
        treinadores.value.push(item);
      }
    }
  } catch (error) {
    console.error("Erro ao salvar treinador:", error);
  } finally {
    isLoading.value = false;
  }
}

async function deletarTreinador(id: number | string) {
  isLoading.value = true;
  try {
    try {
      await treinadorService.delete(Number(id));
      treinadores.value = treinadores.value.filter((t) => t.id !== Number(id));
    } catch (backendError) {
      console.warn("Backend indisponível, deletando treinador no Firebase...");
      await deletarNoFirebase(id.toString());
      treinadores.value = treinadores.value.filter((t) => t.id !== id);
    }
  } catch (error) {
    console.error("Erro ao deletar treinador:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await buscarTreinadores();
});

const tableFields: Field[] = [
  {
    label: "Nome",
    key: "nome",
    validation: z.string({ required_error: "O nome é obrigatório." }).min(1),
  },
  {
    label: "Especialidade",
    key: "especialidade",
    validation: z
      .string({ required_error: "A especialidade é obrigatória." })
      .min(1),
  },
];
</script>

<template>
  <CrudTable
    title="Treinadores"
    :headers="[
      { title: 'Nome', key: 'nome' },
      { title: 'Especialidade', key: 'especialidade' },
    ]"
    :items="treinadores"
    :fields="tableFields"
    :loading="isLoading"
    @save="salvarTreinador"
    @delete="deletarTreinador"
  />
</template>
