import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class view{
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered(eg. recipe)
     * @param {boolean} [render=true] if false, create markup string instead of rendering to the DOM.
     * @returns {undefined | string } A markup string is returned if render = false
     * @this {Object} View instance
     * @author Suneeb S
     * @todo Finish Implementation
     */

        render(data, render = true){
            if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
            this._data = data;
            const markup = this._generateMarkup();
            
            if(!render) return markup;

            this._clear();
            this._parentElement.insertAdjacentHTML('afterbegin', markup);
        }
    
        _clear(){
            this._parentElement.innerHTML = '';
        }

        update(data){
          this._data = data;
          const newMarkup = this._generateMarkup();
          const newDOM = document.createRange().createContextualFragment(newMarkup);

          const newElements = Array.from(newDOM.querySelectorAll('*'));
          const curElements = Array.from(this._parentElement.querySelectorAll('*'));

          newElements.forEach((newEl,i) => {
            const curEl = curElements[i];
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
              curEl.textContent = newEl.textContent;
            }
            //Attribute
            if(!newEl.isEqualNode(curEl)){
              Array.from(newEl.attributes).forEach(attr => 
                curEl.setAttribute(attr.name,attr.value)
              )
            }
          })

        }
    
        renderSpinner(){
            const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
            `;
            this._clear();
            this._parentElement.insertAdjacentHTML('afterbegin', markup);
          }
    
        renderError(message = this._errorMessage){
            const markup = `
            <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
            `;
            this._clear();
            this._parentElement.insertAdjacentHTML('afterbegin', markup);
        }
    
        renderMessage(message = this._message){
            const markup = `
            <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
            `;
            this._clear();
            this._parentElement.insertAdjacentHTML('afterbegin', markup);
        }
        
}