import React, { useCallback, useEffect, useState } from "react";
import { useIngredients } from "../hooks/ingredient";
import { Ingredients } from "./ingredients/ingredients";
import { Recipes } from "./recipes/recipes";

export function Site(){
    const [page, setPage] = useState("recipes");
    const handlePageChange = useCallback(function(selectedPage){
        setPage(() => selectedPage)
    },[setPage]);

    const { ingredients, fetchIngredients, deleteIngredient, addIngredient} = useIngredients();

    let mainContent = null;
    if(page === "ingredients"){
        mainContent = <Ingredients ingredients={ingredients} onDelete={deleteIngredient} addNewIngredient={addIngredient}/>
    }else if(page === "recipes"){
        mainContent = <Recipes />
    }
    useEffect(function(){
        if(page === "ingredients"){
            fetchIngredients()
        }
    }, [page, fetchIngredients])
    return <>
        <NavBar currentPage={page} selectPage={handlePageChange}/>
        <main>
            {mainContent}
        </main>
    </>
}

function NavBar({currentPage, selectPage}){

    const navItemClass = function (page){
        let className = "nav-item";
        if(page === currentPage){
            className+= " active-nav-item"
        }
        return className
    };

    return <nav>
        <h2 className="logo">Recipes manager</h2>
        <ul className="nav-list">
            <li className={navItemClass("recipes")}>
                <a href="#recipes" className="nav-link" onClick={() => selectPage("recipes")}>Recipes</a>
            </li>
            <li className={navItemClass("ingredients")}>
                <a href="#ingredients" className="nav-link" onClick={() => selectPage("ingredients")}>Ingredient</a>
            </li>
        </ul>
    </nav>
}