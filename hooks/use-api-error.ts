import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ApiErrorResponse {
    message: string | string[];
    error: string;
    statusCode: number;
}

export function useApiError() {
    const handleError = (error: unknown) => {
        if (error instanceof AxiosError) {
            const errorResponse = error.response?.data as ApiErrorResponse;
            if (errorResponse?.message) {
                if (Array.isArray(errorResponse.message)) {
                    // Show multiple toasts for array messages
                    errorResponse.message.forEach((message: string) => {
                        toast.error(message, {
                            toastId: message,
                        });
                    });
                    return;
                }
                // Single message
                toast.error(errorResponse.message, {
                    toastId: errorResponse.message,
                });
                return;
            }
        }

        // Handle other error types
        const message =
            error instanceof Error
                ? error.message
                : 'An unknown error occurred';
        toast.error(message, {
            toastId: message,
        });
    };

    return { handleError };
}
