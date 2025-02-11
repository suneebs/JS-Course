import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipe = async function () {
  try{
    const id = window.location.hash.slice(1);
    console.log(id);
    if(!id) return;
    recipeView.renderSpinner();

    // 1. Loading recipe
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);

  }
  catch(err){
    recipeView.renderError();
  }
}


//////////////////////////////////////////////////////////////////

const init = function(){
  recipeView.addHandlerRender(controlRecipe);
}
init();