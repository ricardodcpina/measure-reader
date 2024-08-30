import { z } from 'zod';

import { ConfirmRequest, UploadRequest } from '../types';
import { invalidData } from '../errors';

export const validateBody = (
  bodyType: 'upload' | 'confirm',
  bodyData: UploadRequest | ConfirmRequest
) => {
  let bodySchema = null;

  const regexBase64 = RegExp(
    /^data\:(?<type>image\/(png|tiff|jpg|gif|jpeg|bmp|webp|heic|heif));base64,(?<data>[A-Z0-9\+\/\=])*$/,
    'i'
  );

  // Apply a validation schema depending on body type
  switch (bodyType) {
    case 'upload':
      bodySchema = z.object({
        image: z.custom<String>((value) => regexBase64.test(value), {
          message: 'Insira uma imagem no formato base64',
        }),
        customer_code: z.string({
          required_error: 'Insira o código de cliente',
          invalid_type_error: 'Código de cliente deve ser uma string',
        }),
        measure_datetime: z
          .string({
            required_error: 'Insira a data da leitura',
            invalid_type_error: 'Data deve ser em string',
          })
          .date('Data deve estar no formato YYYY-MM-DD'),
        measure_type: z.enum(['WATER', 'GAS'], {
          message: 'Insira o tipo da medida como sendo WATER ou GAS',
        }),
      });
      break;
    case 'confirm':
      bodySchema = z.object({
        measure_uuid: z
          .string({
            required_error: 'Insira o UUID de uma medida',
            invalid_type_error: 'UUID deve ser uma string',
          })
          .uuid({ message: 'UUID informado é inválido' }),
        confirmed_value: z
          .number({
            required_error: 'Insira o valor de uma medida',
            invalid_type_error: 'Valor da medida deve ser um número inteiro',
          })
          .int({ message: 'Valor da medida deve ser um número inteiro' }),
      });
      break;
    default:
      break;
  }
  // Concatenates validation errors all in one single message
  if (bodySchema) {
    const validation = bodySchema.safeParse(bodyData);

    if (!validation.success) {
      const errorMessages = validation.error.errors.map((error) => error.message);
      invalidData.error_description = errorMessages.join(' | ');
      throw invalidData;
    }
  }

  return;
};
