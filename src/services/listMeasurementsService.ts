import { MeasurementModel } from '../models';

import { invalidType, measurementsNotFound } from '../errors';
import { ListResponse } from '../types';

export default async function listMeasuresService(
  customerId: string,
  measurement_type?: string
): Promise<ListResponse> {
  const measurementType = measurement_type
    ? measurement_type.toUpperCase()
    : '';

  // Checks for correct measure types
  if (
    measurement_type &&
    measurementType !== 'WATER' &&
    measurementType !== 'GAS'
  ) {
    throw invalidType;
  }

  // List all measures from a customer
  const measurementList = await MeasurementModel.find(
    {
      customer_code: customerId,
      measurement_type: { $regex: measurementType, $options: 'i' },
    },
    '-_id measurement_uuid measurement_datetime measurement_type has_confirmed image_url'
  );
  if (measurementList.length === 0) throw measurementsNotFound;

  return {
    customer_code: customerId,
    measurements: measurementList,
  };
}
