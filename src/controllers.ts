import { NextFunction, Request, Response, Router } from 'express';

import uploadService from './services/uploadService.js';
import confirmationService from './services/confirmationService.js';
import listMeasuresService from './services/listMeasuresService.js';

const router = Router();

router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
  const uploadBody = req.body;

  try {
    const response = await uploadService(uploadBody);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.patch('/confirm', async (req: Request, res: Response, next: NextFunction) => {
  const confirmBody = req.body;

  try {
    const response = await confirmationService(confirmBody);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.get('/:customerId/list', async (req: Request, res: Response, next: NextFunction) => {
  const { customerId } = req.params;
  const { measure_type } = req.query;

  try {
    const measureList = await listMeasuresService(customerId, measure_type as string);

    res.status(200).json(measureList);
  } catch (err) {
    next(err);
  }
});

export default router;
