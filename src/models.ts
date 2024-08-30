import { Schema, model } from 'mongoose';
import { Measure } from './types';

const regexUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const regexURL = /^(ftp|http|https):\/\/[^ "]+$/;

const MeasureSchema = new Schema<Measure>({
  customer_code: { type: String, required: true, trim: true },
  measure_uuid: { type: String, required: true, unique: true, match: regexUUID },
  measure_value: { type: Number, required: true },
  measure_datetime: { type: Date, required: true },
  measure_month: { type: Number, required: true, min: 0, max: 11 },
  measure_type: { type: String, required: true, enum: ['GAS', 'WATER'] },
  has_confirmed: { type: Boolean, default: false },
  image_url: { type: String, trim: true, match: regexURL },
});

export const MeasureModel = model<Measure>('Measure', MeasureSchema);

