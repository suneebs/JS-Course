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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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


const displayMovements=function (movements,sort = false) {
  //for sorting
  containerMovements.innerHTML='';
  const movs=sort ? movements.slice().sort((a,b) => a-b) : movements;
  ////////////////////////////////////////////
  movs.forEach(function(mov,i) {
    const type= mov>0? 'deposit' : 'withdrawal';

    const html =`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__value">${Math.abs(mov)}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin',html);
  });

}


////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding display balance (reduce function)

const displayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,cur) => acc+cur,0);
  labelBalance.textContent =`${acc.balance}€`;

}


const displaySummary = function(acc){
  const balance_in =acc.movements.filter(mov => mov >0).reduce((acc,mov)=> acc+mov,0);
  labelSumIn.textContent =`${balance_in}€`;

  const balance_out=acc.movements.filter(mov => mov <0).reduce((acc,mov)=> acc+mov,0);
  labelSumOut.textContent=`${Math.abs(balance_out)}€`;

  const interest=acc.movements.filter(mov => mov>0).map(mov => mov*acc.interestRate/100).filter(int => int > 1).reduce((acc,int)=> acc+int,0);
  labelSumInterest.textContent=`${interest}€`;
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
  displayMovements(acc.movements);
  displayBalance(acc);
  displaySummary(acc);

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//implementing login
let currentAccount;

btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  // console.log("login");
  currentAccount=accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log("success");
    containerApp.style.opacity =100;
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`;
//clear input fields
inputLoginUsername.value=inputLoginPin.value ='';
inputLoginPin.blur();

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
    updateUI(currentAccount);
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
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    console.log(amount);
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    console.log(currentAccount.movements);
  }
  inputLoanAmount.value='';
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Sort functionality
let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted =!sorted;
});