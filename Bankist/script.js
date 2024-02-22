'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-01-27T17:01:17.194Z',
    '2024-02-02T23:36:17.929Z',
    '2024-02-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function(date,locale){

  const calcDaysPassed = (date1,date2) => Math.round(Math.abs((date1-date2) / (1000*60*60*24)));
  const days = calcDaysPassed(new Date(), new Date(date));
  if (days == 0) return "Today";
  if(days == 1) return "Yesterday";
  if(days <= 7) return `${days} days ago`; 
  
  // const day =`${date.getDate()}`.padStart(2,0);
  //   const month =`${date.getMonth() + 1}`.padStart(2,0);
  //   const year=date.getFullYear();

  //   return `${day}/${month}/${year}`;
  return Intl.DateTimeFormat(locale).format(date);

}
const formatCur=function(value,locale,cur){
  return new Intl.NumberFormat(locale,{
    style:'currency',
    currency:cur,
  }).format(value)
}


const displayMovements=function (acc,sort = false) {
  //for sorting
  containerMovements.innerHTML='';
  const movs=sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;
  ////////////////////////////////////////////
  movs.forEach(function(mov,i) {
    const type= mov>0? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate=formatMovementDate(date,acc.locale);

    const formattedMov=formatCur(mov,acc.locale,acc.currency);

    const html =`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin',html);
  });

}


////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding display balance (reduce function)

const displayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,cur) => acc+cur,0);
  labelBalance.textContent =`${formatCur(acc.balance,acc.locale,acc.currency)}`;

}


const displaySummary = function(acc){
  const balance_in =acc.movements.filter(mov => mov >0).reduce((acc,mov)=> acc+mov,0);
  labelSumIn.textContent =`${formatCur(balance_in,acc.locale,acc.currency)}`;

  const balance_out=acc.movements.filter(mov => mov <0).reduce((acc,mov)=> acc+mov,0);
  labelSumOut.textContent=`${formatCur(Math.abs(balance_out),acc.locale,acc.currency)}`;

  const interest=acc.movements.filter(mov => mov>0).map(mov => mov*acc.interestRate/100).filter(int => int > 1).reduce((acc,int)=> acc+int,0);
  labelSumInterest.textContent=`${formatCur(interest,acc.locale,acc.currency)}`;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//creating user names
const createUserNames = function(accs){
  accs.forEach(function(acc){
     acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
  // console.log(username);
  // return username;
}

const user= "Sara Ali Khan";
createUserNames(accounts);
// console.log(accounts);
/////////////////////////////////////////////////////////
// Displaying transfer details
const updateUI =function(acc){
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);

};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//implementing login
let currentAccount,timer;
////////////////////////////////////////////////////////////////////////////////////
//fake logged in
// currentAccount=account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Timer



const logoutTimer = function(){
  
  const tick= function(){
    const min =String(Math.trunc(time/60)).padStart(2,0);
      const sec=String((time%60)).padStart(2 ,0);
      labelTimer.textContent =`${min}:${sec}`;
     
      if (time ==0) {
        clearInterval(timer);
        labelWelcome.textContent='Log in to get started';
        containerApp.style.opacity =0;
      }
      time--;
  }
  let time =120;
  tick();
  const timer= setInterval(tick,1000);
  return timer;
}



btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  // console.log("login");
  currentAccount=accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log("success");
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity =100;

    //create current date and time
    const now= new Date();
// const date =`${now.getDate()}`.padStart(2,0);
// const month =`${now.getMonth() + 1}`.padStart(2,0);
// const year=now.getFullYear();
// const hour =`${now.getHours()}`.padStart(2,0);
// const min= `${now.getMinutes()}`.padStart(2,0);
const options={
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "numeric",
  year:"numeric",
  // weekday:"long", 
}
labelDate.textContent=new Intl.DateTimeFormat(currentAccount.locale,options).format(now);


    
//clear input fields
inputLoginUsername.value=inputLoginPin.value ='';
inputLoginPin.blur();

//timer
if(timer) clearInterval(timer);
timer=logoutTimer();
updateUI(currentAccount);

  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Implementing Transfers
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  // console.log(amount);
  const receiverAccount =accounts.find(acc => acc.username === inputTransferTo.value);
  // console.log(receiverAccount);
  if (amount >0 && receiverAccount && currentAccount.balance >= amount && receiverAccount?.username !== currentAccount.username) {
    console.log("Transfer valid");
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer=logoutTimer();

    [...document.querySelectorAll('.movements__row')].forEach(function(row,i){
      if (i%2 === 0) row.style.backgroundColor="lightgrey"
    })
  }

inputTransferAmount.value = inputTransferTo.value='';
inputTransferAmount.blur();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Delete account

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  // console.log("delete");
  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // console.log(index);
    // Dlete account
    accounts.splice(index,1);
    // console.log(accounts);
    // hide UI
    containerApp.style.opacity =0;
  }
  inputCloseUsername.value=inputClosePin.value='';
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Loan functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount =Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    console.log(amount);
    setTimeout( function(){ currentAccount.movements.push(amount);
     //add loan date
     currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    console.log(currentAccount.movements);
    //reset timer
    clearInterval(timer);
    timer=logoutTimer();
    },2000);
  }
  inputLoanAmount.value='';
  [...document.querySelectorAll('.movements__row')].forEach(function(row,i){
    if (i%2 === 0) row.style.backgroundColor="lightgrey"
  })
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Sort functionality
let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount,!sorted);
  sorted =!sorted;
  [...document.querySelectorAll('.movements__row')].forEach(function(row,i){
    if (i%2 === 0) row.style.backgroundColor="lightgrey"
  })
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Learning - array.from method

// const movementsUI =Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementsUI);

labelBalance.addEventListener('click',function(){
  const movementsUI =Array.from(document.querySelectorAll('.movements__value'),
  el => Number(el.textContent.replace('€','')));
  console.log(movementsUI);
  
  const movementsUI2 =[...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2.map(el => el.textContent));
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Design for movements
btnLogin.addEventListener('click',function(){
  [...document.querySelectorAll('.movements__row')].forEach(function(row,i){
    if (i%2 === 0) row.style.backgroundColor="lightgrey"
  })
})
