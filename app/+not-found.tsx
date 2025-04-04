import { cn } from '@/utils';
import { Link, Stack } from 'expo-router';
import { Text, useColorScheme, View } from 'react-native';

export default function NotFoundScreen() {
    const colorScheme = useColorScheme();

    return (
        <>
            <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
            <View
                className={cn(
                    'w-full h-full justify-center items-center ',
                    colorScheme === 'dark' ? 'bg-slate-900' : 'bg-slate-200'
                )}
            >
                <Text
                    className={cn(
                        'font-semibold  text-center',
                        colorScheme === 'dark'
                            ? 'color-white'
                            : 'color-slate-950'
                    )}
                >
                    This screen doesn't exist.
                </Text>
                <Link
                    href="/"
                    className={cn(
                        'font-semibold  text-center underline mt-15 pt-15',
                        colorScheme === 'dark'
                            ? 'color-white'
                            : 'color-slate-950'
                    )}
                >
                    <Text className="">Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
}
