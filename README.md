## Sobre o SMPM 

Imagina uma fábrica cheia de máquinas, cada uma com seu humor:  
tem a máquina que sempre quebra, a que só funciona na base da reza e a que é certinha, mas vive esquecida.  

O **SMPM – Sistema de Manutenção Preventiva de Máquinas** entra como o
"central de comando" dessa galera: ele organiza as manutenções, lembra os horários,
mostra o que está atrasado e quem já foi cuidado. 

Em vez de planilha perdida ou papel colado na máquina, tudo vira uma interface única,
bonita e com cara de aplicativo moderno.

---

### O que o código consegue fazer

- 🧾 **Cadastro de máquinas**  
  O sistema guarda quais máquinas existem, em que setor estão e vira a “lista oficial” da fábrica.

- 🛠️ **Registro de manutenções**  
  Dá pra criar, editar e excluir manutenções:
  - título
  - máquina
  - data e hora (com bloqueio pra não marcar no passado)
  - descrição
  - status (programada, realizada, manutenção).

- 📋 **Lista filtrável de manutenções**  
  A tela principal mostra uma tabela com:
  - filtro por texto (busca),
  - filtro por status,
  - ações de **Ver** e **Excluir** para cada linha.

- 📊 **Dashboard com indicadores**  
  No topo, o código calcula:
  - quantas máquinas existem,
  - quantas manutenções estão programadas,
  - quantas já foram realizadas.  
  E ainda desenha um **gráfico de barras** mostrando o total por status.

- 📅 **Calendário de manutenções**  
  Um calendário estilo agenda:
  - cada manutenção vira um evento colorido,
  - cores diferentes pra cada status,
  - atualização automática a cada poucos segundos pra sempre refletir o que está no banco.

- 🌗 **Tema claro/escuro**  
  Um botão alterna entre “modo dia” e “modo noite”, trocando o visual do site inteiro.

- 🔐 **Login com perfis**  
  - Usuário comum entra com e‑mail (focado em Gmail).
  - Admin tem acesso à área de administração.
  - O backend usa token (JWT) pra saber quem é quem.

- 🧑‍✈️ **Painel do administrador**  
  - Cadastra novos usuários (admin ou usuário comum),
  - lista todo mundo,
  - permite excluir perfis,
  - todas as ações já salvando e atualizando direto do banco.

- 🔄 **Auto‑refresh de dados**  
  Tanto a lista de manutenções quanto o calendário são recarregados periodicamente,
  como se o sistema estivesse “sempre de olho” nas mudanças.

---

### Como esse código é construído por dentro

Por trás da interface bonitinha, o projeto junta algumas tecnologias que trabalham em equipe:

- **Vue 3** – o cérebro dos componentes e das telas, responsável por deixar tudo reativo.  
- **Vue Router** – cuida das rotas (`/login`, `/dashboard`, `/maintenances`, `/calendar`, `/admin`).  
- **Pinia** – guarda os dados globais (máquinas, manutenções, KPIs) e alimenta o dashboard.  
- **Tailwind CSS** – ajuda a deixar o layout com cara de app moderno, com cards, sombras e responsividade.  
- **Axios** – faz a ponte entre o frontend e o backend, chamando a API REST.  
- **FullCalendar** – transforma as manutenções em eventos de calendário.  
- **Node.js + Express + SQLite** – o trio do backend:
  - recebe as requisições,
  - valida as regras (como “não agendar no passado”),
  - salva tudo em um banco SQLite.  
- **JWT e middleware de auth** – garantem que só quem estiver logado consegue mexer nos dados,
  e que apenas admins acessam a tela de administração.

---

### Referências e inspirações

Se alguém quiser se aprofundar nas tecnologias que inspiraram esse código, aqui vão as principais:

- Documentação oficial do **Vue.js 3**
- Documentação do **Vue Router**
- Documentação do **Pinia**
- Documentação do **Tailwind CSS**
- Documentação do **Axios**
- Documentação do **FullCalendar**
- Documentação do **Node.js**, **Express** e **SQLite**
- Guia oficial do **Scrum** (metodologia usada na proposta do projeto)

