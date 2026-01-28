const video = document.getElementById("camera");
const cartList = document.getElementById("cart");
const totalSpan = document.getElementById("total");

let total = 0;
let cart = [];

// Fake product database
const products = {
  "0123456789012": { name: "Milk", price: 1.50 },
  "1234567890123": { name: "Bread", price: 1.00 },
  "2345678901234": { name: "Chips", price: 2.00 }
};

// Camera
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }
}).then(stream => {
  video.srcObject = stream;
});

// Add item
function addItem(name, price) {
  cart.push({ name, price });

  const li = document.createElement("li");
  li.textContent = `${name} - $${price.toFixed(2)}`;
  cartList.appendChild(li);

  total += price;
  totalSpan.textContent = total.toFixed(2);
}

// Barcode scanning
const codeReader = new ZXing.BrowserBarcodeReader();

function startBarcodeScan() {
  codeReader.decodeOnceFromVideoDevice(null, video)
    .then(result => {
      const code = result.text;

      if (products[code]) {
        const item = products[code];
        addItem(item.name, item.price);
      } else {
        alert("Unknown product: " + code);
      }
    });
}

// Checkout
function checkout() {
  let receipt = "AI Shopping Cart\n\n";

  cart.forEach(item => {
    receipt += `${item.name}  $${item.price.toFixed(2)}\n`;
  });

  receipt += "\n----------------\n";
  receipt += `Total: $${total.toFixed(2)}\n`;

  alert(receipt);

  // Reset
  cart = [];
  total = 0;
  cartList.innerHTML = "";
  totalSpan.textContent = "0.00";
}
