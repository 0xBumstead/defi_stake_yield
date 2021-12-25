import { ChainId, DAppProvider } from "@usedapp/core"
import { Header } from "./components/Header"
import { Container } from "@material-ui/core"
import { Main } from "./components/Main"
import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

const ColorModeContext = React.createContext({ toggleColorMode: () => { } })

function MyApp() {
  const theme = useTheme()
  const colorMode = React.useContext(ColorModeContext)
  return (
    <Box
      sx={{
        display: 'block',
        width: '100%',
        height: 650,
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 1,
        p: 3,
      }}
    >
      {theme.palette.mode} mode
      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <DAppProvider config={{ supportedChains: [ChainId.Kovan] }}>
        <Header />
        <Container maxWidth="md">
          <Main />
        </Container>
      </DAppProvider>
    </Box>
  );
}

function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <MyApp />
      </ThemeProvider>
    </ColorModeContext.Provider>

  )
}

export default App
