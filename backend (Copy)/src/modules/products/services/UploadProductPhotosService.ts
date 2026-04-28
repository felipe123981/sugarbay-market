import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import uploadConfig from '@config/upload';
import { getFileExtension } from '@config/utils';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
  photoFilenames: Array<string>;
}

class UploadProductPhotosService {
  public async execute({ id, photoFilenames }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository);
    const redisCache = new RedisCache();

    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    if (!product.photos) {
      product.photos = [];
    }

    if (product.photos.length === 0 && photoFilenames.length < 3) {
      throw new AppError('Upload at least 3 photos of the product.');
    }

    for (const photoFilename of photoFilenames) {
      const productPhotoFilePath = path.join(
        uploadConfig.directory,
        photoFilename,
      );
      const productPhotoFileExists = await fs.promises.stat(
        productPhotoFilePath,
      );

      if (
        productPhotoFileExists &&
        (getFileExtension(photoFilename) == 'png' ||
          getFileExtension(photoFilename) == 'jpg' ||
          getFileExtension(photoFilename) == 'jpeg' ||
          getFileExtension(photoFilename) == 'webp')
      ) {
        product.photos.push(photoFilename);
      }
    }

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productsRepository.save(product);

    return product;
  }
}

export default UploadProductPhotosService;
