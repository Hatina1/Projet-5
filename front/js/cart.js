// Section where products will be added dynamically  
const $cartItems = document.querySelector('#cart__items')

// format price
const euro = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  })

// Fetch request to get product items
const retrieveItemsData = () => fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .catch(err => console.log("What's happening ?", err))


// Create article tag which contains img, name and description
const createCart = (itemsData, item) => {
    const $itemCart = document.createElement('article')
    $itemCart.classList.add('cart__item')
    $itemCart.setAttribute('data-id', `${item.id}`)
    $itemCart.setAttribute('data-color', `${item.color}`)

    let product = $itemCart.dataset.id
    let itemDataElem = itemsData.find(elem => elem._id === product)

    const $itemDivImg = createDivImg(itemDataElem)
    const $itemDivContent = createDivContent(itemDataElem, item)

    // Add img and info
    $itemCart.appendChild($itemDivImg)
    $itemCart.appendChild($itemDivContent)


    return $itemCart
} 

// Create variables to get img, name and description
const createDivImg = item => {

    const $itemDivImg = document.createElement('div')
    $itemDivImg.classList.add('cart__item__img')

    const $itemImg = document.createElement('img')
    $itemImg.setAttribute('src', `${item.imageUrl}`)
    $itemImg.setAttribute('alt', `${item.altTxt}`)

    $itemDivImg.appendChild($itemImg)

    return $itemDivImg
}


// Create variables to get content
const createDivContent= (itemDataElem, item) => {

    const $itemDivContent = document.createElement('div')
    $itemDivContent.classList.add('cart__item__content')

    const $itemDivContentDesc = createDivContentDesc(itemDataElem, item)
    const $itemDivContentSet = createDivContentSettings(item)

    $itemDivContent.appendChild($itemDivContentDesc)
    $itemDivContent.appendChild($itemDivContentSet)

    return $itemDivContent
}


// Create variables to get description
const createDivContentDesc= (itemDataElem, item) => {

    const $itemDivContentDesc = document.createElement('div')
    $itemDivContentDesc.classList.add('cart__item__content__description')


        const $itemName = document.createElement('h2')
        $itemName.textContent = `${itemDataElem.name}`

        const $itemColor = document.createElement('p')
        $itemColor.textContent = `${item.color}`

        const $itemPrice = document.createElement('p')
        $itemPrice.textContent = `${euro.format(itemDataElem.price)}`

        $itemDivContentDesc.appendChild($itemName)
        $itemDivContentDesc.appendChild($itemColor)
        $itemDivContentDesc.appendChild($itemPrice)

    return $itemDivContentDesc
}

const createDivContentSettings= item => {

    const $itemDivContentSet = document.createElement('div')
    $itemDivContentSet.classList.add('cart__item__content__settings')


        const $itemDivContentSetQty = document.createElement('div')
        $itemDivContentSetQty.classList.add('cart__item__content__settings__quantity')
        const $itemDivQty = document.createElement('div')
        
        const $itemQtyLabel = document.createElement('p')
        $itemQtyLabel.textContent = "Qté : "

        const $itemQty = document.createElement('input')
        $itemQty.textContent = parseInt(`${item.quantity}`)
        $itemQty.classList.add('itemQuantity')
        $itemQty.setAttribute('type', Number)
        $itemQty.setAttribute('name', 'itemQuantity')
        $itemQty.setAttribute('min', 1)
        $itemQty.setAttribute('max', 100)
        $itemQty.setAttribute('value', `${item.quantity}`)

        $itemDivContentSetQty.appendChild($itemQtyLabel)
        $itemDivContentSetQty.appendChild($itemQty)

        $itemDivContentSet.appendChild($itemDivContentSetQty)


        const $itemDivContentSetDel = document.createElement('div')
        $itemDivContentSetDel.classList.add('cart__item__content__settings__delete')
        const $itemDivContSetDelSupp = document.createElement('p')
        $itemDivContSetDelSupp.textContent = "Supprimer"
        $itemDivContSetDelSupp.classList.add('delete__item')

        $itemDivContentSetDel.appendChild($itemDivContSetDelSupp)
        $itemDivContentSet.appendChild($itemDivContentSetDel)


    return $itemDivContentSet
}




// Loop for used to create item card from the get request
const main = async () => {

    const itemsData = await retrieveItemsData()
    // Cart in storage
    let $itemsCart = JSON.parse(localStorage.getItem('cart'))

    $itemsCart.forEach(elem => $cartItems.appendChild(createCart(itemsData, elem)))
    

}

main()