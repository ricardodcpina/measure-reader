import crypto from 'crypto';

import { MeasurementModel } from '../models';
import { Measurement, UploadRequest, UploadResponse } from '../types';
import { doubleReport } from '../errors';

import { validateBody } from '../utils/validateBody';
import { extractMeasurement } from '../utils/extractMeasurement';
import { saveTemporaryImage } from '../utils/saveTemporaryImage';

const PORT = process.env.API_PORT || 3000;
const API_URL = process.env.API_URL || `http://localhost:${PORT}`;

export default async function uploadService(
  uploadBody: UploadRequest
): Promise<UploadResponse> {
  const {
    image,
    customer_code,
    measurement_type,
    measurement_datetime,
  } = uploadBody;

  // Validate user input
  validateBody('upload', uploadBody);

  // Checks for duplicates in db
  const measurementDate = new Date(measurement_datetime);
  const measurementMonth = measurementDate.getMonth();

  const duplicateMeasure = await MeasurementModel.findOne({
    customer_code,
    measurement_month: measurementMonth,
    measurement_type: measurement_type,
  });
  if (duplicateMeasure) throw doubleReport;

  // Saves image to be uploaded temporarly in fs for 30s
  const fileData = {
    base64Img: image,
    customer_code: customer_code,
    measurement_type: measurement_type,
  };
  const { fileName, filePath } = saveTemporaryImage(fileData);

  // Google Gemini AI extracts the measure
  const extractedMeasure = await extractMeasurement(
    fileName,
    filePath
  );

  // Insert formatted measure in db
  const measureUUID = crypto.randomUUID();
  const measureValue = Math.floor(Number(extractedMeasure) * 0.001);
  const imageURL = `${API_URL}/files/${fileName}`;

  const measure: Measurement = {
    customer_code,
    measurement_uuid: measureUUID,
    measurement_value: measureValue,
    measurement_datetime: measurementDate,
    measurement_month: measurementMonth,
    measurement_type,
    has_confirmed: false,
    image_url: imageURL,
  };
  await MeasurementModel.create(measure);

  return {
    image_url: imageURL,
    measurement_value: measureValue,
    measurement_uuid: measureUUID,
  };
}
