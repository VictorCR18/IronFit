# IronFit

Uma **Landing Page** para uma **academia fictícia**, com área administrativa, criada com **Vue + TypeScript**, estilizada com **SCSS**, e integração com **backend** em Spring Boot. O projeto está atualmente em deploy no [Vercel](https://iron-fit.vercel.app) para a parte frontend.

## Tecnologias

* **Vue 3** — framework JavaScript para interfaces ricas
* **TypeScript** — tipagem estática para JavaScript
* **SCSS** — pré-processador de CSS para estilos avançados
* **HTML** e **JavaScript** — usadas em menor proporção
* **Vue Router** — navegação SPA, incluindo `/administrativo`
* **Axios** — consumo de API para comunicação com o backend
* **Spring Boot** — backend em Java para gerenciamento de dados
* **PostgreSQL** — banco de dados relacional
* **Firebase** — autenticação de usuários e armazenamento de arquivos
* **Zod** — validação de formulários e dados de forma tipada
* **Vercel** — hospedagem do frontend

## Funcionalidades

* Landing Page com informações da academia
* Área administrativa em `/administrativo` para gerenciar planos, alunos e pagamentos
* Integração com backend Spring Boot para persistência de dados
* Integração com **Firebase** para autenticação e upload de arquivos
* Validação de formulários e dados com **Zod**, garantindo consistência e segurança
* Design responsivo e moderno

## Instalação e execução local (Frontend)

```bash
# 1. Clone o repositório
git clone https://github.com/VictorCR18/IronFit.git

# 2. Acesse a pasta
cd IronFit

# 3. Instale as dependências
npm install
# ou
yarn install

# 4. Rode o servidor de desenvolvimento
npm run dev
```

## Observações

* Para testes locais com Firebase, configure seu arquivo `.env` com as credenciais do projeto Firebase.
* O backend em Spring Boot deve estar rodando para que a área administrativa funcione corretamente.
* Todos os formulários utilizam **Zod** para validação reativa antes de enviar os dados para o backend ou Firebase.

---
