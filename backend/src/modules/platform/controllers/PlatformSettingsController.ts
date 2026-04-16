import { Request, Response } from 'express';
import ShowPlatformSettingsService from '../services/ShowPlatformSettingsService';
import UpdatePlatformSettingsService from '../services/UpdatePlatformSettingsService';

export default class PlatformSettingsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showPlatformSettings = new ShowPlatformSettingsService();

    const settings = await showPlatformSettings.execute();

    return response.json(settings);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { tax_rate, profit_margin, packaging_cost, shipping_cost } =
      request.body;

    const updatePlatformSettings = new UpdatePlatformSettingsService();

    const settings = await updatePlatformSettings.execute({
      tax_rate,
      profit_margin,
      packaging_cost,
      shipping_cost,
    });

    return response.json(settings);
  }
}
