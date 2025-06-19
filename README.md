# 📚 CatALog  - Sistema de Gerenciamento de Biblioteca - Repositório Frontend

A interface foi projetada para ser moderna, intuitiva e responsiva, permitindo que os usuários acessem facilmente funcionalidades como empréstimos e devoluções de livros, anotações por página, avaliações e uma estante virtual personalizada com categorias como Favoritos, Desejados e Emprestados.
Este projeto foi proposto em aula como exercício prático para consolidar os conhecimentos adquiridos durante o semestre, especialmente no uso de Java com Spring Boot, além de reforçar a prática de persistência e consultas com JDBC e integração com APIs RESTful.
Claro! Aqui está uma sugestão de trecho chamativo para colocar no `README.md` do **frontend**, com destaque visual e link direto para o repositório do **backend**:

<br>

## 🧠 Integração com Backend

Este projeto se conecta diretamente ao backend construído com **Spring Boot + MySQL**, responsável por gerenciar toda a lógica de negócio, autenticação, persistência de dados e regras de empréstimo.

> 🔗 **Confira o repositório do backend aqui:**
> 👉 [📦 CatALog - Backend (Spring Boot)](https://github.com/lariiscriis/CatAlog_backEnd)

<br>

## 📡 Integração com API do Google Books

O sistema consome dados diretamente da **API do Google Books**, permitindo aos usuários buscar livros usando palavras-chave como título, autor ou ISBN.
As informações retornadas (como título, capa, autor, categoria e descrição) são **salvas no banco de dados via backend** em Spring Boot, garantindo performance nas consultas futuras e evitando requisições repetidas à API.
Essa funcionalidade amplia o catálogo da biblioteca com facilidade, aproveitando uma base de dados rica e constantemente atualizada.

<br>

## 🌐 Funcionalidades

- 🏠 Página inicial com destaques e navegação intuitiva
- 🔍 Busca de livros
- 📖 Visualização de detalhes do livro
- 🧾 Anotações por página e avaliações
- 📚 Estante do usuário:
  - Marcar livros como **Favorito**, **Desejado** ou **Emprestado**
- 📆 Empréstimos:
  - Realizar empréstimo
  - Devolver livros (com ou sem multa)
  - Modal de confirmação
- 🔔 Modais e mensagens de feedback com `ngx-toastr`

- 👤 **Perfil de Usuário**
  - Visualizar histórico, livros lidos e anotações
  - Upload de imagem de perfil

- 📊 **Dashboard administrativa**
  - Controles de livros
  - Controle de emprestimo
    
<br>

## 🔮 Funcionalidades Futuras

### 🔔 Sistema de notificações:

- Devolução próxima

- Livro desejado disponível

- Multa pendente

- Confirmação de devolução

### 📩 Envio de email para alertas

### 📊 Dashboard para admins com gráficos e estatísticas

<br>

## 🔧 Tecnologias Utilizadas

- **Angular 17+**
- **Angular Material** e componentes customizados
- **RxJS** para reatividade
- **SCSS** para estilos modulares
- **ngx-toastr** para notificações
- Integração com backend REST em Spring Boot


<br>
## ▶️ Como Rodar o Projeto

Siga os passos abaixo para rodar o frontend localmente:

### 🔧 Pré-requisitos

* Node.js (versão 18+ recomendada)
* Angular CLI instalado globalmente:

  ```bash
  npm install -g @angular/cli
  ```

### 🚀 Passo a passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/lariiscriis/CatAlog_frontEnd.git

   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   ng serve
   ```

4. Acesse a aplicação:

   ```
   http://localhost:4200
   ```
<br>

> 💡 **Importante:** certifique-se de que o backend (*Spring Boot*) esteja rodando em `http://localhost:8080` ou altere a URL nas configurações de serviços Angular se necessário.

