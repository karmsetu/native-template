import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/utils';

export default function TabTwoScreen() {
    const colorScheme = useColorScheme();

    return (
        <SafeAreaView
            className={cn(
                'flex justify-center items-center w-full h-full',
                colorScheme === 'dark' ? 'bg-slate-900' : 'bg-slate-200'
            )}
        >
            <View className="flex flex-row justify-center">
                <Text
                    className={cn(
                        'font-semibold  text-center',
                        colorScheme === 'dark'
                            ? 'color-white'
                            : 'color-slate-950'
                    )}
                >
                    Start By changing the files in app directory
                </Text>
            </View>
        </SafeAreaView>
    );
}
