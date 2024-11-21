import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PressableStateCallbackType } from 'react-native';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTextChildren(
  children: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode)
) {
  return Array.isArray(children)
    ? children.every((child) => typeof child === 'string')
    : typeof children === 'string';
}
