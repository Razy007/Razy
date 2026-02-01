import { body, param, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Common validation middleware that checks for errors
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: (err as any).path,
        message: err.msg
      }))
    });
  };
};

// ===== SOCIAL VALIDATIONS =====
export const validateCreatePost = [
  body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be between 1 and 2000 characters')
    .escape()
];

export const validateAddComment = [
  param('postId')
    .isInt({ min: 1 })
    .withMessage('Invalid post ID'),
  body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
    .escape(),
  body('parentId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Invalid parent comment ID')
];

export const validatePostId = [
  param('postId')
    .isInt({ min: 1 })
    .withMessage('Invalid post ID')
];

export const validateCommentId = [
  param('commentId')
    .isInt({ min: 1 })
    .withMessage('Invalid comment ID')
];

// ===== EDUCATION VALIDATIONS =====
export const validateUpdateProgress = [
  body('layerId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Layer ID is required')
    .isLength({ max: 100 })
    .escape(),
  body('courseId')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .escape(),
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100')
];

export const validateSubmitQuiz = [
  body('score')
    .isInt({ min: 0 })
    .withMessage('Score must be a positive integer'),
  body('totalQuestions')
    .isInt({ min: 1, max: 20 })
    .withMessage('Total questions must be between 1 and 20')
];

// ===== REFERRAL VALIDATIONS =====
export const validateReferralCode = [
  body('referralCode')
    .isString()
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Invalid referral code format')
    .matches(/^[A-Z0-9-]+$/i)
    .withMessage('Referral code can only contain letters, numbers, and hyphens')
];

// ===== STAKING VALIDATIONS =====
export const validateCreateStake = [
  body('amount')
    .isFloat({ min: 0.0001 })
    .withMessage('Amount must be at least 0.0001'),
  body('duration')
    .isInt({ min: 7, max: 365 })
    .withMessage('Duration must be between 7 and 365 days')
];

export const validateStakingId = [
  param('stakingId')
    .isInt({ min: 1 })
    .withMessage('Invalid staking ID')
];

// ===== ECONOMY VALIDATIONS =====
export const validatePurchase = [
  body('itemId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Item ID is required')
    .escape(),
  body('cost')
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
  body('credibilityScore')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Credibility score must be a positive integer')
];

// ===== USER VALIDATIONS =====
export const validateUserId = [
  param('userId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('User ID is required')
];

export const validateEnergyConsume = [
  body('amount')
    .isInt({ min: 1, max: 100 })
    .withMessage('Amount must be between 1 and 100')
];
