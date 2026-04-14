# Documentação Completa do E-commerce SugarBay Market - Padrões e Estrutura

## Índice
1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Backend](#backend)
5. [Frontend](#frontend)
6. [Padrões de Codificação](#padrões-de-codificação)
7. [Fluxo de Autenticação](#fluxo-de-autenticação)
8. [Módulos do Sistema](#módulos-do-sistema)
9. [Implementação de buyer_id e seller_id em Pedidos](#implementação-de-buyer_id-e-seller_id-em-pedidos)
10. [Conclusão](#conclusão)

## Visão Geral do Projeto

O SugarBay Market é um e-commerce marketplace com arquitetura backend-frontend separada, onde o backend fornece uma API REST e o frontend consome essa API. O sistema suporta múltiplos vendedores onde usuários podem criar lojas e vender produtos.

## Estrutura de Pastas

### Backend (`/backend`)
```
backend/
├── src/
│   ├── @types/              # Tipagens TypeScript personalizadas
│   ├── config/              # Configurações do app (upload, cache, auth)
│   ├── modules/             # Módulos do sistema (users, customers, products, orders, reviews)
│   │   ├── customers/       # Gestão de clientes
│   │   │   ├── controllers/ # Controladores (manipulam req/res) - funções index, show, create, update, delete
│   │   │   ├── routes/      # Rotas do módulo com validação usando celebrate/joi
│   │   │   ├── services/    # Lógica de negócio (CreateCustomerService, ListCustomerService, etc.)
│   │   │   └── typeorm/     # Entidades, repositórios e migrations
│   │   ├── orders/          # Gestão de pedidos
│   │   ├── products/        # Gestão de produtos  
│   │   ├── reviews/         # Gestão de avaliações
│   │   └── users/           # Gestão de usuários (autenticação, perfil)
│   ├── shared/              # Recursos compartilhados
│   │   ├── cache/           # Configurações de cache Redis
│   │   ├── errors/          # Classes de tratamento de erros (AppError)
│   │   ├── http/            # Configurações HTTP (server, routes, middlewares)
│   │   │   ├── middlewares/ # Middlewares (isAuthenticated)
│   │   │   └── routes/      # Rotas principais
│   │   └── typeorm/         # Configuração do TypeORM
│   └── @shared/typeorm      # Arquivo principal de configuração TypeORM
```

### Frontend (`/frontend`)
```
frontend/
├── public/                  # Arquivos públicos
├── src/
│   ├── assets/              # Recursos estáticos (imagens, etc.)
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Componentes de UI base (botões, cards, etc.)
│   │   └── checkout/        # Componentes específicos de checkout
│   ├── context/             # Contextos do React (AuthContext, NotificationContext)
│   ├── hooks/               # Hooks personalizados (useCart, useProductFilters, etc.)
│   ├── lib/                 # Funções auxiliares e configurações (api.js para requisições)
│   ├── pages/               # Componentes de páginas (ProductsPage, CheckoutPage, etc.)
│   ├── App.jsx              # Componente principal com roteamento
│   └── main.jsx             # Ponto de entrada com StrictMode e renderização
```

## Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript** 4.7+
- **Express** como framework web
- **TypeORM** 0.2.29 para ORM
- **PostgreSQL** como banco de dados
- **Redis** para cache via ioredis
- **JWT** para autenticação via jsonwebtoken
- **Multer** para upload de arquivos
- **Celebrate** para validação de entrada (wrapper do Joi)
- **BCryptJS** para hash de senhas
- **Cors** para compartilhamento de recursos entre origens
- **DotEnv** para variáveis de ambiente
- **Express-Async-Errors** para tratamento de erros assíncronos
- **Handlebars** para templates
- **IORedis** para conexão com Redis
- **Nodemailer** para envio de emails
- **PG** como driver PostgreSQL
- **Rate-Limiter-Flexible** para controle de рейт
- **Reflect-Metadata** para decorators
- **TypeORM-Pagination** para paginação
- **TS-Node-Dev** para desenvolvimento com hot reload
- **ESLint** e **Prettier** para formatação de código
- **Tsconfig-Paths** para alias de importação

### Frontend
- **React** (v18+) com **JSX**
- **React Router DOM** para navegação
- **Framer Motion** para animações
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones
- **Vite** como bundler
- **Class-Variance-Authority** e **Clsx** para composição de classes
- **Tailwind-Merge** para mesclagem de classes condicionais
- **Use-Toast** para notificações (baseado em Radix UI)
- **React Hook Form** e **Zod** para validação de formulários (implícito pelas dependências)
- **Autoprefixer** e **PostCSS** para processamento de CSS
- **React Hook Form** e **Zod** para validação de formulários (implícito pelas dependências)

## Backend

### Arquitetura de Camadas
1. **Controllers** - Recebem requisições HTTP, extraem dados, invocam services e retornam respostas (geralmente em JSON)
2. **Services** - Contêm a lógica de negócio principal (validações, regras de negócio, manipulação de dados)
3. **Repositories** - Abstraem acesso ao banco de dados, fornecendo métodos personalizados para entidades
4. **Entities** - Modelos de domínio com mapeamento TypeORM e definição de relacionamentos
5. **Routes** - Definem endpoints com middlewares de autenticação e validação de entrada

### Estrutura de Dados e Relacionamentos
- **Usuário (User)** ↔ **Cliente (Customer)**: Relacionamento implícito por email (ambos compartilham o mesmo email para vinculação)
- **Pedido (Order)** ← **Usuário (User)**: Ordem atualmente associada ao usuário autenticado
- **Produto (Product)** ← **Cliente (Customer)**: Proprietário/vendedor do produto
- **Pedido (Order)** ↔ **Produto (Product)**: Via tabela intermediária `orders_products` (many-to-many com preço e quantidade)

### Padrão de Repositories TypeORM
- Cada módulo tem um `NomeEntidadeRepository` que estende `Repository<Entidade>`
- Métodos personalizados para operações específicas (findByName, findById, findAllByIds, etc.)
- Uso de `getCustomRepository` para obtenção de instâncias
- Métodos genéricos para operações comuns (findById, create, save, etc.)
- Repositórios lidam com relações e joins quando necessário para obter dados completos

### Padrão de Services
- Cada operação CRUD tem um service correspondente (CreateUserService, ListUsersService, etc.)
- Interface IRequest define os parâmetros esperados
- Implementação com validação de existência, regras de negócio e persistência
- Uso de RedisCache para invalidação de caches quando necessário
- Services encapsulam toda a lógica de negócio e regras de validação
- Utilizam repositórios para acesso aos dados
- Lançam AppError com mensagens descritivas para tratamento de exceções

### Padrão de Controllers
- Métodos nomeados segundo convenções REST (index, show, create, update, delete)
- Extração de dados da requisição (params, body, user.id do token)
- Instanciação e execução de Services
- Retorno de resposta com `response.json()`
- Conversão de user_id para customer_id quando necessário (via email lookup)
- Tratamento de exceções delegado ao middleware global de tratamento de erros

### Padrão de Rotas
- Definição com validação Celebr8/Joi para entrada (usando Joi do Celebr8)
- Aplicação de middlewares de autenticação (isAuthenticated) onde necessário
- Uso de segmentos (Segments.PARAMS, Segments.BODY) para validação
- Agrupamento por módulos com namespaces (ex: /products, /users, /customers)
- Roteamento centralizado em `/src/shared/http/routes/index.ts`
- Middlewares de validação aplicados via Celebr8 para diferentes segmentos (params, body, headers)

### Padrão de Nomenclatura e Estrutura
- **Services**: Classe com método `execute()` que implementa a lógica de negócio, encapsulando toda regra de negócio
- **Interfaces de Request**: Definem formato esperado na interface `IRequest`, tipando os parâmetros recebidos
- **Repositories**: Estendem `Repository<Entity>` e fornecem métodos personalizados para acesso ao banco
- **Entities**: Anotadas com decoradores TypeORM (`@Entity`, `@Column`, `@ManyToOne`, etc.), representando tabelas
- **Controllers**: Recebem requisições HTTP, invocam services e retornam respostas, seguindo convenção de métodos (index, show, create, update, delete)
- **Rotas**: Utilizam celebrate/Joi para validação de entrada, aplicam middlewares de autenticação onde necessário
- **Métodos de Controller**: Seguem convenções RESTful (index para listagem, show para exibição única, create para criação, update para edição, delete para remoção)

### Exemplo de Estrutura de Módulo
```
├── controllers/
│   └── ModuleController.ts    # Manipula requisições HTTP, invoca services
├── services/
│   ├── CreateModuleService.ts # Lógica de criação de entidade
│   ├── ListModuleService.ts   # Lógica de listagem de entidades  
│   ├── ShowModuleService.ts   # Lógica de visualização de entidade específica
│   ├── UpdateModuleService.ts # Lógica de atualização de entidade
│   └── DeleteModuleService.ts # Lógica de exclusão de entidade
├── routes/
│   └── modules.routes.ts      # Define rotas com path e middlewares, valida entrada com celebrate
└── typeorm/
    ├── entities/
    │   └── Module.ts          # Modelo TypeORM com definição de colunas e relacionamentos
    ├── repositories/
    │   └── ModulesRepository.ts # Métodos personalizados para acesso a dados
    └── migrations/
        └── CreateModule123456.ts # Migração TypeORM para criação/modificação de tabelas
```

## Frontend

### Arquitetura de Componentes
1. **Context Providers** - Gerenciam estado global da aplicação (useAuth, useNotificationContext)
2. **Pages** - Componentes de nível superior para rotas (ProductsPage, CheckoutPage, etc.)
3. **Components** - Componentes reutilizáveis e específicos por domínio (componentes UI, checkout, produtos)
4. **UI Components** - Componentes base de interface (botões, cards, dropdowns - geralmente usando RadixUI)
5. **Hooks** - Lógica compartilhável entre componentes (useCart, useProductFilters, etc.)

### Padrão de Gerenciamento de Estado
- **React Context API** para estados globais (autenticação, notificações, carrinho)
- **React useState/useEffect/useReducer** para estados locais
- **localStorage** para persistência de dados do usuário (token JWT, tema, etc.)
- **React Suspense** com lazy loading para otimização de bundles

### Autenticação
- Armazenamento de JWT no localStorage com chave '@sugarbay:token'
- Interceptors para adição automática de cabeçalhos de autorização nas requisições
- Contexto de autenticação (AuthContext) para gerenciar sessão do usuário e dados do perfil
- Middleware de autenticação (isAuthenticated) protege rotas no backend

## Padrões de Codificação

### Backend
- **TypeScript**: Tipagem rigorosa em todos os arquivos, interfaces para tipagem de parâmetros e retorno
- **ESLint + Prettier**: Padronização de código com regras rigorosas
- **Import aliases**: `@config` para configurações, `@modules` para módulos de domínio, `@shared` para recursos compartilhados
- **Tratamento de erros**: Centralizado com classe `AppError` com código de status HTTP
- **Middlewares**: Autenticação JWT (isAuthenticated), validação celebr8/joi, tratamento de erros assíncronos (express-async-errors)
- **Convenções de nomenclatura**: 
  - Services: `NomeEntidadeService.ts` com método `execute()` 
  - Controllers: `NomeEntidadeController.ts` com métodos `index`, `show`, `create`, `update`, `delete`
  - Entities: `NomeEntidade.ts` com anotações TypeORM
  - Repositories: `NomeEntidadeRepository.ts` extendendo `Repository<NomeEntidade>`
  - Migrations: `DescricaoAcaoTimestamp.ts` com timestamp único
  - Interfaces: Prefixadas com `I` ou nomeadas como `NomeEntidadeRequest/NomeEntidadeResponse`

### Frontend
- **React Hooks**: Preferência por hooks em vez de componentes de classe
- **Componentes funcionais**: Sempre que possível com arrow functions
- **Tipagem opcional**: Embora não seja TypeScript, segue convenções de nomes e props
- **Divisão por domínio**: Componentes organizados por funcionalidade em `/components`
- **Gerenciamento de estado**: 
  - Context API para estados globais (autenticação, notificações, carrinho)
  - useState/useEffect/useReducer para estados locais
  - localStorage para persistência de dados do usuário (tokens, preferências)
- **Estilização**: Tailwind CSS com plugin animate para estilos e animações
- **Componentes UI**: Radix UI para componentes acessíveis e personalizáveis
- **Animações**: Framer Motion para transições e animações complexas
- **Rotas**: React Router DOM com lazy loading e suspense para otimização de bundles
- **Ícones**: Lucide React para ícones consistentes
- **Formatação**: Prettier e ESLint para padronização de código
- **Requisições HTTP**: Funções personalizadas em `/lib/api.js` com interceptores para autorização JWT
- **Hooks Personalizados**: useCart, useProductFilters, useInfiniteScroll, etc. para lógica reutilizável
- **Estrutura de Componentes**: Componentes de UI (`/components/ui`), componentes específicos (`/components/checkout`), componentes genéricos (`/components`)
- **Páginas**: Componentes de nível superior em `/pages` para cada rota principal
- **Integração com Backend**: Requisições HTTP centralizadas em funções em `/lib/api.js` com tratamento de autenticação automático
- **Carregamento Otimizado**: Uso de React.lazy e Suspense para carregamento sob demanda de componentes

## Fluxo de Autenticação

### Backend
1. Usuário faz login via `/sessions` com email e senha
2. Serviço de autenticação (`CreateSessionService`) valida credenciais, compara senha criptografada com bcrypt, e gera JWT usando `jsonwebtoken` e `auth.config.ts`
3. Middleware `isAuthenticated` extrai token do cabeçalho Authorization, verifica e decodifica, injetando `request.user.id`
4. Rotas protegidas tem acesso ao ID do usuário autenticado via `request.user.id`
5. Em módulos que requerem o customer (não só o user), é feito lookup por email para encontrar o customer associado ao usuário

### Frontend
1. Contexto `AuthContext` gerencia estado de autenticação completo (usuário, token, cliente associado)
2. Token JWT é armazenado em `localStorage` com chave `@sugarbay:token`, dados do usuário em `@sugarbay:user`
3. Interceptador em `api.js` automaticamente inclui header `Authorization: Bearer <token>` em requisições
4. Contexto fornece hook `useAuth` para acesso a dados do usuário e métodos de autenticação (signIn, signOut, etc.)
5. O contexto também faz o vínculo entre usuário e cliente através do email (buscando customer com mesmo email que o user)
6. Dados de usuário e cliente são mantidos em localStorage e sincronizados com o estado do contexto

## Módulos do Sistema

### Users
- Registro e autenticação de usuários
- Atualização de perfil e senha
- Upload de avatar
- Recuperação de senha
- Relacionamento com Customer via email (mesmo email associa User a Customer)
- Criptografia de senhas com BCryptJS
- Geração de tokens JWT para autenticação

### Customers
- Associação de usuários a clientes via email
- Perfil público de vendedor (shop_name, rating, bio, location)
- Upload de avatar para cliente
- Informações comerciais do vendedor
- Serviços para criação e atualização de perfis de clientes

### Products
- Criação de produtos por proprietário (Customer via User->email lookup)
- Upload de múltiplas fotos
- Catálogo de produtos com informações detalhadas (categorias, medidas, peso, etc.)
- Filtragem e busca
- Relação ManyToOne com Customer (vendedor/produtor)
- Serviços para todas as operações CRUD (Create, List, Show, Update, Delete)
- Validações para evitar duplicação de nomes de produtos

### Orders
- Criação de pedidos com múltiplos produtos
- Relacionamento com User autenticado (quem compra) via `user_id` atualmente
- Relação com produtos via tabela intermediária OrdersProducts (product_id, quantity, price)
- Atualmente, Order se relaciona com User, mas para o requisito solicitado, deve relacionar com Customer (comprador) e também com Customer (vendedor)
- Implementação atual permite produtos de múltiplos vendedores no mesmo pedido
- Serviço de criação (`CreateOrderService`) faz validações de estoque e atualiza quantidades após a criação
- Tabela de relacionamento `orders_products` armazena preço no momento da compra e quantidade
- O controlador `OrdersController` extrai o `user_id` do token JWT e o associa ao pedido
- O repositório `OrdersRepository` gerencia a persistência dos pedidos com seus produtos
- Serviços para busca e exibição de pedidos individuais

### Reviews
- Avaliações de produtos/clientes
- Sistema de rating (1-5 estrelas)
- Conteúdo textual e sistema de votação (upvotes/downvotes)
- Relacionamento com Product e Customer (quem avalia)
- Entidade `Review` tem campos para rating, conteúdo, upvotes, downvotes, e arrays para respostas e clientes respondidos
- Funcionalidades para criação, listagem e atualização de avaliações

## Implementação de buyer_id e seller_id em Pedidos

### Situação Atual
- Tabela `orders` atualmente se relaciona com `User` via `user_id` (campo herdado da entidade Order)
- Tabela `products` possui `customer_id` (que indica quem vendeu, ou seja, o proprietário do produto)
- Relação: `Order` → `user_id` → `User` → (via email lookup) → `Customer` (comprador)
- Relação: `Order` → `OrdersProducts` → `Product` → `customer_id` (vendedor)
- O processo é: Usuário autenticado cria pedido e associa-se a si mesmo como proprietário do pedido
- A entidade `Order` atualmente tem um `@ManyToOne(() => User)` com join em `user_id`
- A entidade `Product` tem relação `@ManyToOne` com `Customer` via `customer_id` representando o vendedor
- A entidade `OrdersProducts` faz a ligação many-to-many entre Order e Product com preço e quantidade no momento da compra
- O sistema permite atualmente pedidos com produtos de múltiplos vendedores (funcionalidade existente)
- No frontend, a página de checkout envia uma requisição com múltiplos produtos de diferentes vendedores em um único pedido
- O serviço `CreateOrderService` atualmente não distingue vendedores dos produtos no pedido
- Repositório `OrdersRepository` apenas associa o pedido ao usuário autenticado

### Análise da Arquitetura de Relacionamento

#### Backend (Atual)
- **Usuário autenticado**: Quando um pedido é criado, o `user_id` vem do token JWT via middleware `isAuthenticated`
- **Criação do pedido**: No controlador `OrdersController`, o `user_id` do token é encontrado e passado para o serviço `CreateOrderService`
- **Extração do customer**: O serviço obtém o usuário e converte para customer via email lookup (procura customer com mesmo email do usuário)
- **Atribuição de usuário**: O serviço `CreateOrderService` passa o `userExists` para o repositório `OrdersRepository`, que atribui ao campo `user` da entidade `Order`
- **Relação com produtos**: O pedido pode ter múltiplos produtos de diferentes vendedores (não há validação de unicidade de vendedor)
- **Processamento de inventário**: Após criação do pedido, as quantidades dos produtos são atualizadas
- **Relacionamento existente**: `OrdersProducts` conecta `Order` e `Product` armazenando preço e quantidade no momento da compra
- **Fluxo de dados**: User autenticado → Customer via email lookup → Pedido criado com produtos → Atualização de estoque
- **Validações existentes**: O serviço `CreateOrderService` valida estoque disponível, existência de produtos e usuário

#### Frontend
- A página de checkout (`CheckoutPage.jsx`) monta o pedido com base nos itens do carrinho
- A função `handlePlaceOrder` chama a API via `createOrder(orderData)` com o formato `{ products: [{id, quantity}] }`
- O usuário autenticado é verificado antes da criação do pedido
- Componentes de checkout (`CheckoutStepShipping`, `CheckoutStepPayment`, etc.) organizados por etapas
- O carrinho de compras é gerenciado via hook `useCart` e contexto
- Páginas implementadas com React.lazy e Suspense para carregamento otimizado
- Componentes utilizam Tailwind CSS para estilização e Framer Motion para animações

