import { MeasureModel } from '../models';

import { confirmationDuplicate, measureNotFound } from '../errors';
import { ConfirmRequest, ConfirmResponse } from '../types';

import { validateBody } from '../utils/validateBody';

export default async function confirmationService(
  confirmBody: ConfirmRequest
): Promise<ConfirmResponse> {
  const { measure_uuid, confirmed_value } = confirmBody;

  // Validate user input
  validateBody('confirm', confirmBody);

  // Checks if measure exists and is confirmed
  const measure = await MeasureModel.findOne({
    measure_uuid,
  });
  if (!measure) throw measureNotFound;
  if (measure.has_confirmed) throw confirmationDuplicate;

  // Confirms measure and saves in db
  await MeasureModel.updateOne(
    { measure_uuid: measure_uuid },
    { measure_value: confirmed_value, has_confirmed: true }
  );

  return { success: true };
}
