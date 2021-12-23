import { formatUnits } from "@ethersproject/units";
import { Button } from "@material-ui/core";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { Token } from "../Main";

export interface StakeFormProps {
    token: Token
}

export const StakeForm = ({ token }: StakeFormProps) => {
    const { address: tokenAddress, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    return (
        <>
            <Button color="primary" size="large">Stake</Button>
        </>
    )
}