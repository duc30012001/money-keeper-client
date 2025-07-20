'use client';

import AppLocale from '@/components/app-locale';
import AppLogo from '@/components/app-logo';
import AppForm from '@/components/ui/form/app-form';
import { AppRoute } from '@/enums/routes';
import { Link } from '@/i18n/navigation';
import { Button, Input } from 'antd';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface FormValues {
    email: string;
    password: string;
}

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false);
    const messages = useTranslations();

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
            const result = await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: true,
                callbackUrl: `${AppRoute.DASHBOARD}`,
            });

            if (result?.error) {
                // The error message is now the server's error message
                toast(result.error, {
                    type: 'error',
                });
            }
        } catch (error: any) {
            // Handle any unexpected errors
            toast(error?.message || 'An error occurred during login', {
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50">
            <div
                className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center px-4 py-6"
                style={{
                    backgroundImage: 'url(/images/bg-auth0-signin.svg)',
                }}
            >
                <div className="w-full max-w-[400px]">
                    <div className="mb-8">
                        <AppLogo className="mx-auto" />
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
                        <div className="mb-10 text-center">
                            <h1 className="text-center text-2xl font-semibold text-slate-900">
                                {messages('auth.signIn.title')}
                            </h1>
                            <p className="text-sm text-gray-400">
                                {messages('auth.signIn.description')}
                            </p>
                        </div>

                        <AppForm
                            size="large"
                            layout="vertical"
                            onFinish={onFinish}
                            disabled={isLoading}
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
                                        message: messages(
                                            'validation.emailFormat'
                                        ),
                                    },
                                    {
                                        min: 5,
                                        message: messages(
                                            'validation.stringMin',
                                            {
                                                field: messages('user.email'),
                                                min: 5,
                                            }
                                        ),
                                    },
                                    {
                                        max: 50,
                                        message: messages(
                                            'validation.stringMax',
                                            {
                                                field: messages('user.email'),
                                                max: 50,
                                            }
                                        ),
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
                                        message: messages(
                                            'validation.stringMin',
                                            {
                                                field: messages(
                                                    'user.password'
                                                ),
                                                min: 5,
                                            }
                                        ),
                                    },
                                    {
                                        max: 50,
                                        message: messages(
                                            'validation.stringMax',
                                            {
                                                field: messages(
                                                    'user.password'
                                                ),
                                                max: 50,
                                            }
                                        ),
                                    },
                                ]}
                            >
                                <Input.Password />
                            </AppForm.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={isLoading}
                            >
                                {messages('auth.signIn.submit')}
                            </Button>
                            <p className="!mt-6 text-center text-sm text-slate-900">
                                {messages('auth.dontHaveAccount')}{' '}
                                <Link
                                    className="ml-1 whitespace-nowrap font-semibold hover:underline"
                                    href={AppRoute.REGISTER}
                                >
                                    {messages('auth.registerHere')}
                                </Link>
                            </p>
                        </AppForm>
                    </div>
                </div>
                <div className="fixed right-10 top-10">
                    <AppLocale buttonProps={{ type: 'text' }} />
                </div>
            </div>
        </div>
    );
}
