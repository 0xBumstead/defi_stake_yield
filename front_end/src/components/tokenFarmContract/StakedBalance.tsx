import { useEthers } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Token } from "../Main"
import { BalanceMsg } from "../BalanceMsg"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import TokenFarm from "../../chain-info/contracts/TokenFarm.json"

export interface StakedBalanceProps {
    token: Token
}

export const StakedBalance = ({ token }: StakedBalanceProps) => {
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId
        ? networkMapping[String(chainId)]["TokenFarm"][0]
        : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const { image, address, name } = token
    const { account } = useEthers()
    const stakedBalance = 0  // lire stakingBalance mapping de tokenfarm
    const formattedTokenBalance: number = stakedBalance ? parseFloat(formatUnits(stakedBalance, 18)) : 0
    return (<BalanceMsg
        label={`Staked ${name} : `}
        tokenImgSrc={image}
        amount={formattedTokenBalance} />
    )
}