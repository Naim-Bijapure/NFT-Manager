import React, { useRef, useState } from "react";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";
const ipfsAPI = require("ipfs-http-client");

const projectId = "2DDHiA47zFkJXtnxzl2jFkyuaoq";
const projectSecret = "96a91eeafc0a390ab66e6a87f61152aa";
const projectIdAndSecret = `${projectId}:${projectSecret}`;

const { BufferList } = require("bl");

const ipfs = ipfsAPI({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
  headers: { authorization: `Basic ${Buffer.from(projectIdAndSecret).toString("base64")}` },
});

const Create = ({ address, writeContracts, readContracts, tx }) => {
  const history = useHistory();
  console.log(address);

  const [nftDetails, setNftDetails] = useState({
    name: "",
    description: "",
    royalty: "",
    image: "",
  });
  const [file, setFile] = useState("");
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [displayImg, setDisplayImg] = useState();
  const [minting, setMinting] = useState(false);

  const dataRef = useRef();

  function triggerOnChange() {
    dataRef.current.click();
  }

  async function handleFileChange(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setNftDetails({ ...nftDetails, image: uploadedFile });
    let reader = new FileReader();
    reader.onload = function () {
      if (reader.result) {
        setFile(Buffer.from(reader.result));
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  }

  const mintItem = async () => {
    setMinting(true);
    try {
      // upload file to ipfs
      const fileUpload = await ipfs.add(nftDetails.image);
      const fileLink = `https://ipfs.io/ipfs/${fileUpload.path}`;
      setDisplayImg(fileLink);
      console.log(fileLink);
      setNftDetails({ ...nftDetails, image: fileLink });
      console.log(nftDetails);

      // upload metadata to ipfs
      const uploaded = await ipfs.add(JSON.stringify(nftDetails));
      console.log("Uploaded Hash: ", uploaded);
      console.log("Uploaded Hash: ", uploaded.path);
      const result = tx(
        writeContracts &&
          writeContracts.YourNFT &&
          writeContracts.YourNFT.mint(uploaded.path, nftDetails.royalty * 10000),
        update => {
          console.log("📡 Transaction Update:", update);
          if (update && (update.status === "confirmed" || update.status === 1)) {
            console.log(" 🍾 Transaction " + update.hash + " finished!");
            console.log(
              " ⛽️ " +
                update.gasUsed +
                "/" +
                (update.gasLimit || update.gas) +
                " @ " +
                parseFloat(update.gasPrice) / 1000000000 +
                " gwei",
            );
          }
        },
      );
      await result.wait();
      setMinting(false);

      setNftDetails({
        name: "",
        description: "",
        royalty: "",
        image: "",
      });

      setFile("");
      history.push("/dashboard");
    } catch (error) {
      console.error(error);
      setMinting(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-center tracking-widest font-semibold">Create NFT</h1>

      <div className="relative">
        <section className=" w-screen my-20 overflow-hidden mx-0 top-7 items-center space-x-5 flex flex-col lg:flex-row  px-10 justify-evenly relative">
          <div
            className="rounded-3xl h-96 border border-solid border-sky-700 w-screen lg:w-2/5 cursor-pointer"
            onClick={triggerOnChange}
          >
            <input id="selectImage" style={{ display: "none" }} type="file" onChange={handleFileChange} ref={dataRef} />
            {nftDetails.image ? (
              <div className="h-full flex justify-center items-center">
                <img src={displayImg} alt="item" className="w-full h-full rounded-3xl p-2" />
              </div>
            ) : (
              <div className="h-full flex justify-center items-center">
                <h2 className="text-center">Please Select Here to See Your File Preview</h2>
              </div>
            )}
          </div>

          <div className="lg:w-2/5 w-screen flex space-y-3 flex-col">
            <div className="flex flex-col">
              <label className="text-xl my-1 text-left font-semibold ">Name</label>
              <input
                placeholder="eg. Warlock"
                className=" px-5 py-3 bg-transparent rounded-xl
               placeholder:text-slate-400 outline-none border"
                value={nftDetails.name}
                onChange={e => setNftDetails({ ...nftDetails, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl text-left my-1 font-semibold">Description</label>
              <textarea
                placeholder="eg. BuidlGuidl Magician"
                className="px-5 py-3 rounded-lg border outline-none"
                value={nftDetails.description}
                onChange={e => setNftDetails({ ...nftDetails, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl my-1 text-left font-semibold">Royalty</label>
              <input
                type="number"
                placeholder="100"
                className="px-5 py-3 rounded-xl
               outline-none border  bg-transperent"
                value={nftDetails.price}
                onChange={e => setNftDetails({ ...nftDetails, royalty: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={mintItem}
              className="btn outline-none border-none py-3 px-5 rounded-xl cursor-pointer transition duration-250 ease-in-out tracking-widest  hover:drop-shadow-xl hover:shadow-sky-600 w-auto focus:scale-90"
              disabled={minting}
            >
              {minting ? "Minting..." : "Mint"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Create;
