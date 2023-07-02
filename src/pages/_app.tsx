import '../styles/global.css';
import type {AppProps} from "next/app";
import {createTheme, NextUIProvider, Text} from "@nextui-org/react"

// 2. Call `createTheme` and pass your custom values
const theme = createTheme({
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
    return (
        // 2. Use at the root of your app
        <NextUIProvider theme={theme}>
            <Component {...pageProps} />
        </NextUIProvider>
    );
}

export default MyApp;