import { Schema, model } from 'mongoose';
import { Measurement } from './types';

const regexUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const regexURL = /^(ftp|http|https):\/\/[^ "]+$/;

const MeasurementSchema = new Schema<Measurement>({
  customer_code: { type: String, required: true, trim: true },
  measurement_uuid: { type: String, required: true, unique: true, match: regexUUID },
  measurement_value: { type: Number, required: true },
  measurement_datetime: { type: Date, required: true },
  measurement_month: { type: Number, required: true, min: 0, max: 11 },
  measurement_type: { type: String, required: true, enum: ['GAS', 'WATER'] },
  has_confirmed: { type: Boolean, default: false },
  image_url: { type: String, trim: true, match: regexURL },
});

export const MeasurementModel = model<Measurement>('Measurement', MeasurementSchema);

