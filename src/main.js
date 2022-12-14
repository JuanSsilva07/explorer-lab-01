import "./css/index.css"
import IMask from "imask"

const ccColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path ")
const ccColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path ")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#DF6F29", "#C69347"],
    americanexpress: ["#213239", "#3590B5"],
    discover: ["#D87204", "#F4AA5E"],
    diners: ["#2D4F9E", "#486FC9"],
    unionpay: ["#01798A" , "#024381"],
    maestro: ["#CC2131","#C04954"],
    default: ["black", "gray"],
  }
  ccColor01.setAttribute("fill", colors[type][0])
  ccColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

/* Security Code */

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

/* Blocks efetuando limitação no campo de data */

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

/* Utilizando Regex para parâmetros dos números de cartões */

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 000000 00000",
      regex: /^3[4-7]\d{0,13}/,
      cardtype: "americanexpress",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
      cardtype: "discover",
    },
    {
      mask: "0000 000000 0000",
      regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
      cardtype: "diners",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^62\d{0,14}/,
      cardtype: "unionpay",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
      cardtype: "maestro",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

/* Pegando o evento de click no botão do form e retirando o reloading padrão do forms */

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão Adicionado")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

/* Inserindo o nome digitado no layout do cartão */

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

/* Capturando e inserindo conteúdo do CVC */

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecutiry = document.querySelector(".cc-security .value")
  ccSecutiry.innerText = code.length === 0 ? "123" : code
}

/* Capturando e inserindo conteúdo do número do cartão e alterando o layout do cartão para a bandeira correspondente */

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9123 4567" : number
}

/* Capturando e inserindo conteúdo da data de expiração do cartão */

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}



/*   Para adicionar posteriormente 
const cardsDynamicMasks = [

    {
        mask: '0000 000000 00000',
        regex: /^(?:2131|1800)\d{0,11}/,
        cardtype: 'chase'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^(?:35\d{0,2})\d{0,12}/,
        cardtype: 'jcb'
    },
]
*/
