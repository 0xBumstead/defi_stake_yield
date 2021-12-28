import { formatUnits } from "@ethersproject/units"
import { Token } from "../Main"
import { BalanceMsg } from "../BalanceMsg"
import { useStakingBalance } from "../../hooks"

export interface StakedBalanceProps {
    token: Token
}

export const StakedBalance = ({ token }: StakedBalanceProps) => {
    const { image, address, name } = token
    const stakedBalance = useStakingBalance(address)
    const formattedTokenBalance: number = stakedBalance ? parseFloat(formatUnits(stakedBalance, 18)) : 0

    return (<BalanceMsg
        label={`Staked ${name} : `}
        tokenImgSrc={image}
        amount={formattedTokenBalance} />
    )
}