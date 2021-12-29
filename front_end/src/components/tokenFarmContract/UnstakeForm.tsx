import React, { useEffect, useState } from "react"
import { Button, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useNotifications } from "@usedapp/core"
import { Token } from "../Main"
import { useUnstakeTokens } from "../../hooks"

export interface UnstakeFormProps {
    token: Token
}

export const UnstakeForm = ({ token }: UnstakeFormProps) => {
    const { address: tokenAddress, name } = token
    const { notifications } = useNotifications()

    const { send: unstake, state: unstakeState } = useUnstakeTokens()
    const handleUnstakeSubmit = () => {
        return unstake(tokenAddress)
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
                <Button onClick={handleUnstakeSubmit} color="primary" size="large" disabled={isMining}>
                    {isMining ? <CircularProgress size={26} /> : "Unstake All"}
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