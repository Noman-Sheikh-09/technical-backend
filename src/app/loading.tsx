"use client";
import React from "react";
import { ThreeCircles } from "react-loader-spinner";

function loading() {
    return (
        <div className="flex items-center justify-center h-lvh bg-paperColor dark:bg-darkSecondary">
            <ThreeCircles
                visible={true}
                height="70"
                width="70"
                ariaLabel="three-circles-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                color="#3B82F6"
            />
        </div>
    );
}

export default loading;
