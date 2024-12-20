//@ts-nocheck

import { validateBody } from '../../src/utils/validateBody';

const base64img =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMSSURBVEiJrZVdaJNnFMd/5+3bvH4kJiltTKhto25t2vnN0EkLs7Vz3ijCCmPQwS6qCOLVvHH40Qu9EhQRHETQu8FkSO+EblmT1o+a2fpVlZa5zrKKkUmsfbWpLn286BuNIV/FHTg3z3nO+b3P/znPeVFKUcgBH7AfuALEgJ+AdUXlFlHcBtwGVIbHgJr/A9CSpXjKzxXK1yhs1cA08BLA4/EMulyuISu2ulByMQBEZMrr9d4HcLvdCZ/P99wKNYhISd7kIiT6hlk5ZqxTJC1PyVT7oRIlgeSeLWV9D08F9BPf+gZEMNPi3nzJxQAWACX3xl+pX/qf3ThwPuaoqfHfB/6z4l98KKCxo6MjsnDpJhW87kz+2nNJRkdHNzQ0NFyz4rtFxJ0zu4D+20VkwjRNU2VYNBod4d09BOf8DpjV9t/m5uZwZvGUeTyeAd41wMa5Ao4CyZGRkbFcgM7Ozr60U9wC9KIAgAE8qaqqiuYqrpRS8Xh8AkikQb4vFtAOqGAw2J8PoJRSfr+/Pw0wCZQVA/gdeJFIJBKFAK2trWHen08b0mvlatM1IqIMwzAK9fDk5KRkLLnytilp07O7u/tOvq8Ph8N3DcP4K+MEK7NKBDiB48D03i/Le41SeSAiZldX141cgLq6uivA6wzA3lyAhxWL9OuHv1p8+dHpetV7aNnfwJSImKFQaCgboLKyMuqvsF0V4anPpf+x41NnD3ANKMkGMEM/LH/w6HS9SvnXn7l6ANXY2BjJLD48PDymaVps37aKvtT+0ZOBqXK7PgiEUm9CAxCRBcDCMofmSL+fY+3epnml8qfNZlOptfHx8VhbW1s4EAjYZ2ZmPKuWGG9zNEHbvMI+AdQDDgDditUAyYPnH9/dutZh3/yJo9Y5X1uka6Lv21bx5MiFns81TZtQShnAYssBqC63OQF+GzJv7zzzj336tXID25VS8fe6CNgC/AgMAK/K7frgrpayyPqP5kesy3sMRIGLwE3gKaDam9zhVdXzepn9Ge0nY1zkG3TfAT8DEWBrjn0nLdBZ4ONse94A2M/e2Ss17kAAAAAASUVORK5CYII=';

const uploadBody = {
  image: base64img,
  customer_code: '4413585',
  measurement_datetime: '2024-09-11',
  measurement_type: 'WATER',
};

const confirmBody = {
  measurement_uuid: '273fcba0-f422-4b36-9c42-1475be0432a0',
  confirmed_value: 50,
};

const invalidDataError = {
  status_code: 400,
  error_code: 'INVALID_DATA',
  error_description: 'Dados inválidos',
};

describe('validateBody', () => {
  describe('when the input data is valid', () => {
    describe('when validation occurs on body from UPLOAD route', () => {
      it('should return undefined with no errors', async () => {
        const result = validateBody('upload', uploadBody);

        expect(result).toBeUndefined();
      });
    });

    describe('when validation occurs on body from CONFIRM route', () => {
      it('should return undefined with no errors', async () => {
        const confirmBody = {
          measurement_uuid: '273fcba0-f422-4b36-9c42-1475be0432a0',
          confirmed_value: 50,
        };

        const result = validateBody('confirm', confirmBody);

        expect(result).toBeUndefined();
      });
    });
  });

  describe('when the input data is invalid', () => {
    describe('when validation fails on body from UPLOAD route', () => {
      describe('should return INVALID_DATA error', () => {
        it('when inserting an invalid base64 string', () => {
          uploadBody.image = 'invalidBase64';
          invalidDataError.error_description = 'Insira uma imagem no formato base64';

          expect.assertions(1);

          try {
            validateBody('upload', uploadBody);
          } catch (err) {
            expect(err).toEqual(invalidDataError);
          }
        });

        it('when not inserting a string in customer_code', () => {
          uploadBody.image = base64img;
          uploadBody.customer_code = 123;
          invalidDataError.error_description = 'Código de cliente deve ser uma string';

          expect.assertions(1);

          try {
            validateBody('upload', uploadBody);
          } catch (err) {
            expect(err).toEqual(invalidDataError);
          }
        });

        it('when not inserting a YYYY-MM-DD format string', () => {
          uploadBody.customer_code = '44133585';
          uploadBody.measurement_datetime = '2024/03/12';
          invalidDataError.error_description = 'Data deve estar no formato YYYY-MM-DD';

          expect.assertions(1);

          try {
            validateBody('upload', uploadBody);
          } catch (err) {
            expect(err).toEqual(invalidDataError);
          }
        });

        it('when not inserting a string formatted date', () => {
          uploadBody.measurement_datetime = 2024 - 12 - 11;
          invalidDataError.error_description = 'Data deve ser em string';

          expect.assertions(1);

          try {
            validateBody('upload', uploadBody);
          } catch (err) {
            expect(err).toEqual(invalidDataError);
          }
        });

        it('when inserting a type different from GAS or WATER', () => {
          uploadBody.measurement_datetime = '2024-09-11';
          uploadBody.measurement_type = 'ENERGY';
          invalidDataError.error_description = 'Insira o tipo da medida como sendo WATER ou GAS';

          expect.assertions(1);

          try {
            validateBody('upload', uploadBody);
          } catch (err) {
            expect(err).toEqual(invalidDataError);
          }
        });
      });
    });

    describe('when validation fails on body from CONFIRM route', () => {
      describe('should return INVALID_DATA error', () => {
        it('when inserting an invalid UUID string', () => {
          confirmBody.measurement_uuid = 'invalidUUID';
          invalidDataError.error_description = 'UUID informado é inválido';

          expect.assertions(1);

          try {
            validateBody('confirm', confirmBody);
          } catch (err) {
            expect(err).toEqual(invalidDataError);
          }
        });

        it('when not inserting a UUID string in measurement_uuid', () => {
          confirmBody.measurement_uuid = 32424;
          invalidDataError.error_description = 'UUID deve ser uma string';

          expect.assertions(1);

          try {
            validateBody('confirm', confirmBody);
          } catch (err) {
            expect(err).toEqual(invalidDataError);
          }
        });

        it('when confirmed_value is not an integer', () => {
          confirmBody.measurement_uuid = '273fcba0-f422-4b36-9c42-1475be0432a0';
          confirmBody.confirmed_value = 123.2;
          invalidDataError.error_description = 'Valor da medida deve ser um número inteiro';

          expect.assertions(1);

          try {
            validateBody('confirm', confirmBody);
          } catch (err) {
            expect(err).toEqual(invalidDataError);
          }
        });
      });
    });
  });
});
