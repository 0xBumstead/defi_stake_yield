import { useEffect, useState } from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"

export const useUnstakeTokens = (tokenAddress: string) => {
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId
        ? networkMapping[String(chainId)]["TokenFarm"][0]
        : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const unstake = (amount: string) => {
        return unstakeSend(amount, tokenAddress)
    }

    const { send: unstakeSend, state: unstakeState } =
        useContractFunction(tokenFarmContract, "unstakeTokens", {
            transactionName: "Unstake Tokens",
        })

    return { unstake, unstakeState }
}