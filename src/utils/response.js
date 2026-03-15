export function success(data) {
  return {
    success: true,
    data,
  };
}

export function failure(error, statusCode = 500) {
  return {
    success: false,
    error: typeof error === 'string' ? error : error.message || 'Internal server error',
    statusCode,
  };
}

