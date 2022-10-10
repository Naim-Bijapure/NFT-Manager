import { Select } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";

import { useTokenList } from "eth-hooks/dapps/dex";
import { Address, AddressInput } from "../components";

const { Option } = Select;

export default function Marketplace({ yourLocalBalance, mainnetProvider, price, address }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!
  const [selectedToken, setSelectedToken] = useState("Pick a token!");
  const listOfTokens = useTokenList(
    "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json",
  );

  return (
    <div>
      <div style={{ margin: 32 }}>
        Market
        <div className="flex flex-col lg:grid lg:grid-cols-3"></div>
      </div>
    </div>
  );
}
