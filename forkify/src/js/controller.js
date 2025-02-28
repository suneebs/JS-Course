import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

// if (module.hot){
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try{
    const id = window.location.hash.slice(1);
    if(!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage())
    // 1. Loading recipe
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  }
  catch(err){
    recipeView.renderError();
  }
}

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    // 1. Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. pagination
    paginationView.render(model.state.search);
  }catch(err){
    console.error(err);
  }
}

const controlPagination = function(gotoPage){
  resultsView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
}

const controlServings = function(newServing){
  model.updateServings(newServing);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}
const init = function(){
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
}
init();