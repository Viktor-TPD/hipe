/**
 * Creates a success response object
 *
 * @param {Object} data The data to return
 * @param {string} message Optional success message
 * @param {Object} meta Optional metadata
 * @returns {Object} Formatted success response
 */
export const successResponse = (data, message = null, meta = {}) => {
  return {
    success: true,
    message: message,
    data: data,
    ...meta,
  };
};

export const errorResponse = (message, statusCode = 500, details = null) => {
  return {
    success: false,
    message: message,
    error: {
      code: statusCode,
      details: details,
    },
  };
};

export const responseHandler = (req, res, next) => {
  // Helper for success responses
  res.sendSuccess = (data, message = null, statusCode = 200, meta = {}) => {
    return res.status(statusCode).json(successResponse(data, message, meta));
  };

  // Helper for error responses
  res.sendError = (message, statusCode = 500, details = null) => {
    return res
      .status(statusCode)
      .json(errorResponse(message, statusCode, details));
  };

  // Helper for 404 responses
  res.notFound = (message = "Resource not found") => {
    return res.status(404).json(errorResponse(message, 404));
  };

  // Helper for validation errors
  res.validationError = (errors) => {
    return res
      .status(422)
      .json(errorResponse("Validation failed", 422, errors));
  };

  next();
};
