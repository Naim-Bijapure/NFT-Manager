import React, { useEffect, useState } from "react";
import { utils } from "ethers";
import { Address, AddressInput } from "../components";
import { dummy } from "../image";

export default function Marketplace(props) {
  const address = props.address || props.value;
  console.log(address);
  const mainnetProvider = props.mainnetProvider;
  const blockExplorer = props.blockExplorer;
  useEffect(() => {
    return async () => {
      const add = await address;
      console.log(add);
    };
  }, [address]);
  return (
    <>
      <div style={{ maxWidth: "90%", padding: 20, overflow: "hidden", display: "flex" }}>
        <div class="space-y-3 items-center bg-opacity-5">
          <div class="">
            <div className="w-80 item-contain rounded-lg">
              <img className="item" alt="item" src={dummy} />
              <h3 style={{ fontFamily: "FantaisieArtistique" }} className="font-bold text-left text-xl py-8">
                Lets Dream
              </h3>
              <div className="justify-between p-y-10 flex flex-row">
                <div className="flex-col">
                  <p className="text-lg text-left text-col tracking-widest font-bold">Owner</p>
                  <p>
                    <Address
                      address={address}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={14}
                    />
                  </p>
                </div>
                <div className="">
                  <p className="text-lg text-col tracking-widest font-bold">Price</p>
                  <p>0.5 ETH</p>
                </div>
              </div>
              <button className="btn w-full">Buy</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
