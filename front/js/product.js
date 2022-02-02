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


const fillItemTable = itemsData => {

    $itemName.textContent = itemsData.name

    $itemPrice.textContent = itemsData.price

    $itemDescription.textContent = itemsData.description

    const values = itemsData.colors

    for (const value of values) {
        var option = document.createElement("option")
        option.value = value
        option.text = value.charAt(0).toUpperCase() + value.slice(1)
        $itemColors.appendChild(option)
    }

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
let productToAddCart = new Object()

productToAddCart.id = $productId

$itemQty.addEventListener('change', (e) => {
    productToAddCart.quantity =  parseInt(e.target.value)
})

$itemColors.addEventListener('change', (e) => {
    productToAddCart.color =  e.target.value
})



// Initialise the cart if the cart array doesn't already exists
let cartAllProducts = []

if (localStorage.hasOwnProperty('cart')) {

     cartAllProducts = JSON.parse(localStorage.getItem('cart'))

} 


// Check the presence of the product in the array 
const checkColorAndIdPresence = (cart, productToAdd) => {

    let checkCartIdColor = []
    
    checkCartIdColor = cart.map(product => [product.id,product.color].join(" ")).filter(item => (item == productToAdd.id + " " + productToAdd.color))
    return checkCartIdColor
}

const checkIdPresence = (cart, productToAdd) => {

    let checkCartIdPr = []
    
    checkCartIdPr = cart.map(product => product.id).filter(item => (item == productToAdd.id))
    return checkCartIdPr
}

const productPosition = (cart, productToAdd) => {

    let productPos = 0
    console.log("paire id color :" + cart.map(product => [product.id,product.color].join(" ")))
    console.log("index :" + productToAdd.id + " " + productToAdd.color)
    productPos = cart.map(product => [product.id,product.color].join(" ")).indexOf(productToAdd.id + " " + productToAdd.color)
    return productPos
}

const sameIdColor = (cart, productToAdd) => {

    let sameProduct = []

    sameProduct = cart.filter(item => item.id == productToAdd.id).filter(item => item.color == productToAdd.color)

}




const checkCart = (cart,productToAdd) => {
    
    let checkCartIdColor = []
    checkCartIdColor = checkColorAndIdPresence(cart, productToAdd)

    let checkCartId = []
    checkCartId = checkIdPresence(cart, productToAdd)

    let pos = productPosition(cart, productToAdd)
    console.log("la val de pos :" + pos)

    if (cart.length === 0){
        console.log("le panier etait vide")
        cart.push(productToAdd) 
        
    } else if (checkCartId && checkCartId.length && checkCartIdColor && checkCartIdColor.length)  {
        console.log("meme produit")
        console.log("la qté dans le panier :" + cart[pos].quantity)
        console.log("la qté dans l'article :" + productToAdd.quantity)
        cart[pos].quantity += productToAdd.quantity
        
    } else {
        console.log("produit ou couleur differente")
        cart.push(productToAdd)
    }

    return cart
}


$addToCartButton.addEventListener('click', () => {
    
    // e.preventDefault()
    
    const updatedCart = checkCart(cartAllProducts, productToAddCart)
     
    localStorage.setItem('cart', JSON.stringify(updatedCart))
     
})

    


//JSON.parse(localStorage.getItem(updatedCart))

