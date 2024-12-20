import { MeasurementModel } from '../models';

import {
  confirmationDuplicate,
  measurementNotFound,
} from '../errors';
import { ConfirmRequest, ConfirmResponse } from '../types';

import { validateBody } from '../utils/validateBody';

export default async function confirmationService(
  confirmBody: ConfirmRequest
): Promise<ConfirmResponse> {
  const { measurement_uuid, confirmed_value } = confirmBody;

  // Validate user input
  validateBody('confirm', confirmBody);

  // Checks if measure exists and is confirmed
  const measurement = await MeasurementModel.findOne({
    measurement_uuid,
  });
  if (!measurement) throw measurementNotFound;
  if (measurement.has_confirmed) throw confirmationDuplicate;

  // Confirms measure and saves in db
  await MeasurementModel.updateOne(
    { measurement_uuid: measurement_uuid },
    { measurement_value: confirmed_value, has_confirmed: true }
  );

  return { success: true };
}
