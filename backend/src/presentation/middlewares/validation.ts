import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validatePaymentApproval = [
  body('paymentId')
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage('Payment ID is required'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validatePaymentCompletion = [
  body('paymentId')
    .isString()
    .notEmpty()
    .trim()
    .escape(),
  
  body('txid')
    .isString()
    .notEmpty()
    .isLength({ min: 64, max: 64 })
    .withMessage('Invalid transaction ID'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
