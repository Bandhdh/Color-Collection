const colorItem = document.querySelectorAll('.colors__item');
const colorItemAdd = document.querySelectorAll('.add-collection')
const reload = document.querySelector('.colors__img');
const listCollection = document.querySelector('.collerction__list');
const cursorElement = document.querySelector('.colors__cursor');
const popupItms = document.querySelector('.popup__items');
const editBtn = document.querySelectorAll('.edit-collection');


//создаём пустой массив в localStorage если его нет
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem('list') == null) {
    localStorage.setItem('list', JSON.stringify([]))
  }else{
    reloadCollectionlast()
    reloadCollection()
  }
});



reloadColors()
reload.addEventListener('click', () => {

  reloadColors()

  let pikerDefault = document.querySelector('.colors__hex').innerHTML;
  colorjoePicer.set(pikerDefault);
})

colorItemAdd.forEach(item => {
  item.addEventListener('click',() => {

    let color = item.closest('.color-wrapper').querySelector('.hex-text').innerHTML;


    //Если цвет уже есть в списке то он не добавляется повторно
    if (!localStorage.list.includes(color)) {
      addToStorage(color);

      reloadCollectionlast()

      popupItms.innerHTML = '';
      reloadCollection();
    }
  })
});

editBtn.forEach(item => {
  item.addEventListener('click', () => {
    editColor(item)
  })
})

function editColor(element) {
  let editedColor = element.closest('.color-wrapper').querySelector('.hex-text').innerHTML;
  colorjoePicer.set(editedColor)
}

// Копирование текста(HEX) в буфер обмена
let timer;
document.addEventListener('click', (event) => {
  copyHex(event)
})

function copyHex(event) {
  let hex = event.target.closest('.hex-text');

  if (hex != null) {

    clearTimeout(timer)

    navigator.clipboard.writeText(hex.innerHTML);

    let curentColor = hex.innerHTML;
    document.querySelector('.colors__cursor-current').style.background = curentColor;

    cursorElement.style.display = 'flex'
    trackingMouse(event)
    document.addEventListener('mousemove', trackingMouse);


    timer = setTimeout(() => {
      document.removeEventListener('mousemove', trackingMouse)
      cursorElement.style.display = 'none';
    }, 1200);
  }
}


function trackingMouse(event) {
  cursorElement.style.left = event.clientX + 'px'
  cursorElement.style.top = event.clientY - 28 + 'px'
}

function reloadColors() {
  colorItem.forEach(item => {

    hexColor = getRandomColor();
    item.style.background = hexColor;

    item.querySelector('.colors__hex').innerHTML = hexColor;
  });
}


function getRandomColor() {

  const hexCode = '0123456789ABCDEF'
  let color = ''

  for(let i = 0; i < 6; i++){
    color += hexCode[Math.floor(Math.random() * hexCode.length)]
  }

  return '#' + color;
}

function addToStorage(color) {
  let oldStorage = JSON.parse(localStorage.getItem('list'));
  oldStorage.unshift(color);
  localStorage.setItem('list', JSON.stringify(oldStorage))
}

function reloadCollection() {

  let collection = JSON.parse(localStorage.getItem('list'))

  collection.forEach(hex => {

    let popupElement = 
    `<li class="popup__item color-wrapper">
        <div class="popup__color" style="background-color: ${hex}"></div>
        
        <div class="popup__color-edit hint-wrapper edit-collection">
          <div class="hint">edit color</div>
          <img src="img/edit.svg" alt="edit">
        </div>

        <div class="popup__color-remove hint-wrapper">
          <div class="hint">remove color</div>
          <img src="img/remove.svg" alt="remove">
        </div>

        <div class="popup__hex-wrapper hint-wrapper">
          <div class="hint">copy HEX</div>
          <p class="popup__hex hex-text">${hex}</p>
        </div>
      </li>`

    popupItms.insertAdjacentHTML("afterbegin", popupElement)
  });

}

function reloadCollectionlast() {

  listCollection.innerHTML = '';
  let collection = JSON.parse(localStorage.getItem('list'))

  for (let i = 0; i < 4; i++) {

    if (collection[i] != undefined) {
      let listCollectionItemHtml = `
        <button class="collerction__item">
          <div class="collerction__color" style="background-color: ${collection[i]}"></div>
          <p class="collerction__hex">${collection[i]}</p>
        </button>`
      listCollection.insertAdjacentHTML("beforeend", listCollectionItemHtml);
    }
  }
}

// Picer Color
let blockColor = document.querySelector('.collerction__curent-collor');
let blockHex = document.querySelector('.collerction__curent-hex');
let pikerDefault = document.querySelector('.colors__hex').innerHTML;

const colorjoePicer = colorjoe.rgb(document.querySelector('.colorjoe'));

colorjoePicer.set(pikerDefault)
colorjoePicer.show()

blockColor.style.background = pikerDefault;
blockHex.innerHTML = pikerDefault;

colorjoePicer.on('change', (color) => {

  blockColor.style.background = color.hex();
  blockHex.innerHTML = color.hex().toUpperCase();

})



// PopUp //

const popupBtn = document.querySelector('.collerction__all');
const popupMask = document.querySelector('.popup__mask');
const popupList = document.querySelector('.popup__list');
const popupClose = document.querySelector('.popup__close');
const popupEdit = document.querySelectorAll('.popup__color-edit');



popupClose.addEventListener('click', () => {
  closePopup()
})

popupList.addEventListener('click', (event) => {
  event.stopPropagation();

  if (event.target.closest('.hint-wrapper')) {
    copyHex(event)
  }
  if (event.target.closest('.edit-collection')) {
    editColor(event.target)
    closePopup()
  }
  if (event.target.closest('.popup__color-remove')) {
    let curentColor = event.target.closest('.popup__item').querySelector('.hex-text').innerHTML;
    let colorsList = JSON.parse(localStorage.list);
    let newList = colorsList.filter(color => color != curentColor);

    localStorage.setItem('list', JSON.stringify(newList));
    
    reloadCollectionlast();

    popupItms.innerHTML = '';
    reloadCollection();
  }

})

popupBtn.addEventListener('click', () => {
  popupMask.style.zIndex = '100'
  popupMask.classList.add('active');
  popupList.classList.add('active');
})

popupMask.addEventListener('click', () => {
  closePopup();
})

//Обработка нажатия esc для popup
document.addEventListener('keydown', (event) => {
  if (event.key == 'Escape') {
    closePopup();
  }
})

function closePopup() {
  popupMask.classList.remove('active');
  setTimeout(() => {
    popupMask.style.zIndex = '-100'
    document.querySelector('.popup__items').scrollTop = 0;
  }, 300);
  popupList.classList.remove('active');
}