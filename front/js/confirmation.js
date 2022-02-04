const $confirmationUrl = window.location.href
const $urlFormatted = new URL($confirmationUrl)
const $orderNum = $urlFormatted.searchParams.get("order")

const $orderId = document.querySelector('#orderId')
$orderId.textContent = $orderNum