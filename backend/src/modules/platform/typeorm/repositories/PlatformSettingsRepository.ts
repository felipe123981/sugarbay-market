import { EntityRepository, Repository } from 'typeorm';
import PlatformSetting from '../entities/PlatformSetting';

@EntityRepository(PlatformSetting)
export class PlatformSettingsRepository extends Repository<PlatformSetting> {
  public async findSettings(): Promise<PlatformSetting | undefined> {
    const settings = await this.findOne();
    return settings;
  }
}
