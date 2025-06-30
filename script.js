'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2024-09-08T17:01:17.194Z',
        '2024-09-10T23:36:17.929Z',
        '2024-09-14T10:51:36.790Z'
    ],
    currency: 'EUR',
    locale: 'pt-PT' // de-DE
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
        '2020-07-26T12:01:20.894Z'
    ],
    currency: 'USD',
    locale: 'en-US'
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////

//------------------My Software----------------------------


const formatMovementDate = function(dateOfMovement, locale) {
    // body...
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), dateOfMovement);

    if (daysPassed === 0) return "Today";
    if (daysPassed === 1) return "Yesterday";
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    // const day = `${dateOfMovement.getDate()}`.padStart(2, 0);
    // const month = `${dateOfMovement.getMonth() + 1}`.padStart(2, 0);
    // const year = dateOfMovement.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(dateOfMovement);

};


const formatCurrency = function (value, locale, currency) {
    // body...
    return new Intl.NumberFormat(locale, {
            style: "currency", 
            currency: currency 
        }).format(value);
}


const displayMovements = function(account, sort = false) {
    // body...
    const movementsMaySort = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
    

    containerMovements.innerHTML = "";

    movementsMaySort.forEach(function(movement, index) {
        // body...
        const movementType = movement > 0 ? "deposit" : "withdrawal";


        const dateOfMovement = new Date(account.movementsDates[index]);
        // const day = `${dateOfMovement.getDate()}`.padStart(2, 0);
        // const month = `${dateOfMovement.getMonth() + 1}`.padStart(2, 0);
        // const year = dateOfMovement.getFullYear();
        // const movementDate = `${day}/${month}/${year}`;

        const movementDate = formatMovementDate(dateOfMovement, account.locale);

        const formattedMovement = formatCurrency(movement, account.locale, account.currency);

        const movementRow = `
                <div class="movements__row">
                    <div class="movements__type movements__type--${movementType}">${index + 1} ${movementType}</div>
                    <div class="movements__date">${movementDate}</div>
                    <div class="movements__value">${formattedMovement}</div>
                </div>`;

        

        containerMovements.insertAdjacentHTML("afterbegin", movementRow);
    });

    // console.log(containerMovements.innerHTML);
    // console.log(containerMovements.textContent);

};

// displayMovements(account1.movements);

const createUsernames = function(accounts) {
    // body...
    accounts.forEach(function(account) {
        // body...
        account.username = account.owner.toLowerCase().split(" ").map(name => name[0]).join("");
    });
};

createUsernames(accounts);


const calcDisplayBlanace = function(account) {
    // body...
    // const balance = movements.reduce((accumulator, movement) => accumulator + movement, 0);
    account.balance = account.movements.reduce((accumulator, movement) => accumulator + movement, 0);
    
    // labelBalance.textContent = `${balance}€`;
    // labelBalance.textContent = `${account.balance.toFixed(2)}€`;

    labelBalance.textContent = formatCurrency(account.balance, account.locale, account.currency);
};

// calcDisplayBlanace(account1.movements);

const calcDisplaySummary = function(account) {
    // body...
    const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((accumulator, deposit) => accumulator + deposit, 0);
    // labelSumIn.textContent = `${incomes.toFixed(2)}€`;
    labelSumIn.textContent = formatCurrency(incomes, account.locale, account.currency)


    const outcomes = account.movements.filter(movement => movement < 0).reduce((accumulator, withdrawal) => accumulator + withdrawal, 0);
    // labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;
    labelSumOut.textContent = formatCurrency(Math.abs(outcomes), account.locale, account.currency)


    const interest = account.movements.filter(movement => movement > 0).map(deposit => deposit * account.interestRate / 100).filter((interest, index, array) => {
        // console.log(array)
        return interest >= 1;
    }).reduce((accumulator, interest) => accumulator + interest, 0);
    // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
    labelSumInterest.textContent = formatCurrency(interest, account.locale, account.currency)
}

// calcDisplaySummary(account1.movements);


const updateUI = function(account) {
    // body...
    //Display movements
    displayMovements(account);

    //Display balance 
    calcDisplayBlanace(account);

    //Display summary
    calcDisplaySummary(account);
};

const startLogOutTimer = function() {
    // body...
    //Set time to 5 minutes 
    let time = 2 * 60;

    const tick = function() {
        // body...
        const minutes = String(Math.floor(time / 60)).padStart(2, 0);
        const seconds = String(time % 60).padStart(2, 0);
        //In each call, print the remaining time to UI
        labelTimer.textContent = `${minutes}:${seconds}`;

        // //Decrease 1s//Me: removed later
        // time--;

        //When reach 0 second, stop timer and log out user
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = `Log in to get started`;

            containerApp.style.opacity = 0;
        }

        //Me
        //Decrease 1s
        time--;
    }

    //Call timer every second
    tick();
    const timer = setInterval(tick, 1000);

    return timer;
};


let currentAccount, timer;


//Event handlers
btnLogin.addEventListener("click", function(event) {
    // body...
    event.preventDefault();
    // console.log("LOGIN");
    currentAccount = accounts.find(account => account.username === inputLoginUsername.value);
    // console.log(currentAccount);


    if (currentAccount?.pin === +inputLoginPin.value) {
        // console.log("LOGIN");

        //Display UI and welcome message 
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;

        containerApp.style.opacity = 100;

        const now = new Date();
        const options = {
            hour: "numeric",
            minute: "numeric",
            day: "numeric",
            month: "long",
            year: "numeric",
            weekday: "long"
        };

        const locale = navigator.language;
        console.log(locale);

        labelDate.textContent = Intl.DateTimeFormat(currentAccount.locale, options).format(now);


        //Clear fields
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginUsername.blur(); inputLoginPin.blur();

        // //Display movements
        // displayMovements(currentAccount.movements);

        // //Display balance 
        // calcDisplayBlanace(currentAccount);

        // //Display summary
        // calcDisplaySummary(currentAccount);

        updateUI(currentAccount);

        if (timer) clearInterval(timer);
        timer = startLogOutTimer();
    }
});


btnTransfer.addEventListener('click', function(event) {
    // body...
    event.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiverAccount = accounts.find(
        account => account.username === inputTransferTo.value,
    );
    // console.log(amount, receiverAccount);

    if (
        amount > 0 &&
        receiverAccount &&
        currentAccount.balance >= amount &&
        receiverAccount?.username !== currentAccount.username
    ) {
        // console.log('Transfer valid');

        //Doing the transfer 
        currentAccount.movements.push(-amount);
        receiverAccount.movements.push(amount);

        //Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAccount.movementsDates.push(new Date().toISOString());

        updateUI(currentAccount);

        
        if (timer) clearInterval(timer);
        timer = startLogOutTimer();
    }

    inputTransferTo.value = inputTransferAmount.value = "";
});


btnClose.addEventListener("click", function (event) {
    // body...
    event.preventDefault();

    if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin) {
        
        const index = accounts.findIndex(account => account.username === currentAccount.username);
        console.log(index);

        //Delete the account 
        accounts.splice(index, 1);

        //Hide the UI
        containerApp.style.opacity = 0;
    }

    inputCloseUsername.value = inputClosePin.value = "";

});


btnLoan.addEventListener("click", function(event) {
    // body...
    event.preventDefault();

    const amount = Math.floor(inputLoanAmount.value);
    

    if (amount > 0 && currentAccount.movements.some(movement => movement >= amount * 0.1)) {

        setTimeout(function() {
            currentAccount.movements.push(amount);

            
            //Add loan date
            currentAccount.movementsDates.push(new Date().toISOString());
            

            updateUI(currentAccount)

            
            if (timer) clearInterval(timer);
            timer = startLogOutTimer();

        }, 2500);
    }

    inputLoanAmount.value = "";
});


let sorted = false;
btnSort.addEventListener("click", function (event) {
    // body...
    // event.preventDefault();//Me: no need because there is no form
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});

//---------------------------------------------------------
/////////////////////////////////////////////////
/////////////////////////////////////////////////
