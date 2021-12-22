import { Token } from "../Main"
import { Box } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

interface YourWalletProps {
    supportedTokens: Array<Token>
}

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    return (
        <Box>
            <h1>Your Wallet !</h1>
            <Box>

            </Box>
        </Box>
    )
}