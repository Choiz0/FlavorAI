import React from "react";

import { Outlet } from "react-router-dom";

const Layout2 = () => {
  return (
    <>
      <div className=" w-full">
        <Outlet />
      </div>
    </>
  );
};

export default Layout2;
