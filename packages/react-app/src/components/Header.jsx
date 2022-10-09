import React from "react";
import { Link } from "react-router-dom";

// displays a page header

export default function Header({ ...props }) {
  return (
    <div className="headerClass mr-60 flex flex-row justify-between w-screen">
      <nav className="hidden p-4 left-40 lg:flex lg;flex-row space-x-8 items-start text-center overflow-hidden">
        <div className="">
          <div className="pt-5 text-xl space-x-9">
            <Link to={"/"}>
              <button className="text-color navButton font-bold">Home</button>
            </Link>
            <Link to={"/marketplace"}>
              <button className="text-md text-color navButton font-bold">Marketplace</button>
            </Link>
            <Link to={"/create"}>
              <button className="text-md text-color navButton font-bold">Create</button>
            </Link>
          </div>
        </div>
      </nav>
      <div className="flex justfy-end">{props.children}</div>
    </div>
  );
}
