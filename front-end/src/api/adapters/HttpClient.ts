import axios from "axios";
import { JsogService } from "jsog-typescript";
import { useNotificationStore } from "@/stores/Notification";

const jsog = new JsogService();

const httpClient = axios.create({
baseURL: "http://localhost:8080/api",
  timeout: 10000,
  withCredentials: true,
});

const constant = {
  notificationStore: useNotificationStore(),
};

const mensagensErro: Record<number, string> = {
  401: "Email ou senha incorretos!",
  403: "Você não tem permissão para acessar este recurso!",
  404: "O recurso solicitado não foi encontrado.",
};

httpClient.interceptors.response.use(
  (response) => {
    if (
      response.config.method !== "get" &&
      [200, 201, 204].includes(response.status)
    ) {
      constant.notificationStore.notificar({
        mensagem: response.data.message ?? "Operação realizada com sucesso!",
        tipoMensagem: "success",
        visibilidade: true,
      });
    }

    response.data = jsog.deserialize(response.data);
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(new Error(error));
    }

    const codigoErro = error.response.status;
    const mensagem =
      mensagensErro[codigoErro] ??
      error.response.data?.userMessage ??
      "Operação não pode ser realizada!";

    constant.notificationStore.notificar({
      mensagem,
      tipoMensagem: "error",
      visibilidade: true,
    });

    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

export default httpClient;
