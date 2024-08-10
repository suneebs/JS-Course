'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs=document.querySelectorAll('.operations__tab');
const tabContainer=document.querySelector('.operations__tab-container');
const tabContent=document.querySelectorAll('.operations__content');
const nav=document.querySelector('.nav');

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tabbed component



tabContainer.addEventListener('click', (e)=>{
  const clicked=e.target.closest('.operations__tab');
  // console.log(clicked);

  if(!clicked) return;

  tabs.forEach(t=>t.classList.remove('operations__tab--active'));
  tabContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  //Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Menu fade animation

const handleHover=function(e){
  if(e.target.classList.contains('nav__link')){
    const link=e.target;
    const siblings=link.closest('nav').querySelectorAll('.nav__link');
    const logo=link.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity=this;
    })
    logo.style.opacity=this;
  }
}

nav.addEventListener('mouseover',handleHover.bind(0.5));
nav.addEventListener('mouseout',handleHover.bind(1));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Sticky Nav

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries
  console.log(entry);
  
  if(!entry.isIntersecting) nav.classList.add('sticky')
    else nav.classList.remove('sticky')
}

const headerObserver = new IntersectionObserver(stickyNav,{
  root:null,
  threshold:0,
  rootMargin: `-${navHeight}px`,
})
headerObserver.observe(header);

//////////////////////////////////////////////////////////////////////////////////////////////////
const allSections = document.querySelectorAll('.section');
const revealSection = function(entries,observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
}
const sectionObserver = new IntersectionObserver(revealSection,{
root:null,
threshold:0.15,
});
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries,observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg,{
  root:null,
  threshold:0,
  rootMargin:'200px',
})

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////////////////////////////////////////////////
//Slider component
const slider = function(){
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
let curSlide = 0;
const maxSlide = slides.length;

const createDots = function(){
  slides.forEach( function( _ ,i){
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activeDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach( dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

const goToSlide = function(slide){
  slides.forEach((s,i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`
  })
}

const nextSlide = function(){
  if(curSlide === maxSlide-1)
    curSlide = 0
  else
   curSlide++

  goToSlide(curSlide);
  activeDot(curSlide);
}

const prevSlide = function(){
  if ( curSlide === 0 )
    curSlide = maxSlide - 1;
  else
   curSlide--;

   goToSlide(curSlide);
   activeDot(curSlide);
}

//iniialization
const init =function(){
  goToSlide(0);
  createDots();
  activeDot(0);
}
init()
btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',prevSlide);

document.addEventListener('keydown', function(e){
  // console.log(e);
  if(e.key === "ArrowRight") nextSlide();
  e.key === "ArrowLeft" && prevSlide();
})

document.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activeDot(slide);
  }
    
})
}
slider();