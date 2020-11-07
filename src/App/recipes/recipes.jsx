import React, { useEffect, useRef, useState } from "react";
import { Loader } from "../../ui/loader";
import { Modal } from "../../ui/Modal";


export function Recipes({recipes, getRecipeDetails, ingredients, fetchIngredients, setNewIngredient}){
    return <div className="recipes-container">
        {recipes ? recipes.map(r =><Recipe key={r.id} recipe={r} getRecipeDetails={getRecipeDetails} ingredients={ingredients} fetchIngredients={fetchIngredients} setNewIngredient={setNewIngredient} />) : <Loader />}
    </div>
}


function Recipe({recipe, getRecipeDetails, ingredients, fetchIngredients, setNewIngredient}){
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const handleClick = async function(e){
        e.preventDefault();
        try{
            setLoadingData(true);
            setModalOpen(true);
            await getRecipeDetails(recipe);
            setLoadingData(false)
        }catch(err){
            console.log(err);
            setLoadingData(false);
        }
    }

    return <div id={"recipe-" + recipe.id} className="recipe-card">
        <h3>{recipe.title}</h3>
        <p>{recipe.short}</p>
        <div><button onClick={handleClick} className="btn standard-btn" >Details</button></div>
        {modalOpen && <RecipeDetail loadingData={loadingData} recipe={recipe} ingredients={ingredients} modalOpener={setModalOpen} fetchIngredients={fetchIngredients} setNewIngredient={setNewIngredient}/>}
        
    </div>
}

function RecipeDetail({recipe, modalOpener, ingredients, fetchIngredients, setNewIngredient, loadingData }){
    const [editing, setEditing] = useState(false);
    const regex = /\n/gi;

    return <Modal isOpen={modalOpener}>
        <h3>{recipe.title}</h3>
        <p>{recipe.short}</p>
        {loadingData ? <Loader size="medium" color="white" /> :
        editing ? <EditRecipeForm fetchIngredients={fetchIngredients} /> :
            <>
                <h4>Ingredients</h4>
                <ul>
                    {recipe.ingredients.map(i => <li key={i.id}>
                        <p>{i.quantity + (i.unit ? " " + i.unit : "") + " " + i.title}</p>
                    </li>)}
                </ul>
                <p dangerouslySetInnerHTML={{__html: recipe.content.replace(regex, "<br/>")}}></p>
                <div className="edit-button-container"><button className="btn standard-btn" onClick={() => setEditing(true)}>Edit</button></div>
            </>
        }
    </Modal>
}

function EditRecipeForm({recipe, ingredients, fetchIngredients, setNewIngredientToRecipe}){
    useEffect(function(){
        if(!ingredients){
            fetchIngredients()
        }
    });
    return <div>
        <br/>
        <br/>
        Hold my beer
        <br/>
        <br/>
    </div>
}