// Section where products will be added dynamically  
const $cartItems = document.querySelector('#cart__items')
const $totalQty = document.querySelector('#totalQuantity')
const $totalAmount = document.querySelector('#totalPrice')

 // Cart in storage
let $itemsLocalSt = JSON.parse(localStorage.getItem('cart'))

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


        const $itemDivDelete = document.createElement('div')
        $itemDivDelete.classList.add('cart__item__content__settings__delete')
        const $itemDelete = document.createElement('p')
        $itemDelete.textContent = "Supprimer"
        $itemDelete.classList.add('delete__item')

        $itemDivDelete.appendChild($itemDelete)
        $itemDivContentSet.appendChild($itemDivDelete)


    return $itemDivContentSet
}

const calculateTotal = (itemsData, item) => {

    let $prod = item.id
    let $itemElem = itemsData.find(elem => elem._id === $prod)

    const $qty = item.quantity
    const $price = $itemElem.price
    const $amount = $qty * $price

    const $total = []
    $total.quantity = $qty 
    $total.amount = $amount

    return $total

} 

// Main function with for each loop to retrieve data and create articles
const main = async () => {

    const itemsData = await retrieveItemsData()
   
    $itemsLocalSt.forEach(elem => $cartItems.appendChild(createCart(itemsData, elem)))

    const $totalQtyAmount = []
    for (let i = 0; i < $itemsLocalSt.length; i++) {
        if ($itemsLocalSt[i]) {
            const $amountQtyTable =  calculateTotal(itemsData, $itemsLocalSt[i])
            $totalQtyAmount.push($amountQtyTable)
        }
    }

    var $totalQ = $totalQtyAmount.reduce(function (accumulator, item) {
        return accumulator + item.quantity;
      }, 0)

    var $totalA = $totalQtyAmount.reduce(function (accumulator, item) {
    return accumulator + item.amount;
    }, 0)

    $totalQty.textContent = `${$totalQ}`
    $totalAmount.textContent = `${euro.format($totalA)}`

    
}

main()





////////////////////////////////////////////////////////////////////////////////


// Modify quantity function used when quantity is changed
const modifyQty = (cart, id, color, qtyValue) => {

    let itemQtyToModify = 0
    itemQtyToModify = cart.map(product => [product.id,product.color].join(" ")).indexOf(id + " " + color)
    
    cart[itemQtyToModify].quantity =  qtyValue
    
    return cart
} 



document.addEventListener('change',function(e){
    if(e.target && e.target.className== 'itemQuantity'){

        let $idItemToModify = e.target.closest("article").dataset.id
        let $colorItemToModify = e.target.closest("article").dataset.color
    
        let $newQty = 0
        $newQty =  parseInt(e.target.value)
    
        const updatedQtyCart =  modifyQty($itemsLocalSt, $idItemToModify, $colorItemToModify, $newQty)

        localStorage.setItem('cart', JSON.stringify(updatedQtyCart))
     }
})




// Delete item when suppress is clicked
const deleteItem = (cart, id, color) => {

    let $itemToDelete = 0
    $itemToDelete = cart.map(product => [product.id,product.color].join(" ")).indexOf(id + " " + color)
    
    cart.splice($itemToDelete, 1)

    return cart

} 


document.addEventListener('click',function(e){
    if(e.target && e.target.className== 'delete__item'){

        let $idItemToDelete = e.target.closest("article").dataset.id
        let $colorItemToDelete = e.target.closest("article").dataset.color

        const updatedCartAfterDelete = deleteItem($itemsLocalSt, $idItemToDelete, $colorItemToDelete)

        localStorage.setItem('cart', JSON.stringify(updatedCartAfterDelete))
        e.target.closest("article").remove()
    }
})




////////////////////////////////////////////////////////////////////////////////


// Contact details info to be collected
const $paymentForm = document.querySelector('#cart__order__form')
const $submitForm = document.querySelector('#cart__order__form__submit')
const $inputSubmit = document.querySelector('#order')
const $firstName = document.querySelector('#firstName')
const $lastName = document.querySelector('#lastName')
const $address = document.querySelector('#address')
const $city = document.querySelector('#city')
const $email = document.querySelector('#email')


// Error messages
const $firstNameErrorMsg = document.querySelector('#firstNameErrorMsg')
const $lastNameErrorMsg = document.querySelector('#lastNameErrorMsg')
const $addressErrorMsg = document.querySelector('#addressErrorMsg')
const $cityErrorMsg = document.querySelector('#cityErrorMsg')
const $emailErrorMsg = document.querySelector('#emailErrorMsg')


// check inputs and show error messages
const handleErrorMsg = contact => {

    if (contact.$firstName != "Hata") {
        $firstNameErrorMsg.textContent = "Le prénom doit contenir au moins deux lettre et une majuscule"

        $lastNameErrorMsg.textContent = "Le prénom doit contenir au moins deux lettre et une majuscule"

        $addressErrorMsg.textContent = "Numéro, type de voie et nom de la voie"

        $cityErrorMsg.textContent = "Ville"

        $emailErrorMsg.textContent = "Format requis : aaaa@xxxx.com"
    }
}

// data to retrieve from the form
let $contact = new Object()

$firstName.addEventListener('change', (e) => {
    $contact.firstName =  e.target.value
})
console.log("contacts:" + $contact)

$lastName.addEventListener('change', (e) => {
    $contact.lastName =  e.target.value
})
$address.addEventListener('change', (e) => {
    $contact.address =  e.target.value
})
$city.addEventListener('change', (e) => {
    $contact.city =  e.target.value
})
$email.addEventListener('change', (e) => {
    $contact.email =  e.target.value
})
console.log("contacts:" + $contact)

let $products = []
$products = $itemsLocalSt.map(elem => elem.id)

let orderDetails = new Object()
orderDetails.contact = $contact
orderDetails.products = $products


// Fetch request to get product items
const retrieveForm = () => 
fetch("http://localhost:3000/api/products/order", { 
    method: 'POST',
    headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderDetails)
})
.then(res => res.json())
.catch(err => console.log("What's happening ?", err))
//.then(response => success(response))


// method for retrieve form details and check contact details correctness
const cartOrderSubmit = async () => {

    const $formDetails = await retrieveForm()

    // const $contactDetails = $formDetails.contact
    //handleErrorMsg($contactDetails)

    const $orderNum = $formDetails.orderId
    window.location.href= `../html/confirmation.html?order=${$orderNum}`

}


document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'order'){

        e.preventDefault()

        const $orderId = cartOrderSubmit()
        console.log($orderId)

     }
})