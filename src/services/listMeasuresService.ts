import { MeasureModel } from '../models';

import { invalidType, measuresNotFound } from '../errors';
import { ListResponse } from '../types';

export default async function listMeasuresService(
  customerId: string,
  measure_type?: string
): Promise<ListResponse> {
  const measureType = measure_type ? measure_type.toUpperCase() : '';

  // Checks for correct measure types
  if (measure_type && measureType !== 'WATER' && measureType !== 'GAS') {
    throw invalidType;
  }

  // List all measures from a customer
  const measureList = await MeasureModel.find(
    {
      customer_code: customerId,
      measure_type: { $regex: measureType, $options: 'i' },
    },
    '-_id measure_uuid measure_datetime measure_type has_confirmed image_url'
  );

  if (measureList.length === 0) throw measuresNotFound;

  return {
    customer_code: customerId,
    measures: measureList,
  };
}
