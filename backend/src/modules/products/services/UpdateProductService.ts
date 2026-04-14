import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import Product from '../typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  photos?: Array<string>;
  user_id: string;
  categories?: string[];
  size?: string;
  number?: number;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
  brand?: string;
  model?: string;
  color?: string;
  publisher?: string;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    description,
    price,
    quantity,
    photos,
    user_id,
    categories,
    size,
    number,
    width,
    height,
    length,
    weight,
    brand,
    model,
    color,
    publisher,
  }: IRequest): Promise<Product> {
    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findOne(user_id);
    if (!user) {
      throw new AppError('User not found.');
    }

    const customerRepository = getCustomRepository(CustomersRepository);

    const productRepository = getCustomRepository(ProductsRepository);

    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    const productExists = await productRepository.findByName(name);

    if (productExists && name != product.name) {
      throw new AppError('There is already one product with this name');
    }

    const customer = await customerRepository.findOne(product.customer_id);
    if (!customer) {
      throw new AppError('Customer not found.');
    }

    if (customer.email != user.email) {
      throw new AppError('Operation not permited.', 403);
    }

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.photos = photos;
    if (categories !== undefined) product.categories = categories;
    if (size !== undefined) product.size = size;
    if (number !== undefined) product.number = number;
    if (width !== undefined) product.width = width;
    if (height !== undefined) product.height = height;
    if (length !== undefined) product.length = length;
    if (weight !== undefined) product.weight = weight;
    if (brand !== undefined) product.brand = brand;
    if (model !== undefined) product.model = model;
    if (color !== undefined) product.color = color;
    if (publisher !== undefined) product.publisher = publisher;

    await productRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
