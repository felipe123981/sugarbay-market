import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import Product from '../typeorm/entities/Product';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const productRepository = getCustomRepository(ProductsRepository);

    const products = await productRepository.find({
      order: { created_at: 'DESC' },
    });

    return products;
  }
}

export default ListProductService;
