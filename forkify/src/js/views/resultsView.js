import view from "./view";
import previewView from "./previewView.js";

class resultsView extends view{
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found. Please try again!';
    _message = '';

   _generateMarkup(){
          return this._data.map(result => previewView.render(result,false)).join('');
       }
}

export default new resultsView();