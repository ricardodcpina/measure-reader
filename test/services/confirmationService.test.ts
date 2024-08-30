const mockFindOne = jest.fn();
const mockUpdateOne = jest.fn();

const mockModels = {
  MeasureModel: {
    findOne: mockFindOne,
    updateOne: mockUpdateOne,
  },
};

jest.mock('../../src/models', () => mockModels);

import confirmationService from '../../src/services/confirmationService';

describe('confirmationService', () => {
  describe('when the input data is valid', () => {
    it('should return a success message after updating the has_confirmed field of specified measure', async () => {
      mockFindOne.mockResolvedValue({ has_confirmed: false });

      const result = confirmationService({
        measure_uuid: '273fcba0-f422-4b36-9c42-1475be0432a0',
        confirmed_value: 50,
      });

      await expect(result).resolves.toEqual({
        success: true,
      });

      expect(mockFindOne).toHaveBeenCalledWith({
        measure_uuid: '273fcba0-f422-4b36-9c42-1475be0432a0',
      });

      expect(mockUpdateOne).toHaveBeenCalledWith(
        { measure_uuid: '273fcba0-f422-4b36-9c42-1475be0432a0' },
        { measure_value: 50, has_confirmed: true }
      );
    });
  });

  describe('when the input data is invalid', () => {
    it('should return MEASURE_NOT_FOUND error when providing an unexisting measure uuid', async () => {
      mockFindOne.mockResolvedValue(null);

      const result = confirmationService({
        measure_uuid: '273fcba0-f422-4b36-9c42-1422be0432a0',
        confirmed_value: 50,
      });

      await expect(result).rejects.toEqual({
        status_code: 404,
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      });

      expect(mockFindOne).toHaveBeenCalledWith({
        measure_uuid: '273fcba0-f422-4b36-9c42-1422be0432a0',
      });

      expect(mockUpdateOne).not.toHaveBeenCalled();
    });

    it('should return CONFIRMATION_DUPLICATE error when providing measure has already been confirmed', async () => {
      mockFindOne.mockResolvedValue({ has_confirmed: true });

      const result = confirmationService({
        measure_uuid: '273fcba0-f422-4b36-9c42-1422be0432a0',
        confirmed_value: 50,
      });

      await expect(result).rejects.toEqual({
        status_code: 409,
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já confirmada',
      });

      expect(mockFindOne).toHaveBeenCalledWith({
        measure_uuid: '273fcba0-f422-4b36-9c42-1422be0432a0',
      });

      expect(mockUpdateOne).not.toHaveBeenCalled();
    });
  });
});
