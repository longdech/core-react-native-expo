import { ReactNode } from 'react';
import { View as RNView, ViewProps as RNViewProps } from 'react-native';

import { cn } from '@/utils/tailwind';

interface ViewProps extends Omit<RNViewProps, 'children' | 'className'> {
  children: ReactNode;
  className?: string;
}

export const View = ({ children, className, ...props }: ViewProps) => {
  return (
    <RNView className={cn('flex-1 bg-background', className)} {...props}>
      {children}
    </RNView>
  );
};
