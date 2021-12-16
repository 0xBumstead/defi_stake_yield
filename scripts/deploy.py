from scripts.helpful_scripts import get_account, get_contract
from web3 import Web3
from brownie import BumToken, TokenFarm, config, network

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_bum_token():
    account = get_account()
    bum_token = BumToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        bum_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    tx = bum_token.transfer(
        token_farm.address, bum_token.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    tx.wait(1)
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_of_allowed_tokens = {
        bum_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }
    add_allowed_tokens(token_farm, dict_of_allowed_tokens, account)


def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account):
    pass


def main():
    deploy_token_farm_and_bum_token()
