export type Measure = {
  customer_code: string;
  measure_uuid: string;
  measure_value: number;
  measure_month: Number;
  measure_datetime: Date;
  measure_type: 'WATER' | 'GAS';
  has_confirmed: boolean;
  image_url: string;
};

export type MeasureError = {
  status_code: number;
  error_code:
    | 'INVALID_TYPE'
    | 'INVALID_DATA'
    | 'MEASURE_NOT_FOUND'
    | 'MEASURES_NOT_FOUND'
    | 'CONFIRMATION_DUPLICATE'
    | 'DOUBLE_REPORT';
  error_description: string;
};

export type UploadRequest = {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: 'WATER' | 'GAS';
};

export type ConfirmRequest = {
  measure_uuid: string;
  confirmed_value: number;
};

export type UploadResponse = Pick<Measure, 'image_url' | 'measure_value' | 'measure_uuid'>;

export type ConfirmResponse = {
  success: boolean;
};

export type ListResponse = {
  customer_code: string;
  measures: Omit<Measure, 'customer_code'>[];
};
