import * as React from 'react';

import {
    PaperProvider,
    MD3DarkTheme,
    MD3LightTheme,
    MD2DarkTheme,
    MD2LightTheme,
    MD2Theme,
    MD3Theme,
    useTheme,
    adaptNavigationTheme,
    configureFonts,
    DefaultTheme,
  } from 'react-native-paper';

  export const useExampleTheme = () => useTheme<typeof customTheme>();

  const customTheme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
        background: '#3187D8',
        // primary: "rgb(0, 97, 166)",
        // onPrimary: "rgb(255, 255, 255)",
        // primaryContainer: "rgb(210, 228, 255)",
        // onPrimaryContainer: "rgb(0, 28, 55)",
        // secondary: "rgb(0, 98, 161)",
        // onSecondary: "rgb(255, 255, 255)",
        // secondaryContainer: "rgb(208, 228, 255)",
        // onSecondaryContainer: "rgb(0, 29, 53)",
        // tertiary: "rgb(0, 106, 96)",
        // onTertiary: "rgb(255, 255, 255)",
        // tertiaryContainer: "rgb(105, 249, 230)",
        // onTertiaryContainer: "rgb(0, 32, 28)",
        // backdrop: "rgba(44, 49, 55, 0.4)"
    },
    // colors: {
    //     "primary": "rgb(0, 97, 166)",
    //     "onPrimary": "rgb(255, 255, 255)",
    //     "primaryContainer": "rgb(210, 228, 255)",
    //     "onPrimaryContainer": "rgb(0, 28, 55)",
    //     "secondary": "rgb(0, 98, 161)",
    //     "onSecondary": "rgb(255, 255, 255)",
    //     "secondaryContainer": "rgb(208, 228, 255)",
    //     "onSecondaryContainer": "rgb(0, 29, 53)",
    //     "tertiary": "rgb(0, 106, 96)",
    //     "onTertiary": "rgb(255, 255, 255)",
    //     "tertiaryContainer": "rgb(105, 249, 230)",
    //     "onTertiaryContainer": "rgb(0, 32, 28)",
    //     "error": "rgb(186, 26, 26)",
    //     "onError": "rgb(255, 255, 255)",
    //     "errorContainer": "rgb(255, 218, 214)",
    //     "onErrorContainer": "rgb(65, 0, 2)",
    //     "background": "rgb(253, 252, 255)",
    //     "onBackground": "rgb(26, 28, 30)",
    //     "surface": "rgb(253, 252, 255)",
    //     "onSurface": "rgb(26, 28, 30)",
    //     "surfaceVariant": "rgb(223, 226, 235)",
    //     "onSurfaceVariant": "rgb(67, 71, 78)",
    //     "outline": "rgb(115, 119, 127)",
    //     "outlineVariant": "rgb(195, 198, 207)",
    //     "shadow": "rgb(0, 0, 0)",
    //     "scrim": "rgb(0, 0, 0)",
    //     "inverseSurface": "rgb(47, 48, 51)",
    //     "inverseOnSurface": "rgb(241, 240, 244)",
    //     "inversePrimary": "rgb(160, 201, 255)",
    //     "elevation": {
    //     "level0": "transparent",
    //     "level1": "rgb(240, 244, 251)",
    //     "level2": "rgb(233, 240, 248)",
    //     "level3": "rgb(225, 235, 245)",
    //     "level4": "rgb(223, 233, 244)",
    //     "level5": "rgb(218, 230, 243)"
    //     },
    //     "surfaceDisabled": "rgba(26, 28, 30, 0.12)",
    //     "onSurfaceDisabled": "rgba(26, 28, 30, 0.38)",
    //     "backdrop": "rgba(44, 49, 55, 0.4)"
    // },
  };
  