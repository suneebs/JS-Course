'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map,mapEvent;
//Geolocation API
if(navigator.geolocation)
navigator.geolocation.getCurrentPosition(function(pos){
    const {latitude} = pos.coords;
    const {longitude} = pos.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`); 

    const coords = [latitude,longitude];
    map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click',function(mapE){
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
        // console.log(mapEvent);
       
    })
    
},function(){
    alert('Position not found!')
})

// submitting the form
form.addEventListener('submit',function(e){
    e.preventDefault();
    inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value =' ';
    const {lat,lng} = mapEvent.latlng;
    L.marker([lat,lng]).addTo(map)
    .bindPopup(L.popup({
        maxWidth:250,
        minWidth:100,
        autoClose:false,
        closeOnClick:false,
        className:'running-popup',
    }))
    .setPopupContent('workout')
    .openPopup();
})

// toggling input type

inputType.addEventListener('change',function(){
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
})