import { useEventListener } from "eth-hooks/events/";

import { Button, Steps, Modal, Input, Upload, message, Card, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { ethers } from "ethers";
import React, { useState } from "react";
import { useEffect } from "react";
import EtherInput from "../components/EtherInput";

function NftCard({ address, tokenId, yourNFT, NFTManager }) {
  const [tokenMarketData, setTokenMarketData] = useState();
  const [nftInfo, setNftInfo] = useState();

  const onLoadTokenMarketDetails = async () => {
    const marketItemData = await NFTManager.getLatestMarketItemByTokenId(tokenId);
    //     if (marketItemData[1] && marketItemData[0]["canceled"] === false) {
    if (marketItemData[1]) {
      setTokenMarketData(marketItemData[0]);
    }

    const tokenURI = await yourNFT.tokenURI(tokenId);
    console.log("n-tokenURI: ", tokenURI);

    let nftData = await fetch(tokenURI);
    nftData = await nftData.json();
    console.log("n-nftData: ", nftData);
    setNftInfo(nftData);
  };

  useEffect(() => {
    void onLoadTokenMarketDetails();
  }, []);

  const onTest = async () => {
    console.log("n-tokenMarketData: ", tokenMarketData);

    //     const approved = await yourNFT.getApproved(tokenId);
    //     console.log("n-approved: ", approved);
  };

  const onBuyNFT = async () => {
    let marketId = tokenMarketData["marketItemId"].toString();
    const tx = await NFTManager.createMarketSale(yourNFT.address, marketId, {
      value: ethers.utils.parseEther("1.05"),
    });
    const rcpt = await tx.wait();
    console.log("n-rcpt: ", rcpt);
    window.location.reload();
  };

  return (
    <div>
      <Card size="small" title={nftInfo?.name} style={{ width: 300 }}>
        <Image preview={false} src={nftInfo?.image} />
        <p>{nftInfo?.description}</p>
        <p className="text-xl">
          {tokenMarketData && ethers.utils.formatEther(tokenMarketData["price"].toString())} Eth
        </p>

        <p className="text-sm text-gray-400">
          <span className="">Royalty:</span>
          {nftInfo && nftInfo["royalty"]} Eth
        </p>
        <Button type="primary" onClick={onBuyNFT}>
          Buy NFT
        </Button>

        {/* <Button onClick={onTest}>test</Button> */}
      </Card>
    </div>
  );
}

function MarketPlace({ address, readContracts, writeContracts, localProvider, userSigner }) {
  const yourNFT = writeContracts["YourNFT"];
  const NFTmanager = writeContracts["NFTManager"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nftData, setNftData] = useState({ name: "", description: "", image: "" });
  const [userTokens, setUserTokens] = useState([]);

  const loadUserNFTs = async () => {
    let userTokens = [];
    //     const userOwnedTokens = await yourNFT?.getUserOwnedTokens();
    //     userTokens = [...userOwnedTokens.map(tokenId => +tokenId.toString())];

    //     const userCreatedTokens = await yourNFT?.getUserCreatedToken();

    //     if (userCreatedTokens) {
    //       userTokens = [...new Set([...userTokens, ...userCreatedTokens.map(tokenId => +tokenId.toString())])];
    //     }

    const availableMarketItems = await NFTmanager.fetchAvailableMarketItems();
    const availableTokenIds = availableMarketItems.map(data => +data["tokenId"].toString());
    console.log("n-availableTokenIds: ", availableTokenIds);

    if (availableTokenIds.length > 0) {
      userTokens = [...new Set([...userTokens, ...availableTokenIds])];
    }

    setUserTokens(userTokens.sort());
  };

  useEffect(() => {
    if (yourNFT) {
      void loadUserNFTs();
    }
  }, [yourNFT]);

  //   console.log("n-userTokens: ", userTokens);

  return (
    <div className="m-2 flex flex-col items-center">
      {/* your nft list */}
      <h1 className="text-xl mt-2">Market place NFT's</h1>
      <div className="flex flex-wrap justify-center ">
        {yourNFT &&
          NFTmanager &&
          userTokens.map(tokenId => (
            <div key={tokenId} className="m-5">
              <NftCard address={address} tokenId={tokenId} yourNFT={yourNFT} NFTManager={NFTmanager} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default MarketPlace;
