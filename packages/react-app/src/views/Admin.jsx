import { useEventListener } from "eth-hooks/events/";

import { Button, Steps, Modal, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { ethers } from "ethers";
import React, { useState } from "react";

function Admin({ yourLocalBalance, readContracts, writeContracts, localProvider, userSigner }) {
  const yourNFT = writeContracts["YourNFT"];
  const NFTmanager = writeContracts["NFTManager"];

  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const tx = await yourNFT.mint("http://cool.com", 500);
    const rcpt = await tx.wait();
    console.log("rcpt: ", rcpt);

    setIsModalOpen(false);
  };

  return (
    <div className="m-2 flex flex-col items-center">
      <Button type="primary" onClick={showModal}>
        Mint NFT
      </Button>
      {/* mint nft modal */}
      <Modal
        title="Mint an NFT"
        visible={isModalOpen}
        // onOk={onMint}
        // onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={onMint}>
            Mint
          </Button>,
        ]}
      >
        {/* nft name */}
        <div className="m-1">
          <Input placeholder="Enter nft name" />
        </div>
        <div className="m-1">
          <Input.TextArea placeholder="Enter nft description" className="m-1" rows={4} />
        </div>
        {/* nft image or upload */}

        <div className="m-1">
          <Input placeholder="image url" />
        </div>
        <div className="m-1 ml-20 text-blue-600">Or</div>
        <div className="m-1">
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload image to IPFS</Button>
          </Upload>
        </div>
      </Modal>
    </div>
  );
}

export default Admin;
