import { useEthers, useContractCall } from "@usedapp/core"
import { constants, utils } from "ethers"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from "../chain-info/deployments/map.json"

export const useStakingBalance = (tokenAddress: String) => {
    const { account, chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId
        ? networkMapping[String(chainId)]["TokenFarm"][0]
        : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)

    const [stakingBalance] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmAddress,
        method: "stakingBalance",
        args: [tokenAddress, account],
    }) ?? []

    return stakingBalance
}
