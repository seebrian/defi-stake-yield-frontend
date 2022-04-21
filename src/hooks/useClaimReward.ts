import { useEffect, useState } from "react"
import { useContractFunction, useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import Erc20 from "../chain-info/contracts/dependencies/smartcontractkit/chainlink-brownie-contracts@0.2.1/ERC20.json"
import { utils, constants } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"

/**
 * Expose { send, state } object to facilitate unstaking the user's tokens from the TokenFarm contract
 */
export const useClaimReward = () => {
    const { chainId } = useEthers()

    const { abi } = TokenFarm
    const tokenFarmContractAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero

    const tokenFarmInterface = new utils.Interface(abi)

    const tokenFarmContract = new Contract(
        tokenFarmContractAddress,
        tokenFarmInterface
    )

    return useContractFunction(tokenFarmContract, "getRewardTokens", {
        transactionName: "getRewardTokens",
    })
}
