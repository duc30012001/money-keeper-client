import {
    imagesDesktopDark,
    imagesDesktopLight,
    imagesMobileDark,
    imagesMobileLight,
} from '@/modules/home/data';
import { Segmented } from 'antd';
import { useResponsive } from 'antd-style';
import Image from 'next/image';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ThemeMode } from '@/enums/common';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {};

export enum ResponsiveMode {
    DESKTOP = 'desktop',
    MOBILE = 'mobile',
}

function HomeSlider({}: Props) {
    const responsive = useResponsive();
    const messages = useTranslations();

    const [mode, setMode] = useState({
        responsive: ResponsiveMode.DESKTOP,
        theme: ThemeMode.LIGHT,
    });

    const options = {
        [ResponsiveMode.DESKTOP + ThemeMode.LIGHT]: imagesDesktopLight,
        [ResponsiveMode.DESKTOP + ThemeMode.DARK]: imagesDesktopDark,
        [ResponsiveMode.MOBILE + ThemeMode.LIGHT]: imagesMobileLight,
        [ResponsiveMode.MOBILE + ThemeMode.DARK]: imagesMobileDark,
    };
    const images = options[mode.responsive + mode.theme];

    const getSlidesPerView = (value: ResponsiveMode) => {
        if (value === ResponsiveMode.MOBILE) {
            if (responsive.desktop) return 3;
            if (responsive.laptop) return 3;
            if (responsive.tablet) return 2;
        }
        return 1;
    };

    useEffect(() => {
        setMode((prev) => ({
            ...prev,
            responsive: responsive.desktop
                ? ResponsiveMode.DESKTOP
                : ResponsiveMode.MOBILE,
        }));
    }, [responsive.desktop]);

    return (
        <div id="features" className="section">
            <div className="section-title text-center">
                <div className="section-title__tagline-box">
                    <span className="section-title__tagline">
                        Beautiful & Easy to Use
                    </span>
                </div>
                <h2 className="section-title__title">
                    A modern interface that feels natural and effortless.
                </h2>
            </div>
            <div className="case-one__single !p-3 lg:!p-6">
                <div className="mb-5 flex flex-col items-center justify-center gap-3 md:flex-row">
                    <Segmented
                        options={[
                            {
                                value: ThemeMode.LIGHT,
                                label: messages('setting.appearance.light'),
                            },
                            {
                                value: ThemeMode.DARK,
                                label: messages('setting.appearance.dark'),
                            },
                        ]}
                        value={mode.theme}
                        onChange={(value) => setMode({ ...mode, theme: value })}
                    />
                    <Segmented
                        options={[
                            {
                                value: ResponsiveMode.DESKTOP,
                                label: 'Desktop',
                            },
                            {
                                value: ResponsiveMode.MOBILE,
                                label: 'Mobile',
                            },
                        ]}
                        value={mode.responsive}
                        onChange={(value) =>
                            setMode({ ...mode, responsive: value })
                        }
                    />
                </div>

                <Swiper
                    key={mode.responsive + mode.theme}
                    slidesPerView={getSlidesPerView(mode.responsive)}
                    spaceBetween={20}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    navigation
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                >
                    {images.map((item, index) => (
                        <SwiperSlide key={index} className={cn('rounded-lg')}>
                            <div
                                className={cn('overflow-hidden rounded-lg', {
                                    'aspect-auto max-h-[32rem]':
                                        mode.responsive ===
                                        ResponsiveMode.DESKTOP,
                                    'aspect-[9/16] max-w-80':
                                        mode.responsive ===
                                        ResponsiveMode.MOBILE,
                                })}
                            >
                                <Image
                                    src={item}
                                    alt={`Slider ${index + 1}`}
                                    width={1000}
                                    height={500}
                                    className="h-auto w-full"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default HomeSlider;
