import React, { useState, useEffect } from "react"
import {
    Button,
    CircularProgress,
    Snackbar,
    makeStyles,
} from "@material-ui/core"
import { Token } from "../Main"
import { useUnstakeTokens, useStakingBalance, useClaimBalance, useClaimReward } from "../../hooks"
import Alert from "@material-ui/lab/Alert"
import { useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { BalanceMsg } from "../../components"
import { useEthers } from "@usedapp/core"
import { constants } from "ethers"
import networkMapping from "../../chain-info/deployments/map.json"
import no_icon from "../../no_icon.png"
export interface UnstakeFormProps {
    token: Token
}

const useStyles = makeStyles((theme) => ({
    contentContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: theme.spacing(2)
    },
}))

export const Claim = ({ token }: UnstakeFormProps) => {
    const { image, address: tokenAddress, name } = token
    const { chainId, error } = useEthers()
    const happyTokenAddress = chainId ? networkMapping[String(chainId)]["HappyToken"][0] : constants.AddressZero

    const rewardToken = {
        image: no_icon,
        address: happyTokenAddress,
        name: "HAPPY",
    }
    const { notifications } = useNotifications()

    const balance = useClaimBalance(tokenAddress)

    const formattedBalance: number = balance
        ? parseFloat(formatUnits(balance, 18))
        : 0

    const { send: claimRewardSend, state: claimRewardState } =
        useClaimReward()

    const handleUnstakeSubmit = () => {
        return claimRewardSend(tokenAddress)
    }

    const [showUnstakeSuccess, setShowUnstakeSuccess] = useState(false)

    const handleCloseSnack = () => {
        showUnstakeSuccess && setShowUnstakeSuccess(false)
    }

    useEffect(() => {
        if (
            notifications.filter(
                (notification) =>
                    notification.type === "transactionSucceed" &&
                    notification.transactionName === "Get Reward Tokens"
            ).length > 0
        ) {
            !showUnstakeSuccess && setShowUnstakeSuccess(true)
        }
    }, [notifications, showUnstakeSuccess])

    const isMining = claimRewardState.status === "Mining"


    const classes = useStyles()

    return (
        <>
            <div className={classes.contentContainer}>
                <BalanceMsg
                    label={`Unclaim Reward ${rewardToken.name} balance`}
                    amount={formattedBalance}
                    tokenImgSrc={rewardToken.image}
                />
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    onClick={handleUnstakeSubmit}
                    disabled={isMining}
                >
                    {isMining ? <CircularProgress size={26} /> : `Claim  ${rewardToken.name}`}
                </Button>
            </div>
            <Snackbar
                open={showUnstakeSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    Tokens Claim successfully!
                </Alert>
            </Snackbar>
        </>
    )
}
