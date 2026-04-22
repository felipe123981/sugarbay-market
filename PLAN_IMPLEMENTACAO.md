# Plano de Implementação - ListOrderService

## Contexto
Criar funcionalidade para listar pedidos com duas rotas:
1. `/profile/orders` - Usuário logado vê seus próprios pedidos
2. `/admin` (comentada) - Lista todas as ordens da plataforma (uso administrativo)

## Estado Atual

### Backend - Módulo Orders
- **OrdersController.ts**: Já possui método `index` que lista pedidos do usuário logado
- **ListOrderService.ts**: Já existe, recebe `customer_id` e busca pedidos
- **OrdersRepository.ts**: Possui método `findAllByCustomerId(customerId)`
- **orders.routes.ts**: 
  - Rota `/profile/orders` já existe e aponta para `ordersController.index`
  - Rota `/admin` já está comentada no código

### Entidades
- **Order.ts**: Entidade com `buyer_id`, `seller_ids`, `order_products`, `total`, `status`
- **OrdersProducts.ts**: Tabela intermediária com `price`, `final_price`, `quantity`, `seller_id`, `buyer_id`

## Implementação Necessária

### 1. ListOrderService (atualizar)
**Arquivo**: `backend/src/modules/orders/services/ListOrderService.ts`

Manter estrutura atual que já:
- Recebe `customer_id` na interface `IRequest`
- Usa `OrdersRepository.findAllByCustomerId()`
- Retorna `Order[]` ordenado por `created_at DESC`

### 2. OrdersController (atualizar)
**Arquivo**: `backend/src/modules/orders/controllers/OrdersController.ts`

Métodos necessários:
- `index()` - Já existe, lista pedidos do usuário logado via `customer_id`
- `listAll()` - Novo método para listar TODOS os pedidos (admin), usar com middleware `ensureAdmin`

### 3. Orders Routes (atualizar)
**Arquivo**: `backend/src/modules/orders/routes/orders.routes.ts`

Rotas:
- `GET /profile/orders` - Já existe ✅
- `GET /admin` - Manter comentada até ter middleware `ensureAdmin`

### 4. Frontend (implementar)
**Arquivos necessários**:
- `frontend/src/pages/OrdersPage.jsx` ou `frontend/src/pages/MyOrdersPage.jsx` - Página principal de pedidos
- `frontend/src/pages/OrderDetailPage.jsx` ou `frontend/src/pages/SellerOrderDetailPage.jsx` - Detalhes do pedido
- `frontend/src/lib/api.js` - Adicionar funções `getProfileOrders()` e `getOrderDetail()`

**Rotas frontend**:
- `http://localhost/dashboard?tab=orders` - Lista de pedidos do usuário
- `http://localhost/dashboard/order/:orderId` - Detalhes do pedido

## Fluxo de Dados

```
Frontend (Dashboard Orders Tab)
    ↓
GET /api/orders/profile/orders (com JWT)
    ↓
OrdersController.index()
    ↓ (extrai user.id do token)
    ↓ (busca customer por email lookup)
ListOrderService.execute({ customer_id })
    ↓
OrdersRepository.findAllByCustomerId(customer_id)
    ↓
Retorna Order[] com order_products, buyer, shipping_address
    ↓
Frontend renderiza lista de pedidos
```

## Critérios de Aceite

- [ ] Usuário logado vê apenas seus próprios pedidos em `/profile/orders`
- [ ] Pedidos exibem: ID, data, total, status, produtos, endereço de entrega
- [ ] Rota `/admin` permanece comentada até implementação de controle de admin
- [ ] Frontend em `dashboard?tab=orders` consome a API corretamente
- [ ] Clique em "View Details" navega para página de detalhes do pedido

## Observações

1. O `ListOrderService` já existe e está funcional
2. A rota `/profile/orders` já está configurada
3. Foco principal: garantir que o frontend consuma corretamente a API existente
4. Verificar se `OrdersRepository.findAllByCustomerId` inclui relações necessárias (`order_products`, `shipping_address`)
