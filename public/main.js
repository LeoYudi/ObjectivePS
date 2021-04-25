class Session {
  constructor() {
    this.traitIndex = -1;
    this.foodIndex = -1;
    this.currentString = '{var}';
    this.createFood = {};
    this.data = [];
    this.onTrait = true;
    this.modalMain = document.querySelector('.modal-main');
    this.modalQuestion = document.querySelector('.modal-question');
    this.modalFood = document.querySelector('.modal-food');
    this.modalTrait = document.querySelector('.modal-trait');
    this.modalDone = document.querySelector('.modal-done');
    this.questionText = document.querySelector('.modal-window .window-text.question');
    this.traitText = document.querySelector('.modal-window .window-text.trait');
  }

  async reset() {
    this.traitText.innerHTML = this.traitText.innerHTML.replace('bolo de chocolate', '{food2}');
    if (this.foodIndex !== -1)
      this.traitText.innerHTML = this.traitText.innerHTML.replace(this.data[this.traitIndex].foods[this.foodIndex].name, '{food1}');

    this.traitText.innerHTML = this.traitText.innerHTML.replace(this.createFood.food, '{food1}');

    this.traitIndex = -1;
    this.foodIndex = -1;
    this.createFood = {};
    this.data = await fetch('http://localhost:3333/all').then(response => response.json());
    this.onTrait = true;

    if (!this.modalMain.classList.contains('hidden'))
      this.modalMain.classList.add('hidden');

    if (!this.modalQuestion.classList.contains('hidden'))
      this.modalQuestion.classList.add('hidden');

    if (!this.modalFood.classList.contains('hidden'))
      this.modalFood.classList.add('hidden');

    if (!this.modalTrait.classList.contains('hidden'))
      this.modalTrait.classList.add('hidden');

    if (!this.modalDone.classList.contains('hidden'))
      this.modalDone.classList.add('hidden');

    this.setText('{var}');
  }

  setText(string) {
    this.questionText.innerHTML = this.questionText.innerHTML.replace(this.currentString, string);
    this.currentString = string;
  }

  async newFood() {
    console.log(this.createFood);
    await fetch('http://localhost:3333/food', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.createFood)
    }).then(response => response.json());
  }

  nextTrait() {
    if (this.traitIndex + 1 < this.data.length) {
      this.traitIndex++;
      this.setText(this.data[this.traitIndex].name);
    }
    else if (this.currentString === 'bolo de chocolate') {
      this.modalQuestion.classList.add('hidden');
      this.modalFood.classList.remove('hidden');
    }
    else {
      this.setText('bolo de chocolate');
    }
  }

  nextFood() {
    if (this.foodIndex + 1 < this.data[this.traitIndex].foods.length) {
      this.foodIndex++;
      this.setText(this.data[this.traitIndex].foods[this.foodIndex].name);
    } else {
      this.modalQuestion.classList.add('hidden');
      this.modalFood.classList.remove('hidden');
    }
  }

  finish() {
    this.modalQuestion.classList.add('hidden');
    this.modalDone.classList.remove('hidden');
  }
}

let session;
window.onload = async function () {
  session = new Session();
  session.data = await fetch('http://localhost:3333/all').then(response => response.json());
  console.log(session.data);
}

let start = document.querySelector('.start');
start.addEventListener('click', function (e) {
  e.preventDefault();
  session.nextTrait();
  session.modalMain.classList.remove('hidden');
  session.modalQuestion.classList.remove('hidden');
});

let yes = document.querySelector('.yes');
yes.addEventListener('click', function (e) {
  e.preventDefault();

  if (session.onTrait) {
    session.onTrait = false;
    session.nextFood();
  } else {
    session.finish();
  }
})

let no = document.querySelector('.no');
no.addEventListener('click', function (e) {
  e.preventDefault();

  if (session.onTrait)
    session.nextTrait();
  else
    session.nextFood();

});

let restart = document.querySelectorAll('.restart');
restart.forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    await session.reset();
  });
});

let newFood = document.querySelector('.new-food');
newFood.addEventListener('click', function (e) {
  e.preventDefault();
  let inputFood = document.querySelector('.modal-food .input-div input').value;
  session.traitText.innerHTML = session.traitText.innerHTML.replace('{food1}', inputFood);
  session.traitText.innerHTML = session.traitText.innerHTML.replace('{food2}', session.currentString);
  session.createFood.food = inputFood;
  session.modalFood.classList.add('hidden');
  session.modalTrait.classList.remove('hidden');
});

let newTrait = document.querySelector('.new-trait');
newTrait.addEventListener('click', async function (e) {
  e.preventDefault();
  let inputTrait = document.querySelector('.modal-trait .input-div input').value;
  session.createFood.trait = inputTrait;
  await session.newFood();
  await session.reset();
});