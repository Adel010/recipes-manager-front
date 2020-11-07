import React from "react";
import { createPortal } from "react-dom";

export function Modal({ children, isOpen}){
    return createPortal(
        <div className="recipe-modal recipe-modal-open">
            <div className="modal-content">
                <div className="modal-top" onClick={()=> isOpen(false)}>X</div>
                <div className="recipe-detail">
                    {children}
                </div>
            </div>
        </div>
    , document.body)
}