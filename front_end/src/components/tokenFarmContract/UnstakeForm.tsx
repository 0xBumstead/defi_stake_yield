import React, { useEffect, useState } from "react"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useNotifications } from "@usedapp/core"
import { Token } from "../Main"
import { useUnstakeTokens } from "../../hooks"
import { utils } from "ethers"

export interface UnstakeFormProps {
    token: Token
}

export const UnstakeForm = ({ token }: UnstakeFormProps) => {
    const { address: tokenAddress, name } = token
    const { notifications } = useNotifications()

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
    }

    const { unstake, unstakeState } = useUnstakeTokens(tokenAddress)
    const handleUnstakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return unstake(amountAsWei.toString())
    }

    const isMining = unstakeState.status === "Mining"
    const [showUnstakeTokenSuccess, setUnstakeTokenSuccess] = useState(false)
    const handleCloseSnack = () => {
        setUnstakeTokenSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Unstake Tokens").length > 0) {
            setUnstakeTokenSuccess(true)
        }
    }, [notifications, showUnstakeTokenSuccess])

    return (
        <>
            <div>
                <Input onChange={handleInputChange} />
                <Button onClick={handleUnstakeSubmit} color="primary" size="large" disabled={isMining}>
                    {isMining ? <CircularProgress size={26} /> : "Unstake"}
                </Button>
            </div>
            <Snackbar open={showUnstakeTokenSuccess} autoHideDuration={5000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Token unstaked!
                </Alert>
            </Snackbar>
        </>
    )
}