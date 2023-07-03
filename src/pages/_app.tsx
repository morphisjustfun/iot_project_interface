import '../styles/global.css';
import type {AppProps} from "next/app";
import {createTheme, NextUIProvider, Text, Container, Switch, useTheme, Spacer} from "@nextui-org/react";
import {useTheme as useNextTheme, ThemeProvider as NextThemeProvider} from 'next-themes';

import {QueryClient, QueryClientProvider} from "react-query";

// 2. Call `createTheme` and pass your custom values
const themeLight = createTheme({
    type: "light", // it could be "light" or "dark"
    theme: {
        colors: {
            // brand colors
            primaryLight: '$green200',
            primaryLightHover: '$green300',
            primaryLightActive: '$green400',
            primaryLightContrast: '$green600',
            primary: '#4ADE7B',
            primaryBorder: '$green500',
            primaryBorderHover: '$green600',
            primarySolidHover: '$green700',
            primarySolidContrast: '$white',
            primaryShadow: '$green500',
            gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
            link: '#5E1DAD',

            // you can also create your own color
            myColor: '#ff4ecd'

            // ...  more colors
        },
        space: {},
        fonts: {}
    }
})


const themeDark = createTheme({
    type: "dark", // it could be "light" or "dark"
    theme: {
        colors: {
            // brand colors
            primaryLight: '$green200',
            primaryLightHover: '$green300',
            primaryLightActive: '$green400',
            primaryLightContrast: '$green600',
            primary: '#4ADE7B',
            primaryBorder: '$green500',
            primaryBorderHover: '$green600',
            primarySolidHover: '$green700',
            primarySolidContrast: '$white',
            primaryShadow: '$green500',
            gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
            link: '#5E1DAD',

            // you can also create your own color
            myColor: '#ff4ecd'

            // ...  more colors
        },
        space: {},
        fonts: {}
    }
})

function MyApp({Component, pageProps}: AppProps) {
    const queryClient = new QueryClient();

    return (
        // 2. Use at the root of your app
        <NextThemeProvider
            defaultTheme="system"
            attribute="class"
            value={{
                light: themeLight.className,
                dark: themeDark.className
            }}
        >
            <NextUIProvider>
                {/*dark theme toggle*/}
                <Container css={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "1rem",
                }}>
                    <SwitchControl/>
                </Container>
                <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                </QueryClientProvider>
            </NextUIProvider>
        </NextThemeProvider>
    );
}

const SwitchControl = () => {
    const {setTheme} = useNextTheme();
    const {isDark, type} = useTheme();

    return (
        <>
            <Text> Dark Mode </Text>
            <Spacer x={1}/>
            <Switch
                checked={isDark}
                onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}/>
        </>
    );
}

export default MyApp;