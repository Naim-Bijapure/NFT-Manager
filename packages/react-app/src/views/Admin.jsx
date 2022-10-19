import { useEventListener } from "eth-hooks/events/";

import { Button, Steps, Modal, Input, Upload, message, Card, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { ethers } from "ethers";
import React, { useState } from "react";
import { useEffect } from "react";
import EtherInput from "../components/EtherInput";

function NftCard({ address, tokenId, yourNFT, NFTManager }) {
  const [tokenMarketData, setTokenMarketData] = useState();
  const [isAvailableOnMarket, setIsAvailableOnMarket] = useState(false);
  const [approvedAddress, setApprovedAddress] = useState(ethers.constants.AddressZero);
  const [ownerOfToken, setOwnerOfToken] = useState("");

  const onLoadTokenMarketDetails = async () => {
    const marketItemData = await NFTManager.getLatestMarketItemByTokenId(tokenId);
    //     if (marketItemData[1] && marketItemData[0]["canceled"] === false) {
    if (marketItemData[1]) {
      setTokenMarketData(marketItemData[0]);
      setIsAvailableOnMarket(marketItemData[1]);

      const approvedAddr = await yourNFT.getApproved(tokenId);
      if (approvedAddress !== approvedAddr) {
        setApprovedAddress(approvedAddr);
      }
    }

    const ownerAddress = await yourNFT.ownerOf(tokenId);
    setOwnerOfToken(ownerAddress);
  };

  useEffect(() => {
    void onLoadTokenMarketDetails();
  }, []);

  //   console.log("n-tokenMarketData: ", tokenMarketData);

  const addToMarket = async () => {
    const tx = await NFTManager.createMarketItem(yourNFT.address, tokenId, ethers.utils.parseEther("1"), {
      value: ethers.utils.parseEther("0.05"),
    });
    const rcpt = await tx.wait();
    console.log("n-rcpt: ", rcpt);
    window.location.reload();
  };

  const removeFromMarket = async () => {
    let marketId = tokenMarketData["marketItemId"].toString();
    console.log("n-marketId: ", marketId);
    const tx = await NFTManager.cancelMarketItem(yourNFT.address, marketId);
    const rcpt = await tx.wait();
    console.log("n-rcpt: ", rcpt);
    window.location.reload();
  };

  const onApprove = async () => {
    const tx = await yourNFT.approve(NFTManager.address, tokenId);
    const rcpt = await tx.wait();
    window.location.reload();
  };

  const onTest = async () => {
    //     console.log("n-tokenMarketData: ", ethers.utils.formatEther(tokenMarketData["price"].toString()));
    console.log("n-tokenMarketData: ", tokenMarketData);
    //     console.log("n-tokenMarketData:sold ", tokenMarketData["sold"]);

    //     const approved = await yourNFT.getApproved(tokenId);
    //     console.log("n-approved: ", approved);
  };

  const isNFTSold = tokenMarketData
    ? tokenMarketData["sold"] === false &&
      tokenMarketData["creator"] === address &&
      (tokenMarketData["owner"] !== address || tokenMarketData["seller"] !== address)
    : false;

  //   console.log("n-isNFTSold: ", isNFTSold);

  return (
    <div>
      <Card
        size="small"
        title="NFT name"
        extra={
          isAvailableOnMarket ? (
            <>
              {tokenMarketData["listed"] && tokenMarketData["seller"] === address && (
                <Button type="primary" danger ghost onClick={removeFromMarket}>
                  Remove from market
                </Button>
              )}

              {tokenMarketData["owner"] === address && approvedAddress !== NFTManager.address && (
                <Button type="primary" ghost onClick={onApprove}>
                  Approve NFTManager
                </Button>
              )}

              {tokenMarketData["listed"] === false &&
                tokenMarketData["owner"] === address &&
                approvedAddress === NFTManager.address && (
                  <Button type="primary" ghost onClick={addToMarket}>
                    Add to market
                  </Button>
                )}
            </>
          ) : (
            <Button type="primary" ghost onClick={addToMarket}>
              Add to market
            </Button>
          )
        }
        style={{ width: 300 }}
      >
        <Image preview={false} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
        <p>this is nft description</p>
        <p className="text-xl">
          {tokenMarketData && ethers.utils.formatEther(tokenMarketData["price"].toString())} Eth
        </p>
        {tokenMarketData && (
          <p>
            {ownerOfToken !== address && tokenMarketData["seller"] !== address ? (
              <div className="text-green-600">Sold</div>
            ) : (
              <>{tokenMarketData["sold"] === false && <div className="text-blue-700">Listed on marketplace</div>}</>
            )}
          </p>
        )}

        {/* <Button onClick={onTest}>test</Button> */}
      </Card>
    </div>
  );
}

function Admin({ address, readContracts, writeContracts, localProvider, userSigner }) {
  const yourNFT = writeContracts["YourNFT"];
  const NFTmanager = writeContracts["NFTManager"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nftData, setNftData] = useState({ name: "", description: "", image: "" });
  const [userTokens, setUserTokens] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onMint = async () => {
    console.log("n-nftData", nftData);
    const tx = await yourNFT.mint("http://cool.com", 500);
    const rcpt = await tx.wait();
    console.log("rcpt: ", rcpt);
    setIsModalOpen(false);
    window.location.reload();
  };

  const loadUserNFTs = async () => {
    let userTokens = [];
    const userOwnedTokens = await yourNFT?.getUserOwnedTokens();
    userTokens = [...userOwnedTokens.map(tokenId => +tokenId.toString())];

    const userCreatedTokens = await yourNFT?.getUserCreatedToken();

    if (userCreatedTokens) {
      userTokens = [...new Set([...userTokens, ...userCreatedTokens.map(tokenId => +tokenId.toString())])];
    }

    const sellingMarketItems = await NFTmanager.fetchSellingMarketItems();
    console.log("n-sellingMarketItems: ", sellingMarketItems);
    const sellingTokenIds = sellingMarketItems.map(data => +data["tokenId"].toString());
    console.log("n-sellingTokenIds: ", sellingTokenIds);

    if (sellingTokenIds.length > 0) {
      userTokens = [...new Set([...userTokens, ...sellingTokenIds])];
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
      <Button type="primary" onClick={showModal}>
        Mint NFT
      </Button>
      {/* mint nft modal */}
      <Modal
        title="Mint an NFT"
        visible={isModalOpen}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onMint}
            disabled={nftData.name === "" || nftData.description === ""}
          >
            Mint
          </Button>,
        ]}
      >
        {/* nft name */}
        <div className="m-1">
          <Input
            placeholder="Enter nft name"
            onChange={event => {
              setNftData({ ...nftData, name: event.target.value });
            }}
          />
        </div>
        <div className="m-1">
          <Input.TextArea
            placeholder="Enter nft description"
            className="m-1"
            rows={4}
            onChange={event => {
              setNftData({ ...nftData, description: event.target.value });
            }}
          />
        </div>
        {/* nft image or upload */}

        <div className="m-1">
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload image to IPFS</Button>
          </Upload>
        </div>

        <div className="m-1">
          <EtherInput placeholder="Enter royalty amount in eth" />
        </div>
      </Modal>

      {/* your nft list */}
      <h1 className="text-xl mt-2">Your NFT's</h1>
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

export default Admin;
