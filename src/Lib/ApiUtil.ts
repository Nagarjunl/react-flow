
import { toast } from "react-toastify";


export const showErrorToast = (message: string) => {
  const toastId = `error-${message}`;
  if (!toast.isActive(toastId)) {
    toast.error(message, { toastId });
  }
};


export const showSuccessToast = (message: string) => {
  const toastId = `success-${message}`;
  if (!toast.isActive(toastId)) {
    toast.success(message, { toastId });
  }
};


export const formatErrorMessage = (error: any): string => {
  if (error?.data?.errors) {
    const errors = error.data.errors;
    return Object.keys(errors)
      .map(key => errors[key].join("\n"))
      .join("\n");
  }

  const errorData = error?.data;
  const errorStatus = error?.status;

  if (errorData?.message) return errorData.message;
  if (errorData?.title) {
    const detail = errorData?.detail;
    return `${errorData.title}${detail ? ". Details: " + detail.split('\n').slice(0, 3).join('\n') + (detail.split('\n').length > 3 ? '\n...' : '') : ''}`;
  }

  switch (errorStatus) {
    case 401: return "Unauthorized access (401)";
    case 403: return "Forbidden access (403)";
    case 404: return "Resource not found (404)";
    default:
      return errorStatus >= 500
        ? `Server error (${errorStatus})`
        : "Unknown error occurred";
  }
};


export const dataWithMeta = <T, M>(response: T, meta: M) => {
  const pagination = (meta as any).response?.headers?.get('pagination');
  if (pagination) {
    const parsedPagination = JSON.parse(pagination);
    return {
      items: response,
      metaData: parsedPagination
    };
  }
  return {
    items: response,
    metaData: {}
  };
};