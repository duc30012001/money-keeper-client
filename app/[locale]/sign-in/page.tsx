'use client';

import AppLocale from '@/components/app-locale';
import AppLogo from '@/components/app-logo';
import { AppRoute } from '@/enums/routes';
import { Link } from '@/i18n/navigation';
import { Button, Form, Input } from 'antd';
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

                        <Form
                            size="large"
                            layout="vertical"
                            requiredMark={(label, info) => (
                                <div>
                                    {label}{' '}
                                    {info.required && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </div>
                            )}
                            onFinish={onFinish}
                            disabled={isLoading}
                        >
                            <Form.Item
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
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label={messages('user.password')}
                                name={'password'}
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
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
                        </Form>
                    </div>
                </div>
                <div className="fixed right-10 top-10">
                    <AppLocale
                        buttonProps={{
                            type: 'text',
                            block: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
