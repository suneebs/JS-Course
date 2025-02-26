import view from "./view";
import icons from 'url:../../img/icons.svg'; 
class paginationView extends view{
    _parentElement = document.querySelector('.pagination');

    addHandlerPagination(handler){
        this._parentElement.addEventListener('click',function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            const gotoPage = +btn.dataset.goto;
            // console.log(gotoPage);
            handler(gotoPage);
        })
    }

        _generateMarkupButton(curPage,type){
            return `
                    <button data-goto="${type == 'next' ? curPage + 1 : curPage - 1}" class="btn--inline pagination__btn--${type == 'next' ?'next':'prev'}">
                <span>Page ${type == 'next' ?curPage+1:curPage-1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-${type == 'next' ?'right':'left' }"></use>
                </svg>
            </button>
            `
        }

        _generateMarkup(){
            const curPage = this._data.page;
            const numPages = Math.ceil(this._data.results.length / this._data.page_per_search);
            // console.log(this._data.page,numPages,this._data.results.length);
            
            // In page 1 and contains other page
            if(curPage === 1 && numPages > 1)
                return this._generateMarkupButton(curPage,'next');
            // In Last page
            if(curPage === numPages && numPages>1)
                return this._generateMarkupButton(curPage,'prev');
            // In other pages
            if(curPage < numPages)
                return this._generateMarkupButton(curPage,'prev')+this._generateMarkupButton(curPage,'next');
            // In page 1 and does not contain any other pages
            return '';
        }

}

export default new paginationView();