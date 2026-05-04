import { useEffect, useRef, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { responsiveValue } from '@/lib/responsive';

type ResponsiveArgs<T> = Parameters<typeof responsiveValue<T>>[0];

/**
 * Reactive responsive value — cập nhật khi xoay màn hình / đổi kích thước cửa sổ.
 * Dùng ref để listener luôn thấy `values` mới nhất mà không đăng ký lại subscription mỗi render.
 */
export const useResponsiveValue = <T>(values: ResponsiveArgs<T>): T => {
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const [value, setValue] = useState(() => responsiveValue(values));

  useEffect(() => {
    setValue(responsiveValue(valuesRef.current));
  }, [values]);

  useEffect(() => {
    const onChange = ({ window: _window }: { window: ScaledSize }) => {
      setValue(responsiveValue(valuesRef.current));
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription.remove();
  }, []);

  return value;
};
