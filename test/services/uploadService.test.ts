const mockRandomUUID = jest.fn();
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockSaveImage = jest.fn();
const mockExtractMeasurement = jest.fn();
const mockValidateBody = jest.fn();

const mockCrypto = {
  randomUUID: mockRandomUUID,
};

const mockModels = {
  MeasurementModel: {
    findOne: mockFindOne,
    create: mockCreate,
  },
};

const mockUtils = {
  validateBody: mockValidateBody,
  extractMeasurement: mockExtractMeasurement,
  saveTemporaryImage: mockSaveImage,
};

jest.mock('crypto', () => mockCrypto);
jest.mock('../../src/models', () => mockModels);
jest.mock('../../src/utils/saveTemporaryImage.ts', () => mockUtils);
jest.mock('../../src/utils/extractMeasurement.ts', () => mockUtils);
jest.mock('../../src/utils/validateBody.ts', () => mockUtils);

import uploadService from '../../src/services/uploadService';
import { UploadRequest } from '../../src/types';

const body: UploadRequest = {
  image: 'fakeBase64Img',
  customer_code: 'fakeCustomerCode',
  measurement_datetime: '2024-04-02',
  measurement_type: 'GAS',
};

describe('uploadService', () => {
  describe('when the input data is valid', () => {
    it('should return an object with a temporary URL, the measure reading and its UUID ', async () => {
      mockSaveImage.mockReturnValue({ fileName: 'fakeFileName', filePath: 'fakeFilePath' });
      mockFindOne.mockResolvedValue(null);
      mockExtractMeasurement.mockResolvedValue(50000);
      mockRandomUUID.mockReturnValue('fakeUUID');

      const result = uploadService(body);

      await expect(result).resolves.toEqual({
        image_url: 'http://localhost:3000/files/fakeFileName',
        measurement_value: 50,
        measurement_uuid: 'fakeUUID',
      });

      expect(mockValidateBody).toHaveBeenCalledWith('upload', body);
      expect(mockSaveImage).toHaveBeenCalledWith({
        base64Img: body.image,
        customer_code: body.customer_code,
        measurement_type: body.measurement_type,
      });
      expect(mockExtractMeasurement).toHaveBeenCalledWith('fakeFileName', 'fakeFilePath');
      expect(mockRandomUUID).toHaveBeenCalled();

      expect(mockFindOne).toHaveBeenCalledWith({
        customer_code: 'fakeCustomerCode',
        measurement_month: 3,
        measurement_type: 'GAS',
      });

      expect(mockCreate).toHaveBeenCalledWith({
        customer_code: 'fakeCustomerCode',
        measurement_uuid: 'fakeUUID',
        measurement_value: 50,
        measurement_datetime: new Date('2024-04-02'),
        measurement_month: 3,
        measurement_type: 'GAS',
        has_confirmed: false,
        image_url: 'http://localhost:3000/files/fakeFileName',
      });
    });
  });

  describe('when the input data is invalid', () => {
    it('should return DOUPLE_REPORT error when providing a measure with same type and month', async () => {
      mockFindOne.mockResolvedValue('fakeMeasure');

      const result = uploadService(body);

      await expect(result).rejects.toEqual({
        status_code: 409,
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });

      expect(mockFindOne).toHaveBeenCalledWith({
        customer_code: 'fakeCustomerCode',
        measurement_month: 3,
        measurement_type: 'GAS',
      });

      expect(mockSaveImage).not.toHaveBeenCalled();
      expect(mockExtractMeasurement).not.toHaveBeenCalled();
      expect(mockRandomUUID).not.toHaveBeenCalled();
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});
