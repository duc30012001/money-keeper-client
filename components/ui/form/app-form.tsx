import { cn } from '@/lib/utils';
import { Button, ButtonProps, Form, FormProps } from 'antd';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

const FORM_LAYOUT: FormProps = {
    labelCol: { xs: 9, md: 8, lg: 7, xl: 6 },
    wrapperCol: { xs: 15, md: 16, lg: 17, xl: 18 },
    colon: false,
    labelAlign: 'left',
};

const FORM_LAYOUT_VERTICAL: FormProps = {
    labelCol: { xs: 24, md: 24, lg: 24 },
    wrapperCol: { xs: 24, md: 24, lg: 24 },
    colon: false,
    labelAlign: 'left',
};

export interface AppFormProps extends FormProps {
    children?: ReactNode;
    submitText?: ReactNode;
    submitProps?: ButtonProps & {
        rootClassName?: string;
    };
}

type AppFormComponent = React.FC<AppFormProps> & {
    useForm: typeof Form.useForm;
    useFormInstance: typeof Form.useFormInstance;
    useWatch: typeof Form.useWatch;
    Item: typeof Form.Item;
    List: typeof Form.List;
    ErrorList: typeof Form.ErrorList;
    Provider: typeof Form.Provider;
};

const AppForm: AppFormComponent = ({
    children,
    submitText,
    submitProps,
    ...props
}) => {
    const t = useTranslations();
    const layout =
        props.layout === 'vertical' ? FORM_LAYOUT_VERTICAL : FORM_LAYOUT;

    return (
        <Form
            requiredMark={(label, info) => (
                <div className="font-medium">
                    {label}{' '}
                    {info.required && <span className="text-red-500">*</span>}
                </div>
            )}
            {...layout}
            {...props}
        >
            {children}

            {!(submitProps?.hidden || true) && (
                <div
                    className={cn(
                        'flex justify-end',
                        submitProps?.rootClassName
                    )}
                >
                    <Button type="primary" htmlType="submit" {...submitProps}>
                        {submitText ??
                            submitProps?.children ??
                            t('common.submit')}
                    </Button>
                </div>
            )}
        </Form>
    );
};

// re-export all the Form statics
AppForm.useForm = Form.useForm;
AppForm.useFormInstance = Form.useFormInstance;
AppForm.useWatch = Form.useWatch;
AppForm.Item = Form.Item;
AppForm.List = Form.List;
AppForm.ErrorList = Form.ErrorList;
AppForm.Provider = Form.Provider;

export default AppForm;
