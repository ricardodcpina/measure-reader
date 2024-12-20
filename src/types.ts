export type Measurement = {
  customer_code: string;
  measurement_uuid: string;
  measurement_value: number;
  measurement_month: Number;
  measurement_datetime: Date;
  measurement_type: 'WATER' | 'GAS';
  has_confirmed: boolean;
  image_url: string;
};

export type MeasurementError = {
  status_code: number;
  error_code:
    | 'INVALID_TYPE'
    | 'INVALID_DATA'
    | 'MEASUREMENT_NOT_FOUND'
    | 'MEASUREMENTS_NOT_FOUND'
    | 'CONFIRMATION_DUPLICATE'
    | 'DOUBLE_REPORT';
  error_description: string;
};

export type UploadRequest = {
  image: string;
  customer_code: string;
  measurement_datetime: string;
  measurement_type: 'WATER' | 'GAS';
};

export type ConfirmRequest = {
  measurement_uuid: string;
  confirmed_value: number;
};

export type UploadResponse = Pick<
  Measurement,
  'image_url' | 'measurement_value' | 'measurement_uuid'
>;

export type ConfirmResponse = {
  success: boolean;
};

export type ListResponse = {
  customer_code: string;
  measurements: Omit<Measurement, 'customer_code'>[];
};
