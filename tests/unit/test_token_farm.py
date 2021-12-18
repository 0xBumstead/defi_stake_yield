from functools import total_ordering
from brownie import TokenFarm, network, exceptions
from scripts.helpful_scripts import (
    DECIMALS,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    STARTING_PRICE,
    get_account,
    get_contract,
)
from scripts.deploy import KEPT_BALANCE, deploy_token_farm_and_bum_token
import pytest


def test_set_price_feed_contract():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, bum_token = deploy_token_farm_and_bum_token()
    # Act
    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        bum_token.address, price_feed_address, {"from": account}
    )
    # Assert
    assert token_farm.tokenPriceFeedMapping(bum_token.address) == price_feed_address
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(
            bum_token.address, price_feed_address, {"from": non_owner}
        )


def test_stake_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, bum_token = deploy_token_farm_and_bum_token()
    # Act
    bum_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, bum_token.address, {"from": account})
    # Assert
    assert (
        token_farm.stakingBalance(bum_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokensStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    return token_farm, bum_token


def test_issue_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, bum_token = test_stake_tokens(amount_staked)
    starting_balance = bum_token.balanceOf(account.address)
    # Act
    token_farm.issueTokens({"from": account})
    # Assert
    # we are staking 1 dapp_token == in price to 1 ETH
    # soo... we should get 2,000 dapp tokens in reward
    # since the price of eth is $2,000
    assert bum_token.balanceOf(account.address) == starting_balance + STARTING_PRICE


def test_get_user_total_value(amount_staked, randomERC20):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, bum_token = test_stake_tokens(amount_staked)
    # Act
    token_farm.addAllowedTokens(randomERC20.address, {"from": account})
    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        randomERC20.address, price_feed_address, {"from": account}
    )
    random_ERC20_stake_amount = amount_staked * 3
    randomERC20.approve(
        token_farm.address, random_ERC20_stake_amount, {"from": account}
    )
    token_farm.stakeTokens(
        random_ERC20_stake_amount, randomERC20.address, {"from": account}
    )
    # Assert
    total_value = token_farm.getUserTotalValue(account.address)
    assert total_value == STARTING_PRICE * (3 + 1)


def test_get_token_value():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    # Act
    token_farm, bum_token = deploy_token_farm_and_bum_token()
    # Assert
    assert token_farm.getTokenValue(bum_token.address) == (STARTING_PRICE, DECIMALS)


def test_unstake_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, bum_token = test_stake_tokens(amount_staked)
    # Act
    token_farm.unstakeTokens(bum_token.address, {"from": account})
    # Assert
    assert bum_token.balanceOf(account.address) == KEPT_BALANCE
    assert token_farm.stakingBalance(bum_token.address, account.address) == 0
    assert token_farm.uniqueTokensStaked(account.address) == 0


def test_add_allowed_tokens():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, bum_token = deploy_token_farm_and_bum_token()
    # Act
    token_farm.addAllowedTokens(bum_token.address, {"from": account})
    # Assert
    assert token_farm.allowedTokens(0) == bum_token.address
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.addAllowedTokens(bum_token.address, {"from": non_owner})
