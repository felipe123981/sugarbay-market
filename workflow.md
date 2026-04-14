### Necessidade
Implementar duas colunas obrigatórias (NOT NULL) na tabela `orders`:
- `buyer_id`: Chave estrangeira para o **customer** comprador (através da relação user->customer via email lookup)
- `seller_id`: Chave estrangeira para o **customer** vendedor (proprietário do produto)

### Impacto no Sistema
- Melhoria na rastreabilidade de pedidos entre compradores e vendedores específicos
- Maior clareza nos relatórios de vendas por vendedor
- Melhor experiência para sellers ao visualizar apenas seus pedidos
- Facilita a implementação de funcionalidades de mensagens entre buyer e seller
- Permite uma arquitetura mais escalável para funcionalidades futuras (comissões, pagamentos por vendedor, etc.)
- Melhora a capacidade de gerar relatórios financeiros por vendedor

### Estratégia Recomendada para Pedidos Multi-Vendedor

Para esta implementação, recomenda-se a **Opção C: Atribuição Baseada no Vendedor Principal**, que é a mais viável dada a arquitetura atual:

1. A arquitetura atual permite que pedidos tenham produtos de múltiplos vendedores
2. Modificar drasticamente essa funcionalidade afetaria negativamente a experiência do usuário
3. A melhor abordagem é identificar o vendedor predominante no pedido (por quantidade de itens ou primeiro produto) como `seller_id`
4. O `buyer_id` será sempre o customer associado ao usuário autenticado
5. Esta abordagem mantém a funcionalidade existente sem grandes alterações de arquitetura
6. Em casos de empate de quantidade de produtos por vendedor, pode-se usar critérios como ordem de inclusão no carrinho

### Detalhes da Implementação

#### Fase 1: Atualização da Entidade Order
Modificar a entidade `Order` para substituir o relacionamento com `User` por relacionamentos com `Customer` para comprador e vendedor.

#### Fase 2: Criação da Migração
Criar uma migração para:
- Adicionar `buyer_id` (relacionado ao customer do usuário autenticado)
- Adicionar `seller_id` (relacionado ao customer proprietário do produto predominante)
- Manter compatibilidade com dados existentes
- Executar script de conversão para dados existentes
- Manter integridade referencial com as tabelas customers e products

#### Fase 3: Atualização da Lógica de Negócio
Modificar o `CreateOrderService` para:
1. Obter o customer do usuário autenticado (via email lookup)
2. Determinar o vendedor predominante entre os produtos do pedido
3. Associar corretamente buyer_id e seller_id ao novo pedido

### Estratégia Escolhida: Vendedor Predominante no Pedido

A abordagem mais viável considera:
1. Se todos os produtos forem do mesmo vendedor → usar esse vendedor como `seller_id`
2. Se houver produtos de múltiplos vendedores → usar o vendedor que detém o maior número de itens no pedido
3. O `buyer_id` sempre será o `customer` associado ao usuário autenticado (via email lookup)
4. Para pedidos existentes: usar scripts de migração para atribuir valores com base nos dados históricos
5. Em caso de empate na quantidade de produtos por vendedor, usar o primeiro vendedor encontrado como critério de desempate
6. Garantir que a lógica de seleção do vendedor predominante considere também o valor total do pedido por vendedor

### Fases de Implementação

#### Fase 1: Migração de Dados
```typescript
// Criar nova migração: AddBuyerIdAndSellerIdToOrders1713033963000.ts
export class AddBuyerIdAndSellerIdToOrders1713033963000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adicionar colunas buyer_id e seller_id como nullable temporariamente
    await queryRunner.addColumn('orders', new TableColumn({
      name: 'buyer_id',
      type: 'uuid',
      isNullable: true,
    }));
    
    await queryRunner.addColumn('orders', new TableColumn({
      name: 'seller_id',
      type: 'uuid',
      isNullable: true,
    }));

    // 2. Preencher buyer_id com base no customer_id associado ao user do pedido
    await queryRunner.query(`
      UPDATE orders 
      SET buyer_id = (
        SELECT c.id 
        FROM users u
        JOIN customers c ON u.email = c.email
        WHERE u.id = orders.user_id
      )
      WHERE buyer_id IS NULL
    `);

    // 3. Preencher seller_id com base no vendedor predominante no pedido
    await queryRunner.query(`
      UPDATE orders 
      SET seller_id = (
        SELECT p.customer_id 
        FROM orders_products op
        JOIN products p ON op.product_id = p.id
        WHERE op.order_id = orders.id
        GROUP BY p.customer_id
        ORDER BY COUNT(*) DESC
        LIMIT 1
      )
      WHERE seller_id IS NULL
    `);

    // 4. Adicionar chaves estrangeiras
    await queryRunner.createForeignKey('orders', new TableForeignKey({
      name: 'OrdersBuyer',
      columnNames: ['buyer_id'],
      referencedTableName: 'customers',
      referencedColumnNames: ['id'],
      onDelete: 'RESTRICT',
    }));
    
    await queryRunner.createForeignKey('orders', new TableForeignKey({
      name: 'OrdersSeller',
      columnNames: ['seller_id'],
      referencedTableName: 'customers',
      referencedColumnNames: ['id'],
      onDelete: 'RESTRICT',
    }));

    // 5. Tornar colunas NOT NULL definitivamente
    await queryRunner.query(`
      ALTER TABLE orders 
      ALTER COLUMN buyer_id SET NOT NULL,
      ALTER COLUMN seller_id SET NOT NULL
    `);
    
    // 6. Remover a coluna antiga user_id (opcional, pode ser mantida por compatibilidade)
    // await queryRunner.dropColumn('orders', 'user_id');
  }
}
```

#### Fase 2: Atualização de Modelos
```typescript
// Atualizar Order.ts
@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer)  // Novo relacionamento para o comprador
  @JoinColumn({ name: 'buyer_id' })
  buyer: Customer;

  @ManyToOne(() => Customer)  // Novo relacionamento para o vendedor
  @JoinColumn({ name: 'seller_id' })
  seller: Customer;

  @OneToMany(() => OrdersProducts, order_products => order_products.order, {
    cascade: true,
  })
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

- Atualizar os relacionamentos e tipagem na entidade Order
- Garantir que as importações estejam atualizadas
- Manter compatibilidade com os repositórios e serviços existentes
- Manter os métodos de serialização e transformação existentes
- Incluir os novos campos nas consultas existentes

#### Fase 3: Atualização de Lógica de Negócio
- Modificar `CreateOrderService` para obter o customer do usuário (via email lookup) e determinar o vendedor predominante nos produtos do pedido
- Atualizar `OrdersRepository` para aceitar buyer e seller ao invés de user
- Atualizar `OrdersController` para mapear corretamente os IDs de comprador e vendedor
- Implementar validações para garantir integridade dos dados buyer_id e seller_id
- Garantir consistência na atualização de estoque após as mudanças
- Atualizar interfaces e tipagem para refletir as novas relações
- Manter a lógica de cache atualizada após as mudanças

#### Fase 4: Adequação do Frontend
- Atualizar componentes de checkout e acompanhamento de pedidos para refletir as relações com buyer e seller
- Modificar exibição de pedidos para mostrar informações de comprador e vendedor
- Atualizar rotas e interfaces para refletir a nova estrutura de dados
- Garantir consistência na exibição de informações de vendedor nas páginas de produtos e pedidos
- Atualizar páginas de seller dashboard para filtrar pedidos corretamente por vendedor
- Implementar interfaces para mensagens entre buyer e seller se necessário
- Atualizar páginas de administração para visualizar pedidos com os novos campos
- Atualizar páginas de relatórios para utilizar as novas relações de buyer e seller

#### Fase 5: Validação e Testes
- Implementar validações para garantir que buyer_id e seller_id sejam sempre definidos corretamente
- Testar a migração de dados para garantir que pedidos existentes mantenham consistência
- Verificar a integração completa entre backend e frontend com a nova estrutura
- Garantir que a experiência do usuário permaneça intacta
- Realizar testes de ponta a ponta para validar o fluxo completo de pedidos
- Validar o comportamento do sistema com pedidos contendo produtos de múltiplos vendedores
- Testar a funcionalidade de checkout com produtos de diferentes vendedores
- Verificar a integridade referencial após a migração de dados
- Validar a performance do sistema após as alterações

## Conclusão

Este documento fornece uma visão completa da arquitetura do e-commerce SugarBay Market, incluindo padrões de código, estrutura de pastas, tecnologias utilizadas e especificações para a implementação de buyer_id e seller_id na tabela de pedidos. O padrão de implementação segue uma abordagem orientada a módulos, com separação clara de responsabilidades entre camadas (controller, service, repository, entity).

O sistema foi projetado para suportar um marketplace com múltiplos vendedores, e a implementação proposta para buyer_id e seller_id visa melhorar a rastreabilidade e gerenciamento de pedidos entre compradores e vendedores específicos, mantendo a compatibilidade com a funcionalidade existente.
