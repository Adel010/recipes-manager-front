import React, { useEffect, useRef, useState } from "react";
import { Loader } from "../../ui/loader";
import { createPortal } from "react-dom";


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

    return createPortal(
        <div className="recipe-modal recipe-modal-open">
            <div className="modal-content">
                <div className="modal-top" onClick={()=> modalOpener(false)}>X</div>
                
                {editing ? <EditRecipeForm recipe={recipe} ingredients={ingredients} fetchIngredients={fetchIngredients} /> :
                <div className="recipe-detail">
                    <h3>{recipe.title}</h3>
                    <p>{recipe.short}</p>
                    {loadingData ? <Loader size="medium" color="white" /> :
                    <>
                        <h4>Ingredients</h4>
                        <ul>
                            {recipe.ingredients.map(i => <li key={i.id}>
                                <p>{i.quantity + (i.unit ? " " + i.unit : "") + " " + i.title}</p>
                            </li>)}
                        </ul>
                        <p dangerouslySetInnerHTML={{__html: recipe.content.replace(regex, "<br/>")}}></p>
                        <div className="edit-button-container"><button className="btn standard-btn" onClick={() => setEditing(true)}>Edit</button></div>
                    </>}
                </div>}
            </div>
        </div>, document.body
    )
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