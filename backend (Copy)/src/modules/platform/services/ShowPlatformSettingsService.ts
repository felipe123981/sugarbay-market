import { getCustomRepository } from 'typeorm';
import PlatformSetting from '../typeorm/entities/PlatformSetting';
import { PlatformSettingsRepository } from '../typeorm/repositories/PlatformSettingsRepository';

class ShowPlatformSettingsService {
  public async execute(): Promise<PlatformSetting> {
    const platformSettingsRepository = getCustomRepository(
      PlatformSettingsRepository,
    );

    let settings = await platformSettingsRepository.findSettings();

    if (!settings) {
      // Return default settings if none exist
      settings = platformSettingsRepository.create({
        tax_rate: 0.1,
        profit_margin: 0.2,
        packaging_cost: 2.5,
        shipping_cost: 8.5,
      });
      await platformSettingsRepository.save(settings);
    }

    return settings;
  }
}

export default ShowPlatformSettingsService;
