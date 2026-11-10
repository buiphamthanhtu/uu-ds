import { useContext } from 'react';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

const ZERO = { top: 0, right: 0, bottom: 0, left: 0 };

/** Inset safe area nếu app có `SafeAreaProvider` (Expo Router có sẵn); không có thì 0, không văng lỗi. */
export const useSafeAreaInsetsOptional = () => useContext(SafeAreaInsetsContext) ?? ZERO;
