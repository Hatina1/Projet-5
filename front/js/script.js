// Section where items will be added dynamically  
const $items = document.querySelector('#items')


 // Show number of products in cart
 const $linkCart = document.querySelector('ul > a:nth-child(2) > li')

 const  showItemsQtyInCart = () => {

    const $itemsNumber = JSON.parse(localStorage.getItem("cart")).length 
 
    var span = document.querySelector("span")
    var classes = span.classList
    var $checkcartNumItems = classes.contains('itemsQtyInCart')

    if ($checkcartNumItems) {
        const $cartNumItemsModif = document.querySelector('.itemsQtyInCart')
        $cartNumItemsModif.textContent = `${$itemsNumber}`

    } else if (localStorage.hasOwnProperty('cart') && $itemsNumber >= 1 ) {
        const $cartNumItems = document.createElement("span")
        $cartNumItems.classList.add('itemsQtyInCart')
        $linkCart.appendChild($cartNumItems)
        $cartNumItems.textContent = `${$itemsNumber}`
    } 
}

// Fetch request to get product items
const retrieveItemsData = () => fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .catch(err => console.log("What's happening ?", err))


// Create card item
const createItemCard = item => {
    const $itemCard = document.createElement('a')
    // ajouter un attribut href avec l'id du produit 
    $itemCard.setAttribute('href', `../html/product.html?id=${item._id}`)
    const $itemCardArt = createItemCardArt(item)
    $itemCard.appendChild($itemCardArt)
    return $itemCard
} 

// Create article tag which contains img, name and description
const createItemCardArt = item => {
    const $itemCardArt = document.createElement('article')

    const $itemImg = createItemCardImg(item)
    const $itemName = createItemCardName(item)
    const $itemDesc = createItemCardDesc(item)
    // Add img and info
    $itemCardArt.appendChild($itemImg)
    $itemCardArt.appendChild($itemName)
    $itemCardArt.appendChild($itemDesc)

    return $itemCardArt
} 

// Create variables to get img, name and description
const createItemCardImg = item => {
    const $itemImg = document.createElement('img')
    $itemImg.setAttribute('src', `${item.imageUrl}`)
    $itemImg.setAttribute('alt', `${item.altTxt}`)

    return $itemImg
}

const createItemCardName = item => {
    
    const $itemName = document.createElement('h3')
    $itemName.classList.add('productName')
    $itemName.textContent = `${item.name}`

    return $itemName
}

const createItemCardDesc = item => {
    
    const $itemDesc = document.createElement('p')
    $itemDesc.classList.add('productDescription')
    $itemDesc.textContent = `${item.description}`

    return $itemDesc
}


// Loop for used to create item card from the get request
const main = async () => {

    const itemsData = await retrieveItemsData()

    for (let i = 0; i < itemsData.length; i++) {
        if (itemsData[i]) {
            $items.appendChild(createItemCard(itemsData[i]))
        }
    }

}

main()
showItemsQtyInCart()