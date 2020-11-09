import React from "react";
import { createPortal } from "react-dom";

export function Modal({ children, isOpen, className = ""}){
    return createPortal(
        <div className="recipe-modal recipe-modal-open">
            <div className={"modal-content " + className}>
                <div className="modal-top" onClick={()=> isOpen(false)}>X</div>
                <div className="modal-detail">
                    {children}
                </div>
            </div>
        </div>
    , document.body)
}