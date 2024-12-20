import { MeasurementError } from './types';

export const invalidData: MeasurementError = {
  status_code: 400,
  error_code: 'INVALID_DATA',
  error_description: 'Dados inválidos',
};

export const invalidType: MeasurementError = {
  status_code: 400,
  error_code: 'INVALID_TYPE',
  error_description: 'Tipo de medição não permitida',
};

export const measurementNotFound: MeasurementError = {
  status_code: 404,
  error_code: 'MEASUREMENT_NOT_FOUND',
  error_description: 'Leitura não encontrada',
};

export const measurementsNotFound: MeasurementError = {
  status_code: 404,
  error_code: 'MEASUREMENTS_NOT_FOUND',
  error_description: 'Nenhuma leitura encontrada',
};

export const doubleReport: MeasurementError = {
  status_code: 409,
  error_code: 'DOUBLE_REPORT',
  error_description: 'Leitura do mês já realizada',
};

export const confirmationDuplicate: MeasurementError = {
  status_code: 409,
  error_code: 'CONFIRMATION_DUPLICATE',
  error_description: 'Leitura do mês já confirmada',
};
