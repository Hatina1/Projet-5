const $productSelectedUrl = window.location.href
const $url = new URL($productSelectedUrl)
const $productId = $url.searchParams.get("id")


// Items data info to be collected
const $divImg = document.querySelector('.item__img')
const $itemName = document.querySelector('#title')
const $itemPrice = document.querySelector('#price')
const $itemDescription = document.querySelector('#description')
const $itemColors = document.querySelector('#colors')
const $itemQty = document.querySelector('#quantity')
const $addToCartButton = document.querySelector('#addToCart')
const $addToCartDiv = document.querySelector('.item__content__addButton')
const $linkCart = document.querySelector('ul > a:nth-child(2) > li')
const $divQtySelection = document.querySelector('.item__content__settings__quantity')
const $divColorSelection = document.querySelector('.item__content__settings__color')

const $colorVal = document.createElement("input")
$colorVal.setAttribute('type', "color")
$colorVal.setAttribute('name', 'color-select')
$colorVal.setAttribute('value','#ffffff')
$divColorSelection.appendChild($colorVal)

// Number products in cart 
const $itemsNumber = JSON.parse(localStorage.getItem("cart")).length
if (localStorage.hasOwnProperty('cart') && $itemsNumber >= 1 ) {
    const $cartNumItems = document.createElement("span")
    $linkCart.appendChild($cartNumItems)
    $cartNumItems.textContent = `${$itemsNumber}`
} 


// Fetch request to get product items
const retrieveItemsData = () => fetch(`http://localhost:3000/api/products/${$productId}`)
    .then(res => res.json())
    .catch(err => console.log("What's happening ?", err))


// Create const to get img
const createItemImg = item => {

    const $itemImg = document.createElement('img')
    $itemImg.setAttribute('src', `${item.imageUrl}`)
    $itemImg.setAttribute('alt', `${item.altTxt}`)

    $divImg.appendChild($itemImg);
    return $itemImg
}

let $colorPalette = [

    {color: "Blue", value : "#1F85DE"},
    {color: "White", value : "#ffffff"},
    {color: "Black", value : "#000000"},
    {color: "Black/Yellow", value : "#F4CC0F"},
    {color: "Black/Red", value : "#B53000"},
    {color: "Green", value : "#6A9828"},
    {color: "Red", value : "#F4460F"},
    {color: "Orange", value : "#F48512"},
    {color: "Pink", value : "#DAC0E4"},
    {color: "Grey", value : "#5A555C"},
    {color: "Purple", value : "#B079C4"},
    {color: "Navy", value : "#2E2295"},
    {color: "Silver", value : "#67676B"},
    {color: "Brown", value : "#7A514B"},
    {color: "Yellow", value : "#F8EC3D"}
    
]


const fillItemTable = itemsData => {

    $itemName.textContent = itemsData.name

    $itemPrice.textContent = itemsData.price

    $itemDescription.textContent = itemsData.description

    const values = itemsData.colors
    for (const value of values) {
        var option = document.createElement("option")
        option.value = value
        option.text = value
        $itemColors.appendChild(option)
    }

}


const createQtyMsg = () => {

    //let checkMsgAlready = $divQtySelection.contains(span)
    let checkMsgAlready = $divQtySelection.textContent.includes("Quantité prise en compte !")
    if (!checkMsgAlready) {
        const $qtyMsg = document.createElement('span')
        $qtyMsg.textContent = "  Quantité prise en compte !"

        $divQtySelection.appendChild($qtyMsg)
        return $qtyMsg
    }
    
}

const addProductMsg = () => {

        const $addMsg = document.createElement('div')
        $addMsg.className = "addProductAnim"
        $addMsg.textContent = "Article ajouté!"
        //$addMsg.top = `${e.offsetY-100}px`
        //$addMsg.left = `${e.offsetX}px`
        $addToCartDiv.appendChild($addMsg)

        setTimeout(() => {
            $addMsg.remove()
            //location.reload()
        }, 2500)
}


const main = async () => {

    const itemsData = await retrieveItemsData()

    if (itemsData._id == $productId) {
        createItemImg(itemsData)
        fillItemTable(itemsData)
    }

}

main()


// Create variable of the product to be add in the cart
let productToCart = new Object()

productToCart.id = $productId

$itemQty.addEventListener('change', (e) => {
    productToCart.quantity =  parseInt(e.target.value)
    createQtyMsg()
})

$itemColors.addEventListener('change', (e) => {
    productToCart.color =  e.target.value
    let $colorName = $colorPalette.filter(col => col.color == e.target.value)
    $colorVal.setAttribute('value',`${$colorName[0].value}`)
})

let cartProducts = []
    
if (localStorage.hasOwnProperty('cart')) {

    cartProducts = JSON.parse(localStorage.getItem('cart'))
   
}

// Check the presence of the product in the array 
const checkColorAndIdPresence = (cart, product) => {

    let checkCartIdColor = []
   
    checkCartIdColor = cart.map(product => [product.id,product.color].join(" ")).filter(item => (item == (product.id + " " + product.color)))
    return checkCartIdColor
}

const checkIdPresence = (cart, product) => {

    let checkCartIdPr = []
    
    checkCartIdPr = cart.map(product => product.id).filter(item => (item == product.id))
    return checkCartIdPr
}

const productPosition = (cart, product) => {

    let productPos = 0
    productPos = cart.map(product => [product.id,product.color].join(" ")).indexOf(product.id + " " + product.color)
    return productPos
}


const addProduct = (cart,product) => {
    
    let checkCartIdColor = []
    checkCartIdColor = checkColorAndIdPresence(cart, product)

    let checkCartId = []
    checkCartId = checkIdPresence(cart, product)

    if (cart.length === 0){
        cart.push(product) 
        
    } else if (checkCartId && checkCartId.length && checkCartIdColor && checkCartIdColor.length)  {
        let pos = productPosition(cart, product)
        cart[pos].quantity += product.quantity
        
    } else {
        cart.push(product)
    }

    cart.sort(function(a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 0;
    })

    return cart
}


$addToCartButton.addEventListener('click', () => {
    
    // Initialise the cart if the cart array doesn't already exists

    
    const updatedCart = addProduct(cartProducts, productToCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))

    addProductMsg()
    cartProducts= []
})

    


