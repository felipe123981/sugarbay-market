import { getCustomRepository } from 'typeorm';
import PlatformSetting from '../typeorm/entities/PlatformSetting';
import { PlatformSettingsRepository } from '../typeorm/repositories/PlatformSettingsRepository';

interface IRequest {
  tax_rate: number;
  profit_margin: number;
  packaging_cost: number;
  shipping_cost: number;
}

class UpdatePlatformSettingsService {
  public async execute({
    tax_rate,
    profit_margin,
    packaging_cost,
    shipping_cost,
  }: IRequest): Promise<PlatformSetting> {
    const platformSettingsRepository = getCustomRepository(
      PlatformSettingsRepository,
    );

    let settings = await platformSettingsRepository.findSettings();

    if (!settings) {
      settings = platformSettingsRepository.create({
        tax_rate,
        profit_margin,
        packaging_cost,
        shipping_cost,
      });
    } else {
      settings.tax_rate = tax_rate;
      settings.profit_margin = profit_margin;
      settings.packaging_cost = packaging_cost;
      settings.shipping_cost = shipping_cost;
    }

    await platformSettingsRepository.save(settings);

    return settings;
  }
}

export default UpdatePlatformSettingsService;
