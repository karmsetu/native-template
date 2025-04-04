import { View, Text, useColorScheme } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/utils';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    return (
        <SafeAreaView
            className={cn(
                'w-full h-full  flex justify-center items-center',
                colorScheme === 'dark' ? 'bg-slate-900' : 'bg-slate-200'
            )}
        >
            <View className="flex flex-row justify-center">
                <Text
                    className={cn(
                        'font-bold  text-xl',
                        colorScheme === 'dark'
                            ? 'color-white'
                            : 'color-slate-950'
                    )}
                >
                    Hello
                </Text>
                <HelloWave />
            </View>
        </SafeAreaView>
    );
}
