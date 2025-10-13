import React from "react";
import "./Loader.css";
import clsx from "clsx";

import { LoaderProps } from "../../../types/Loader";

const Loader: React.FC <LoaderProps> = ({className}) => {
  return (
    <>
    <div className="flex items-center justify-center h-screen text-black dark:text-white"> Loading... </div>
    </>
  );
};

export default Loader;
