'use client';

import AppLogo from '@/components/app-logo';
import { AppRoute } from '@/enums/routes';
import { Link } from '@/i18n/navigation';
import HomeSlider from '@/modules/home/components/slider';
import { contactLinks, faqs, features } from '@/modules/home/data';
import { Button, Collapse, ConfigProvider, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
    ReactCompareSlider,
    ReactCompareSliderImage,
} from 'react-compare-slider';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-coverflow';

export default function HomePage() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                components: {
                    Segmented: {
                        itemSelectedBg: 'var(--thm-bdr-color)',
                        trackBg: 'var(--thm-body-bg)',
                        itemHoverBg: 'var(--thm-bdr-color)',
                    },
                },
            }}
        >
            <main className="body-bg-color space-y-20 overflow-hidden px-4 text-white lg:space-y-40">
                <div className="body-bg-color fixed left-0 right-0 top-0 z-10 px-4">
                    <nav className="section flex items-center justify-between py-4">
                        <AppLogo />
                        <div className="flex items-center justify-between gap-2">
                            {/* <AppLocale buttonProps={{ type: 'text' }} /> */}
                            <Link
                                href={AppRoute.REGISTER}
                                className="hidden md:block"
                            >
                                <Button type="text">
                                    {messages('auth.register.submit')}
                                </Button>
                            </Link>
                            <Link href={AppRoute.SIGN_IN}>
                                <Button type="primary">
                                    {messages('auth.signIn.submit')}
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>

                <div
                    id="hero"
                    className="section flex flex-col items-center justify-center pt-20 text-center lg:pt-0"
                >
                    <h1 className="text-2xl font-bold capitalize md:text-4xl xl:text-5xl">
                        Know where your{' '}
                        <span className="text-orange-500">money</span> goes
                    </h1>
                    <p className="mb-5 mt-2 text-lg text-[var(--thm-gray)]">
                        Track, plan, and master your finances with ease
                    </p>
                    <Link href={AppRoute.REGISTER}>
                        <Button type="primary" size="large">
                            Get started for free
                        </Button>
                    </Link>

                    <div className="compare-theme__img-box mx-auto mt-10 w-full max-w-screen-lg">
                        <ReactCompareSlider
                            className="rounded-lg"
                            style={{
                                border: '1px solid var(--thm-bdr-color)',
                            }}
                            boundsPadding={0}
                            itemOne={
                                <ReactCompareSliderImage
                                    alt="Light theme"
                                    src="/images/demo/dashboard-light.png"
                                />
                            }
                            itemTwo={
                                <ReactCompareSliderImage
                                    alt="Dark theme"
                                    src="/images/demo/dashboard-dark.png"
                                />
                            }
                            keyboardIncrement="5%"
                            position={50}
                        />
                        <div className="compare-theme-shape-1 float-bob-x"></div>
                        <div className="compare-theme-shape-2 float-bob-y"></div>
                        <div className="compare-theme-shape-3 float-bob-x"></div>
                    </div>
                </div>

                <div id="features" className="section">
                    <div className="section-title text-center">
                        <div className="section-title__tagline-box">
                            <span className="section-title__tagline">
                                Core Features
                            </span>
                        </div>
                        <h2 className="section-title__title">
                            Everything You Need to Manage Your Money
                        </h2>
                    </div>
                    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((item, index) => (
                            <li key={index}>
                                <div className="case-one__single">
                                    <div className="case-one__shape-1"></div>
                                    <div className="case-one__icon">
                                        <Image
                                            src={item.icon}
                                            alt=""
                                            width={50}
                                            height={50}
                                            className="size-9 lg:size-12"
                                        />
                                    </div>
                                    <h5 className="case-one__title">
                                        {item.title}
                                    </h5>
                                    <p className="case-one__text">
                                        {item.description}
                                    </p>
                                    <div className="case-one__btn-box">
                                        <Link
                                            href={AppRoute.REGISTER}
                                            className="case-one__btn"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <HomeSlider />

                <div id="features" className="section">
                    <div className="section-title text-center">
                        <div className="section-title__tagline-box">
                            <span className="section-title__tagline">
                                Have a question?
                            </span>
                        </div>
                        <h2 className="section-title__title">
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <Collapse
                        accordion
                        size="large"
                        bordered={false}
                        style={{ background: 'transparent' }}
                        items={faqs.map((item) => ({
                            label: item.question,
                            children: (
                                <p className="text-[var(--thm-gray)]">
                                    {item.answer}
                                </p>
                            ),
                            style: {
                                marginBottom: 20,
                                background: 'var(--thm-main-bg)',
                                borderRadius: token.borderRadiusLG,
                                border: '1px solid var(--thm-bdr-color)',
                            },
                        }))}
                    />
                </div>

                <footer className="section flex flex-col items-center justify-between py-5 lg:flex-row">
                    <p className="text-center text-[var(--thm-gray)]">
                        Copyright © {dayjs().get('year')}. All Rights Reserved.
                    </p>
                    <ul className="flex gap-1">
                        {contactLinks.map((item, index) => (
                            <li
                                key={index}
                                className="h-fit rounded-full p-1.5 hover:bg-zinc-700"
                            >
                                <a
                                    href={item.href}
                                    title={item.title}
                                    className="size-6"
                                    target="_blank"
                                >
                                    <Image
                                        width={30}
                                        height={30}
                                        src={item.icon}
                                        alt={item.title}
                                        className="h-full w-full"
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>
                </footer>
            </main>
        </ConfigProvider>
    );
}
