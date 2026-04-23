# Plano de Implementação: ListOrderService e Rotas de Orders

## Contexto

Implementar funcionalidade de listagem de orders no backend. O usuário autenticado deve poder visualizar suas próprias orders através de `GET /profile/orders`, e deve existir uma rota administrativa (comentada) para listar todas as orders da plataforma.

## Requisitos

### Backend

1. **ListOrderService** - Serviço que lista orders de um customer
2. **Rota `/profile/orders`** - Lista orders do usuário logado (via customer_id)
3. **Rota `/admin` (comentada)** - Lista TODAS as orders da plataforma

### Frontend

1. **Dashboard Orders** - `http://localhost/dashboard?tab=orders` exibe orders do usuário
2. **Order Details** - `http://localhost/dashboard/order/:id` exibe detalhes de uma order específica

---

## Implementação Backend

### 1. ListOrderService (`backend/src/modules/orders/services/ListOrderService.ts`)

Já existe. Verificar implementação:

```typescript
interface IRequest {
  customer_id: string;
}

public async execute({ customer_id }: IRequest): Promise<Order[]> {
  const ordersRepository = getCustomRepository(OrdersRepository);
  const orders = await ordersRepository.findAllByCustomerId(customer_id);
  return orders;
}
```

### 2. OrdersController (`backend/src/modules/orders/controllers/OrdersController.ts`)

**Método `index` (já existe)** - Lista orders do usuário autenticado:
1. Extrai `user_id` de `request.user.id`
2. Busca `customer` pelo `user_id` (via email relationship)
3. Chama `ListOrderService.execute({ customer_id })`
4. Retorna orders

**Método `listAll` (já existe)** - Lista todas as orders (admin):
```typescript
public async listAll(request: Request, response: Response): Promise<Response> {
  const ordersRepository = getCustomRepository(OrdersRepository);
  const orders = await ordersRepository.find({
    relations: ['order_products', 'buyer', 'shipping_address'],
    order: { created_at: 'DESC' },
  });
  return response.json(orders);
}
```

### 3. Rotas (`backend/src/modules/orders/routes/orders.routes.ts`)

**Rota `/profile/orders`:**
```typescript
ordersRouter.get('/profile/orders', ordersController.index);
```

**Rota administrativa comentada:**
```typescript
// Rota administrativa — descomentar quando implementar controle de admin
// ordersRouter.get('/admin', isAuthenticated, ensureAdmin, ordersController.listAll);
```

> ⚠️ **Atenção:** O `ordersRouter` é montado em `/orders` no `routes/index.ts`.
> - `ordersRouter.get('/profile/orders')` resulta em `GET /orders/profile/orders`
> - Para ter `GET /profile/orders`, a rota deve ser adicionada no `profileRouter`

### 4. Profile Routes (`backend/src/modules/users/routes/profile.routes.ts`)

Para que a rota seja `GET /profile/orders` (como especificado):

```typescript
import { OrdersController } from '@modules/orders/controllers/OrdersController';

const ordersController = new OrdersController();

profileRouter.get('/orders', ordersController.index);
```

---

## Implementação Frontend

### 1. API Client (`frontend/src/lib/api.js`)

```javascript
export async function getProfileOrders() {
  return request('/profile/orders');
}

export async function getOrderDetail(id) {
  return request(`/orders/${id}`);
}
```

### 2. SellerOrdersTab (`frontend/src/components/seller/SellerOrdersTab.jsx`)

- Substituir `fetchSellerOrders()` por `getProfileOrders()`
- Manter loading, error, empty states

### 3. SellerOrderDetailPage (`frontend/src/pages/SellerOrderDetailPage.jsx`)

- Substituir `fetchSellerOrderDetails()` por `getOrderDetail(orderId)`
- Manter loading, not found, error states

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `backend/src/modules/orders/routes/orders.routes.ts` | Adicionar `/profile/orders` e `/admin` comentada |
| `frontend/src/lib/api.js` | Adicionar `getProfileOrders`, `getOrderDetail` |
| `frontend/src/components/seller/SellerOrdersTab.jsx` | Integrar com API real |
| `frontend/src/pages/SellerOrderDetailPage.jsx` | Integrar com API real |

---

## Testes

### Backend
- `GET /profile/orders` com token → retorna orders do usuário
- `GET /profile/orders` sem token → retorna 401

### Frontend
- `/dashboard?tab=orders` → carrega orders reais
- Click "View Details" → `/dashboard/order/:id` com dados reais
