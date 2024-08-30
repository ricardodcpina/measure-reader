import { MeasureError } from './types';

export const invalidData: MeasureError = {
  status_code: 400,
  error_code: 'INVALID_DATA',
  error_description: 'Dados inválidos',
};

export const invalidType: MeasureError = {
  status_code: 400,
  error_code: 'INVALID_TYPE',
  error_description: 'Tipo de medição não permitida',
};

export const measureNotFound: MeasureError = {
  status_code: 404,
  error_code: 'MEASURE_NOT_FOUND',
  error_description: 'Leitura não encontrada',
};

export const measuresNotFound: MeasureError = {
  status_code: 404,
  error_code: 'MEASURES_NOT_FOUND',
  error_description: 'Nenhuma leitura encontrada',
};

export const doubleReport: MeasureError = {
  status_code: 409,
  error_code: 'DOUBLE_REPORT',
  error_description: 'Leitura do mês já realizada',
};

export const confirmationDuplicate: MeasureError = {
  status_code: 409,
  error_code: 'CONFIRMATION_DUPLICATE',
  error_description: 'Leitura do mês já confirmada',
};
