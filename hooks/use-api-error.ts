import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

interface ApiErrorResponse {
    message: string | string[];
    error: string;
    statusCode: number;
}

export function useApiError() {
    const messages = useTranslations();
    const handleError = (error: unknown) => {
        let messageList: string[] = [];

        if (error instanceof AxiosError) {
            const errorResponse = error.response?.data as ApiErrorResponse;
            if (errorResponse?.message) {
                if (Array.isArray(errorResponse.message)) {
                    messageList = messageList.concat(errorResponse.message);
                } else {
                    messageList.push(errorResponse.message);
                }
            }
        } else if (error instanceof Error) {
            messageList.push(error.message);
        } else {
            messageList.push('An unknown error occurred');
        }

        messageList.forEach((message) => {
            toast.error(messages(message), {
                toastId: message,
            });
        });
    };

    return { handleError };
}
