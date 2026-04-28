import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductsRepository } from '@modules/products/typeorm/repositores/ProductsRepository';
import { PlatformSettingsRepository } from '@modules/platform/typeorm/repositories/PlatformSettingsRepository';
import { OrderAddressRepository } from '../typeorm/repositories/OrderAddressRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IShippingAddress {
  name: string;
  address: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
  shipping_address: IShippingAddress;
}

class CreateOrderService {
  public async execute({ customer_id, products, shipping_address }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductsRepository);
    const platformSettingsRepository = getCustomRepository(PlatformSettingsRepository);
    const orderAddressRepository = getCustomRepository(OrderAddressRepository);

    const customerExists = await customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    const existsProducts = await productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any product with the given ids.');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}.`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not avaliable for ${quantityAvailable[0].id}.`,
      );
    }

    // Create shipping address
    const orderAddress = await orderAddressRepository.createAddress({
      name: shipping_address.name,
      address: shipping_address.address,
      city: shipping_address.city,
      state: shipping_address.state,
      zip: shipping_address.zip,
      country: shipping_address.country,
    });

    // Load platform settings for markup calculation
    let settings = await platformSettingsRepository.findSettings();
    if (!settings) {
      settings = platformSettingsRepository.create({
        tax_rate: 0.1,
        profit_margin: 0.2,
        packaging_cost: 2.5,
        shipping_cost: 8.5,
      });
    }

    const taxRate = Number(settings.tax_rate);
    const profitMargin = Number(settings.profit_margin);
    const packagingCost = Number(settings.packaging_cost);
    const shippingCost = Number(settings.shipping_cost);

    // Group products by seller_id
    const productsBySeller: Record<string, any[]> = {};
    existsProducts.forEach(product => {
      const sellerId = product.customer_id as unknown as string;
      if (!productsBySeller[sellerId]) {
        productsBySeller[sellerId] = [];
      }
      const quantity = products.find(p => p.id === product.id)!.quantity;
      productsBySeller[sellerId].push({
        ...product,
        quantity,
      });
    });

    const sellerIds = Object.keys(productsBySeller);
    let orderTotal = 0;
    const serializedProducts: any[] = [];

    const divisor = 1 - (taxRate + profitMargin);
    if (divisor <= 0) {
      throw new AppError('Invalid platform settings: tax and profit margin exceed 100%.');
    }

    // Calculate markup per seller
    for (const sellerId of sellerIds) {
      const sellerItems = productsBySeller[sellerId];
      const sumProductPrices = sellerItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
      
      // FORMULA: (sumProductCosts + packaging + shipping) / (1 - (tax + profit))
      const totalCost = sumProductPrices + packagingCost + shippingCost;
      const sellerFinalPrice = totalCost / divisor;
      
      orderTotal += sellerFinalPrice;

      // Distribute final price to each product for this seller
      for (const item of sellerItems) {
        const itemProportion = (Number(item.price) * item.quantity) / sumProductPrices;
        const itemFinalPrice = itemProportion * sellerFinalPrice;
        
        serializedProducts.push({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          final_price: itemFinalPrice,
          seller_id: sellerId,
          buyer_id: customer_id,
        });
      }
    }

    const order = await ordersRepository.createOrder({
      customer: customerExists,
      seller_ids: sellerIds,
      products: serializedProducts,
      total: orderTotal,
      shipping_address_id: orderAddress.id,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
