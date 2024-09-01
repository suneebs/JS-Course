'use strict';


class Workout{
    date = new Date();
    id = (Date.now() + '').slice(-10);
    clicks=0
    constructor(coords,distance,duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }

    _setDescription(){
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
    }
    click(){
        this.clicks++;
    }
}

class Running extends Workout{
    type = 'running';
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }
    calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout{
    type = 'cycling';
    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration);
        this. elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }
    calcSpeed(){
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

// const run1 = new Running([39,-12],5.2,24,178);
// const cycle1 = new Cycling([39,-12],27,95,523);
// console.log(run1,cycle1);

//////////////////////////////////////////////////////////////////////////////////
//Application architeture

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const delbtn = document.querySelector('.delete');

class App{
    #map;
    #mapEvent;
    #workouts = [];
    #mapZoomLevel = 13;
    constructor(){
        this._getPosition();

        form.addEventListener('submit',this._newWorkout.bind(this));
        // toggling input type
        inputType.addEventListener('change',this._toggleElevationField);
        // move to marker
        containerWorkouts.addEventListener('click',this._moveToPopup.bind(this));
        // get local storage
        this._getLocalStorage();
        // delete data
        delbtn.addEventListener('click',this._delData);
    }

    _getPosition(){
        //Geolocation API
        if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){
        alert('Position not found!')
    })
    }

    _loadMap(pos) {
        const {latitude} = pos.coords;
        const {longitude} = pos.coords;
        // console.log(`https://www.google.com/maps/@${latitude},${longitude}`); 
    
        const coords = [latitude,longitude];
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    
        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
    
        this.#map.on('click',this._showForm.bind(this));
        // render local storage - marker
        this.#workouts.forEach(work => {
            this._renderWorkoutMarker(work);
        })
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();
            delbtn.classList.remove('hide');
        }
    _hideForm(){
        inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value =' ';
        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => form.style.display = 'grid', 1000);
    }

    _toggleElevationField() {
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp >= 0);
        e.preventDefault();

        //Get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat,lng} = this.#mapEvent.latlng;
        let workout;

        
        // If workout running, create running object
        if (type == 'running'){
            const cadence = +inputCadence.value;
            // Check if data is valid
            if(!validInputs(distance,duration,cadence) || !allPositive(distance,duration,cadence))
                return alert('Inputs should be positive numbers')

            workout = new Running([lat,lng],distance,duration,cadence);

        }
        
        // If workout cycling, create cycling object
        if (type == 'cycling'){
            const elevation = +inputElevation.value;
            // Check if data is valid
            if(!validInputs(distance,duration,elevation) || !allPositive(distance,duration))
                return alert('Inputs should be positive numbers')

            workout = new Cycling([lat,lng],distance,duration,elevation);

        }

        // Add new object to workout array
        this.#workouts.push(workout);
        // console.log(workout);
        

        // Render workout on map as marker
        this._renderWorkoutMarker(workout);

        //Render workout on list
        this._renderWorkouts(workout);

        //Hide form + clear input fields
            this._hideForm();

        // set local storage
        this._setLocalStorage();
            
    }
    _renderWorkoutMarker(workout){
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth:250,
                minWidth:100,
                autoClose:false,
                closeOnClick:false,
                className:`${workout.type}-popup`,
            }))
            .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'} ${workout.description}`)
            .openPopup();
    }

    _renderWorkouts(workout){
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}
          
          <button class="closeX">X</button>
          </h2>
          
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'}</span>
            <span class="workout__value">
            <input class='inputs' type='text' value=${workout.distance} />
            </span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">
            <input class='inputs' type='text' value=${workout.duration} />
            </span>
            <span class="workout__unit">min</span>
          </div>`

        if(workout.type === 'running'){
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">
            ${workout.pace.toFixed(1)}
            </span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">
            <input class='inputs' type='text' value=${workout.cadence} />
            </span>
            <span class="workout__unit">spm</span>
          </div>
            `;
        }
        if(workout.type === 'cycling'){
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">
            ${workout.speed.toFixed(1)}
            </span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">
            <input class='inputs' type='text' value=${workout.elevationGain} />
            </span>
            <span class="workout__unit">m</span>
          </div>
            `;
        }

        form.insertAdjacentHTML('afterend',html);

        // Add event listener to the newly added close button
        this._attachCloseButtonListener(workout.id);

        // Add event listener to the newly added input fields
        this._attachInputListeners(workout.id);
    }
    _attachCloseButtonListener(workoutID) {
        const closeButton = document.querySelector(`.workout[data-id="${workoutID}"] .closeX`);
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                // Find the workout element to remove
                const workoutItem = document.querySelector(`.workout[data-id="${workoutID}"]`);
                if (workoutItem) workoutItem.remove();
    
                // Remove the workout from the workouts array
                this.#workouts = this.#workouts.filter(workout => workout.id !== workoutID);
    
                // Update local storage
                this._setLocalStorage();
    
                // Optionally, you can reload the page to reflect changes, though it's usually better to avoid this
                location.reload();
            });
        }
    }

    _attachInputListeners(workoutId){
        const updateWorkout = document.querySelector(`.workout[data-id="${workoutId}"]`);
        if (updateWorkout) {
            const inputs = updateWorkout.querySelectorAll('.inputs');
            inputs.forEach(inp =>{
                inp.addEventListener('input',(e) => {
                    this._updateWorkout(workoutId,e.target);
                })
            })
        }
        updateWorkout.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              location.reload();
            }
          });
        
    }

    _updateWorkout(workoutId,event){
        const workoutIndex = this.#workouts.findIndex(workout => workout.id === workoutId);
        // console.log(workoutIndex);
        if (workoutIndex > -1) {
            const workout = this.#workouts[workoutIndex];
            // console.log(workout);
            // console.log(event);
            if (event.classList.contains('inputs')) {

                const unit = event.parentElement.nextElementSibling.textContent;
                if (unit === 'km'){
                    // console.log(input.value);
                    workout.distance = +event.value;
                }
                else if (unit === 'min')
                    workout.duration = +event.value;
                else if (unit === 'spm')
                    workout.cadence = +event.value;
                else if (unit === 'm')
                    workout.elevationGain = +event.value;
                }

                if(workout.type === 'cycling')
                    workout.speed = workout.distance / (workout.duration / 60);
                else if(workout.type === 'running')
                    workout.pace = workout.duration / workout.distance;
        }  
        this._setLocalStorage();
    }
    

    _moveToPopup(e){
        const workoutEl = e.target.closest('.workout');
        // console.log(workoutEl);
        if(!workoutEl) return;

        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);
        // console.log(workout);
        this.#map.setView(workout.coords,this.#mapZoomLevel,{
            animate:true,
            pan:{
                duration:1
            }
        })
        // using the public interface
        // workout.click()
    }

    _setLocalStorage(){
        localStorage.setItem('workouts',JSON.stringify(this.#workouts));
    }

    _getLocalStorage(){
        const data = JSON.parse(localStorage.getItem('workouts'));
        if (!data) return
        this.#workouts =data
        this.#workouts.forEach(work => {
            this._renderWorkouts(work);
        })        
    }

    reset(){
        localStorage.removeItem('workouts');
        location.reload();
    }

    _delData(e){
        e.preventDefault();
        localStorage.removeItem('workouts');
        delbtn.classList.add('hide');
        location.reload();
    }

}

const app = new App();

// app.reset();  to reset the local storage