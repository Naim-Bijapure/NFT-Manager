import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/";

import { ethers } from "ethers";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, message, Steps } from "antd";
import hardhatContracts from "../contracts/hardhat_contracts.json";

const { Step } = Steps;

const steps = [
  {
    title: "First",
    content: "First-content",
  },
  {
    title: "Second",
    content: "Second-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
];
/**
royalti calculation : 
to get value from fraction
eth value /10000 (fraction) *  ( new numerator value)
1/10000 * 500 = 0.05

to get fraction from value
0.05*10000 = 500

*/

function Admin({ yourLocalBalance, readContracts, writeContracts, localProvider, userSigner }) {
  const [current, setCurrent] = useState(0);

  //   const purpose = useContractReader(readContracts, "YourNFT", "purpose");
  const yourNFT = writeContracts["YourNFT"];
  const NFTmanager = writeContracts["NFTManager"];

  // 📟 Listen for broadcast events
  const MarketItemCreated = useEventListener(readContracts, "NFTManager", "MarketItemCreated", localProvider, 1);
  // console.log(
  //   "n-MarketItemCreated: ",
  //   MarketItemCreated.length > 0 && MarketItemCreated[0]["args"]["marketItemId"].toString(),
  // );
  console.log("n-MarketItemCreated: ", MarketItemCreated.length > 0 && MarketItemCreated);

  const mintNFT = async () => {
    const yourNFT = writeContracts["YourNFT"];

    const tx = await yourNFT.mint("http://cool.com");
    const rcpt = await tx.wait();
    console.log("rcpt: ", rcpt);
  };

  const getUserOwnedTokens = async () => {
    const userOwnedTokens = await yourNFT.getUserOwnedTokens();
    console.log("n-userOwnedTokens: ", userOwnedTokens);
  };

  const getUserCreatedTokens = async () => {
    const userCreatedTokens = await yourNFT.getUserCreatedToken();
    console.log("n-userCreatedTokens: ", userCreatedTokens);
  };

  const getUserTokenById = async () => {
    const createdAddress = await yourNFT.getUserTokenById(0);
    console.log("n-createdAddress: ", createdAddress);

    const ownerAddress = await yourNFT.ownerOf(0);
    console.log("n-ownerAddress: ", ownerAddress);
  };

  const setRoyalty = async () => {
    const tx = await yourNFT.setTokenRoyalty(0, "0x0fAb64624733a7020D332203568754EB1a37DB89", 500);
    const rcpt = await tx.wait();
    console.log("rcpt: ", rcpt);
  };

  const getRoyaltyInfo = async () => {
    const royaltiInfo = await yourNFT.royaltyInfo(0, ethers.utils.parseEther("1"));
    console.log("n-royaltiInfo: ", royaltiInfo);
    const royalitPrice = royaltiInfo[1].toString();
    console.log("n-royalitPrice: ", ethers.utils.formatEther(royalitPrice));
  };

  const getTokens = async () => {
    const yourNFT = writeContracts["YourNFT"];
    // const balance = await yourNFT.balanceOf("0x0fAb64624733a7020D332203568754EB1a37DB89");
    // console.log("balance: ", balance.toString());

    const userTokens = await yourNFT.getTokens("0x0fAb64624733a7020D332203568754EB1a37DB89");
    console.log("userTokens: ", userTokens.length);

    const tokenURI = await yourNFT.tokenURI(0);
    console.log("tokenURI: ", tokenURI);

    // royaltyInfo
    const royaltiInfo = await yourNFT.royaltyInfo(0, ethers.utils.parseEther("1"));
    console.log("n-royaltiInfo: ", royaltiInfo);
    const royalitPrice = royaltiInfo[1].toString();
    console.log("n-royalitPrice: ", ethers.utils.formatEther(royalitPrice));

    const ownerOf = await yourNFT.ownerOf(0);
    console.log("n-ownerOf: ", ownerOf);
  };

  const transferNFT = async () => {
    const tx = await yourNFT.transferFrom(
      "0x0fAb64624733a7020D332203568754EB1a37DB89",
      "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
      0,
    );
    const rcpt = await tx.wait();
    console.log("rcpt: ", rcpt);
  };

  const approveForAll = async () => {
    const tx = await yourNFT.setApprovalForAll("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", true);
    const rcpt = await tx.wait();
    console.log("rcpt: ", rcpt);
  };

  // market methods

  const createMarketItem = async () => {
    // console.log('n-ethers.utils.parseEther("0.05"): ', ethers.utils.parseEther("0.05").toString());
    const tx = await NFTmanager.createMarketItem(yourNFT.address, 0, ethers.utils.parseEther("1"), 500, {
      value: ethers.utils.parseEther("0.05"),
    });
    const rcpt = await tx.wait();
    console.log("n-rcpt: ", rcpt);
  };

  const cancleMarketItem = async () => {
    const tx = await NFTmanager.cancelMarketItem(yourNFT.address, 0);
    const rcpt = await tx.wait();
    console.log("n-rcpt: ", rcpt);
  };

  const getLatestMarketItemByTokenId = async () => {
    const marketItemData = await NFTmanager.getLatestMarketItemByTokenId(0);
    console.log("n-marketItemData: ", marketItemData);
    // console.log("n-marketItemData: ", ethers.utils.formatEther(marketItemData[0]["price"].toString()));
  };

  const createSale = async () => {
    const tx = await NFTmanager.createMarketSale(yourNFT.address, 1, {
      value: ethers.utils.parseEther("1.05"),
    });
    const rcpt = await tx.wait();
    console.log("n-rcpt: ", rcpt);
  };

  const fetchAvailableMarketItems = async () => {
    const availableMarketItems = await NFTmanager.fetchAvailableMarketItems();
    console.log("n-availableMarketItems: ", availableMarketItems);
  };

  const fetchSellingMarketItems = async () => {
    const sellingMarketItems = await NFTmanager.fetchSellingMarketItems();
    console.log("n-sellingMarketItems: ", sellingMarketItems);
  };

  const onApprove = async () => {
    const tx = await yourNFT.approve(NFTmanager.address, 0);
    const rcpt = await tx.wait();

    const approved = await yourNFT.getApproved(0);
    console.log("n-approved: ", approved);
  };

  const onTest = async () => {
    const tx = await yourNFT.approve(NFTmanager.address, 0);
    const rcpt = await tx.wait();

    const approved = await yourNFT.getApproved(0);
    console.log("n-approved: ", approved);
  };

  return (
    <div className="m-10 flex flex-col items-center">
      {/* <Button onClick={onTest} className="m-1">
        test
      </Button> */}
      <div>User mint</div>
      <Button onClick={mintNFT} className="m-1">
        Mint nft
      </Button>
      <Button onClick={setRoyalty} className="m-1">
        set Royalty
      </Button>
      <Button onClick={getRoyaltyInfo} className="m-1">
        Royalty info
      </Button>
      <Button onClick={getUserOwnedTokens} className="m-1">
        get user owned Tokens
      </Button>
      <Button onClick={getUserCreatedTokens} className="m-1">
        get user created Tokens
      </Button>
      <Button onClick={getUserTokenById} className="m-1">
        get user token by id
      </Button>
      <br />
      <div>----------------------------------------------</div>
      <div>NFT manager</div>
      <Button onClick={onApprove} className="m-1">
        Approve contract
      </Button>
      <Button onClick={createMarketItem} className="m-1">
        add to market
      </Button>
      <Button onClick={cancleMarketItem} className="m-1">
        cancle nft from market
      </Button>
      <Button onClick={getLatestMarketItemByTokenId} className="m-1">
        market item info by token id
      </Button>
      <Button onClick={createSale} className="m-1">
        buy nft
      </Button>
      <Button onClick={fetchAvailableMarketItems} className="m-1">
        fetch available market items
      </Button>
      <Button onClick={fetchSellingMarketItems} className="m-1">
        fetch selling market items
      </Button>
    </div>
  );
}

export default Admin;
