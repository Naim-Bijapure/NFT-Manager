// import { Web3Storage } from "web3.storage";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

import { Button, Steps, Modal, Input, Upload, message, Card, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { ethers } from "ethers";
import React, { useState } from "react";
import { useEffect } from "react";
import EtherInput from "../components/EtherInput";

const client = new Web3Storage({
  token: process.env.REACT_APP_WEB3_STORAGE_API,
});

function NftCard({ address, tokenId, yourNFT, NFTManager }) {
  const [tokenMarketData, setTokenMarketData] = useState();
  const [isAvailableOnMarket, setIsAvailableOnMarket] = useState(false);
  const [approvedAddress, setApprovedAddress] = useState(ethers.constants.AddressZero);
  const [ownerOfToken, setOwnerOfToken] = useState("");
  const [nftInfo, setNftInfo] = useState();

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

    // let data = await fetch(`https://ipfs.io/ipfs/${ipfsCid}/nft.json`);
    // data = await data.json();

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

  return (
    <div>
      <Card
        size="small"
        title={nftInfo?.name}
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
        <Image
          preview={false}
          fallback="data:image/png;base64,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"
          src={nftInfo?.image}
        />
        <p>{nftInfo?.description}</p>
        <p className="text-xl">
          {tokenMarketData && ethers.utils.formatEther(tokenMarketData["price"].toString())} Eth
        </p>

        <p className="text-sm text-gray-400">
          <span className="">Royalty:</span>
          {nftInfo && nftInfo["royalty"]} Eth
        </p>
        {tokenMarketData && (
          <p>
            {ownerOfToken !== address && tokenMarketData["seller"] !== address ? (
              <div className="text-green-600">Sold</div>
            ) : (
              <>
                {tokenMarketData["sold"] === false && tokenMarketData["listed"] === true && (
                  <div className="text-blue-700">Listed on marketplace</div>
                )}
              </>
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
  const [nftData, setNftData] = useState({ name: "", description: "", image: "", royalty: 0 });
  const [userTokens, setUserTokens] = useState([]);

  // console.log("n-api key: ", process.env.REACT_APP_WEB3_STORAGE_API);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const props = {
    listType: "picture",
    async onChange(info) {
      let nftFile = info.file;
      message.info("uploading");
      const file = new File([nftFile], "nft.png", { type: nftFile.type });
      const ipfsCid = await client.put([file]);
      console.log("n-ipfsCid: ", ipfsCid);
      setNftData({ ...nftData, image: `https://ipfs.io/ipfs/${ipfsCid}/nft.png` });
      message.success("file uploaded");
    },
    // onRemove: file => {
    //   // const index = fileList.indexOf(file);
    //   // const newFileList = fileList.slice();
    //   // newFileList.splice(index, 1);
    //   // setFileList(newFileList);
    // },
    beforeUpload: file => {
      console.log("n-file: ", file);
      return false;
    },
  };

  const onMint = async () => {
    const ipfsData = { ...nftData };
    const blob = new Blob([JSON.stringify(ipfsData)], { type: "application/json" });
    const fileData = new File([blob], "nft.json");
    const ipfsCid = await client.put([fileData]);

    // fetch nft json data
    // let data = await fetch(`https://ipfs.io/ipfs/${ipfsCid}/nft.json`);
    // data = await data.json();

    const tx = await yourNFT.mint(`https://ipfs.io/ipfs/${ipfsCid}/nft.json`, nftData.royalty * 10000);
    const rcpt = await tx.wait();
    console.log("rcpt: ", rcpt);
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
            disabled={
              nftData.name === "" || nftData.description === "" || nftData.image === "" || nftData.royalty === 0
            }
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
          <Upload {...props} maxCount={1} accept="image/png, image/gif, image/jpeg">
            <Button icon={<UploadOutlined />}>Upload image to IPFS</Button>
          </Upload>
        </div>

        <div className="m-1">
          <EtherInput
            placeholder="Enter royalty amount in eth"
            onChange={value => {
              setNftData({ ...nftData, royalty: value });
            }}
          />
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
