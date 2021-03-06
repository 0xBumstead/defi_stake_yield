/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />
import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import brownieConfig from "../brownie-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import bum from "../bum.png"
import eth from "../eth.png"
import fau from "../dai.png"
import { YourWallet } from "./yourWallet"
import { TokenFarmContract } from "./tokenFarmContract"
import { makeStyles } from "@material-ui/core"
import { textAlign } from "@mui/system"

export type Token = {
    image: string
    address: string
    name: string
}

const useStyles = makeStyles((theme) => ({
    titles: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4)
    }
}))

export const Main = () => {
    const classes = useStyles()
    const { chainId, error } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "development"
    let stringChainId = String(chainId)
    const bumTokenAddress = chainId ? networkMapping[stringChainId]["BumToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero

    const supportedTokens: Array<Token> = [
        {
            image: bum,
            address: bumTokenAddress,
            name: "BUM"
        },
        {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: fau,
            address: fauTokenAddress,
            name: "DAI"
        }
    ]

    return (<>
        <h2 className={classes.titles}>BUM Token App</h2>
        <YourWallet supportedTokens={supportedTokens} />
        <TokenFarmContract supportedTokens={supportedTokens} />
    </>
    )
}