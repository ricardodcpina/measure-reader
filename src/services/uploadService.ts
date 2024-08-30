import crypto from 'crypto';

import { MeasureModel } from '../models';
import { Measure, UploadRequest, UploadResponse } from '../types';
import { doubleReport } from '../errors';

import { validateBody } from '../utils/validateBody';
import { extractMeasure } from '../utils/extractMeasure';
import { saveTemporaryImage } from '../utils/saveTemporaryImage';

export default async function uploadService(uploadBody: UploadRequest): Promise<UploadResponse> {
  const baseURL = `http://localhost:3000`;
  const { image, customer_code, measure_type, measure_datetime } = uploadBody;

  // Validate user input
  validateBody('upload', uploadBody);

  // Checks for duplicates in db
  const measureDate = new Date(measure_datetime);
  const measureMonth = measureDate.getMonth();

  const duplicateMeasure = await MeasureModel.findOne({
    customer_code,
    measure_month: measureMonth,
    measure_type: measure_type,
  });
  if (duplicateMeasure) throw doubleReport;

  // Saves image to be uploaded temporarly in fs for 30s
  const fileData = {
    base64Img: image,
    customer_code: customer_code,
    measure_type: measure_type,
  };
  const { fileName, filePath } = saveTemporaryImage(fileData);

  // Google Gemini AI extracts the measure
  const extractedMeasure = await extractMeasure(fileName, filePath);

  // Insert formatted measure in db
  const measureUUID = crypto.randomUUID();
  const measureValue = Math.floor(Number(extractedMeasure) * 0.001);
  const imageURL = `${baseURL}/files/${fileName}`;

  const measure: Measure = {
    customer_code,
    measure_uuid: measureUUID,
    measure_value: measureValue,
    measure_datetime: measureDate,
    measure_month: measureMonth,
    measure_type,
    has_confirmed: false,
    image_url: imageURL,
  };
  await MeasureModel.create(measure);

  return {
    image_url: imageURL,
    measure_value: measureValue,
    measure_uuid: measureUUID,
  };
}
