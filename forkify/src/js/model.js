import { async } from 'regenerator-runtime';
import { API_URL, PAGE_PER_SEARCH } from './config';
import { getJSON } from './helpers';

export const state ={
    recipe:{},
    search:{
        query:'',
        results:[],
        page:1,
        page_per_search : PAGE_PER_SEARCH,
    }
};

export const loadRecipe = async function(id){
    try{
        const data = await getJSON(`${API_URL}${id}`);
        
        const {recipe} = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        };
    }catch(err){
        // Temp error handling
        console.error(`${err} 💥💥💥`);
        throw err;
    }
}

export const loadSearchResults = async function(query){
    try{
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);
        // console.log(data);
        state.search.results = data.data.recipes.map(rec =>{
            return{
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url
            }
        })
        // console.log(state.search.results);
        
    }
    catch(err){
        console.error(`${err} 💥💥💥`);
        throw err;
    }
}

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page=page;
    const start = (page-1)* state.search.page_per_search;
    const end = page *  state.search.page_per_search;
    return state.search.results.slice(start, end);
}

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings; 
    });
    state.recipe.servings = newServings;
}