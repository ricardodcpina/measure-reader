const mockFind = jest.fn();

const mockModels = {
  MeasureModel: {
    find: mockFind,
  },
};

jest.mock('../../src/models', () => mockModels);

import listMeasuresService from '../../src/services/listMeasuresService';
import { Measure } from '../../src/types';

const mockList_1 = [
  {
    measure_uuid: 'fakeUUID',
    measure_datetime: 'fakeDate',
    measure_type: 'WATER',
    has_confirmed: false,
    image_url: 'fakeURL',
  },
  {
    measure_uuid: 'fakeUUID2',
    measure_datetime: 'fakeDate2',
    measure_type: 'WATER',
    has_confirmed: true,
    image_url: 'fakeURL2',
  },
];

const mockList_2 = [
  {
    measure_uuid: 'fakeUUID',
    measure_datetime: 'fakeDate',
    measure_type: 'WATER',
    has_confirmed: false,
    image_url: 'fakeURL',
  },
  {
    measure_uuid: 'fakeUUID2',
    measure_datetime: 'fakeDate2',
    measure_type: 'GAS',
    has_confirmed: true,
    image_url: 'fakeURL2',
  },
];

const mockList_3: Measure[] = [];

describe('listMeasuresSerice', () => {
  describe('when the input data is valid', () => {
    it('should return the customer code with a list of the provided measure type', async () => {
      mockFind.mockResolvedValue(mockList_1);

      const result = listMeasuresService('1172285', 'WATER');

      await expect(result).resolves.toEqual({
        customer_code: '1172285',
        measures: mockList_1,
      });

      expect(mockFind).toHaveBeenCalledWith(
        {
          customer_code: '1172285',
          measure_type: { $regex: 'WATER', $options: 'i' },
        },
        '-_id measure_uuid measure_datetime measure_type has_confirmed image_url'
      );
    });

    it('should return the customer code with a list of water and gas measures if not specified', async () => {
      mockFind.mockResolvedValue(mockList_2);

      const result = listMeasuresService('1172285');

      await expect(result).resolves.toEqual({
        customer_code: '1172285',
        measures: mockList_2,
      });

      expect(mockFind).toHaveBeenCalledWith(
        {
          customer_code: '1172285',
          measure_type: { $regex: '', $options: 'i' },
        },
        '-_id measure_uuid measure_datetime measure_type has_confirmed image_url'
      );
    });
  });

  describe('when the input data is invalid', () => {
    it('should return INVALID_TYPE error when using type other than WATER or GAS', () => {
      const result = listMeasuresService('1172285', 'ENERGY');

      expect(result).rejects.toEqual({
        status_code: 400,
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });

      expect(mockFind).not.toHaveBeenCalled();
    });

    it('should return MEASURES_NOT_FOUND error if customer has no readings', async () => {
      mockFind.mockResolvedValue(mockList_3);

      const result = listMeasuresService('1172285');

      await expect(result).rejects.toEqual({
        status_code: 404,
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });

      expect(mockFind).toHaveBeenCalledWith(
        {
          customer_code: '1172285',
          measure_type: { $regex: '', $options: 'i' },
        },
        '-_id measure_uuid measure_datetime measure_type has_confirmed image_url'
      );
    });
  });
});
