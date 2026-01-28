const cartList = document.getElementById("cart");
const totalSpan = document.getElementById("total");

let cart = [];
let total = 0;

let lastScanned = "";
let cooldown = false;

// Product database (example barcodes)
const products = {
  "0123456789012": { name: "Milk", price: 1.50 },
  "1234567890123": { name: "Bread", price: 1.00 },
  "2345678901234": { name: "Chips", price: 2.00 }
};

function addItem(name, price) {
  cart.push({ name, price });

  const li = document.createElement("li");
  li.textContent = `${name} - $${price.toFixed(2)}`;
  cartList.appendChild(li);

  total += price;
  totalSpan.textContent = total.toFixed(2);
}

// Reset any broken streams
if (window.Quagga) {
  Quagga.stop();
}

// Start camera + scanner
Quagga.init({
  inputStream: {
    name: "Live",
    type: "LiveStream",
    target: document.querySelector("#scanner"),
    constraints: {
      facingMode: { exact: "environment" },
      width: { min: 640 },
      height: { min: 480 }
    }
  },
  decoder: {
    readers: ["ean_reader", "ean_13_reader", "upc_reader"]
  },
  locate: true
}, function (err) {
  if (err) {
    console.error(err);
    alert("Camera failed to start");
    return;
  }
  Quagga.start();
});

// Auto scan handler
Quagga.onDetected(function (result) {
  if (cooldown) return;

  const code = result.codeResult.code;
  if (code === lastScanned) return;

  if (products[code]) {
    const item = products[code];
    addItem(item.name, item.price);

    lastScanned = code;
    cooldown = true;

    setTimeout(() => {
      cooldown = false;
    }, 2500);
  }
});

// Checkout receipt
function checkout() {
  let receipt = "SmartCart🛒 Receipt\n\n";

  cart.forEach(item => {
    receipt += `${item.name}  $${item.price.toFixed(2)}\n`;
  });

  receipt += "\n----------------\n";
  receipt += `Total: $${total.toFixed(2)}\n`;
  receipt += "\nThank you!";

  alert(receipt);

  cart = [];
  total = 0;
  cartList.innerHTML = "";
  totalSpan.textContent = "0.00";
  lastScanned = "";
}
