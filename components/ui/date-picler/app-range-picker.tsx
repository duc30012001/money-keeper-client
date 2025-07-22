import { DateFormat } from '@/enums/common';
import { cn } from '@/lib/utils';
import { DatePicker, TimeRangePickerProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear'; // ES 2015
import { useTranslations } from 'next-intl';

dayjs.extend(quarterOfYear);

type Props = {} & RangePickerProps;

function AppRangePicker({ ...props }: Props) {
    const messages = useTranslations();

    const rangePresets: TimeRangePickerProps['presets'] = [
        {
            label: messages('transaction.dateFilter.lastNDay', { day: 7 }),
            value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
            label: messages('transaction.dateFilter.lastNDay', { day: 30 }),
            value: [dayjs().add(-30, 'd'), dayjs()],
        },
        {
            label: messages('transaction.dateFilter.lastNDay', { day: 90 }),
            value: [dayjs().add(-90, 'd'), dayjs()],
        },
        {
            label: messages('transaction.dateFilter.thisMonth'),
            value: [dayjs().startOf('month'), dayjs().endOf('month')],
        },
        {
            label: messages('transaction.dateFilter.lastMonth'),
            value: [
                dayjs().add(-1, 'month').startOf('month'),
                dayjs().add(-1, 'month').endOf('month'),
            ],
        },
        {
            label: messages('transaction.dateFilter.thisQuarter'),
            value: [dayjs().startOf('quarter'), dayjs().endOf('quarter')],
        },
        {
            label: messages('transaction.dateFilter.lastQuarter'),
            value: [
                dayjs().add(-1, 'quarter').startOf('quarter'),
                dayjs().add(-1, 'quarter').endOf('quarter'),
            ],
        },
        {
            label: messages('transaction.dateFilter.thisYear'),
            value: [dayjs().startOf('year'), dayjs().endOf('year')],
        },
        {
            label: messages('transaction.dateFilter.lastYear'),
            value: [
                dayjs().add(-1, 'year').startOf('year'),
                dayjs().add(-1, 'year').endOf('year'),
            ],
        },
    ];

    return (
        <DatePicker.RangePicker
            presets={rangePresets}
            format={DateFormat.DATE}
            allowClear={false}
            {...props}
            className={cn('w-full', props.className)}
        />
    );
}

export default AppRangePicker;
