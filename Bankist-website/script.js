'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// adding cookie
const header =document.querySelector('.header');

const message = document.createElement('div');
message.classList.add('cookie-test-msg');
message.innerHTML = 'We use cookies for improved functionality and analytics <button class ="btn btn--close--cookie"> got it!</button>';
header.append(message);

document.querySelector('.btn--close--cookie')
.addEventListener('click',function(){
  message.remove();
});

console.log(getComputedStyle(message).height);
message.style.height=Number.parseFloat(getComputedStyle(message).height,10)+30+'px';
message.style.backgroundColor='#37383d';
// document.documentElement.style.setProperty('--color-primary','orangered');

//smooth scrolling
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1= document.querySelector('#section--1');
btnScrollTo.addEventListener('click',function(){
  section1.scrollIntoView({behavior:'smooth'});
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page Navigation

// document.querySelectorAll(".nav__link").forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault();
//     console.log("clicked");
//     const id= this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   })
// })

// using event delegation for increased performance
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
  if(e.target.classList.contains('nav__link')){
        const id= e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior:'smooth'}); 
  }
})