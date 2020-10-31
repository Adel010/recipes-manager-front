import React from "react";

export function Loader({size, color}){
    return <div className="loader-container"><div className={"lds-roller " + size + "-ldr" + " " + color + "-ldr"}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
}