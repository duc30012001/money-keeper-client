'use client';

import LocaleSelect from '@/components/locale-select';
import AppForm from '@/components/ui/form/app-form';
import { AppRoute } from '@/enums/routes';
import { useApiError } from '@/hooks/use-api-error';
import { Link } from '@/i18n/navigation';
import { authApi } from '@/modules/auth/api/auth.api';
import { Button, Input, theme } from 'antd';
import { signIn } from 'next-auth/react';
import { Locale, useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface FormValues {
    email: string;
    password: string;
    locale: Locale;
}

export default function RegisterPage() {
    const { handleError } = useApiError();

    const messages = useTranslations();
    const locale = useLocale();
    const { token } = theme.useToken();

    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    useEffect(() => {
        if (error) {
            toast(decodeURIComponent(error), {
                type: 'error',
            });
        }
    }, [error]);

    const onFinish = async (values: FormValues) => {
        setIsLoading(true);
        try {
            await authApi.register(values);

            const result = await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: true,
                callbackUrl: `${AppRoute.DASHBOARD}`,
            });

            if (result?.error) {
                handleError(result.error);
            }
        } catch (error: any) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8 space-y-2 text-center">
                <h1
                    className="text-center text-2xl font-semibold"
                    style={{
                        color: token.colorText,
                    }}
                >
                    {messages('auth.register.title')}
                </h1>
                <p
                    className="text-sm text-gray-400"
                    style={{
                        color: token.colorTextTertiary,
                    }}
                >
                    {messages('auth.register.description')}
                </p>
            </div>

            <AppForm
                size="large"
                layout="vertical"
                onFinish={onFinish}
                disabled={isLoading}
                initialValues={{
                    locale,
                }}
            >
                <AppForm.Item
                    label={messages('user.email')}
                    name={'email'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            type: 'email',
                            message: messages('validation.emailFormat'),
                        },
                        {
                            min: 5,
                            message: messages('validation.stringMin', {
                                field: messages('user.email'),
                                min: 5,
                            }),
                        },
                        {
                            max: 50,
                            message: messages('validation.stringMax', {
                                field: messages('user.email'),
                                max: 50,
                            }),
                        },
                    ]}
                >
                    <Input />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('user.password')}
                    name={'password'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            min: 5,
                            message: messages('validation.stringMin', {
                                field: messages('user.password'),
                                min: 5,
                            }),
                        },
                        {
                            max: 50,
                            message: messages('validation.stringMax', {
                                field: messages('user.password'),
                                max: 50,
                            }),
                        },
                    ]}
                >
                    <Input.Password />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('language.title')}
                    name={'locale'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                    tooltip={messages('language.tooltip')}
                >
                    <LocaleSelect />
                </AppForm.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}
                >
                    {messages('auth.register.submit')}
                </Button>
                <p
                    className="!mt-5 text-center text-sm"
                    style={{
                        color: token.colorText,
                    }}
                >
                    {messages('auth.alreadyHaveAccount')}{' '}
                    <Link
                        className="ml-1 whitespace-nowrap font-semibold hover:underline"
                        href={AppRoute.SIGN_IN}
                    >
                        {messages('auth.signIn.submit')}
                    </Link>
                </p>
            </AppForm>
        </div>
    );
}
