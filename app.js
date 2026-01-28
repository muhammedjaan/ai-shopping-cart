const video = document.getElementById("camera");
const cartList = document.getElementById("cart");
const totalSpan = document.getElementById("total");

let total = 0;
let cart = [];

// Prevent double scanning
let lastScanned = "";
let scanCooldown = false;

// Product database
const products = {
  "294017120781": { name: "Nestle 2 in 1 sugar free NESCAFE", price: 1.25 },
  "294011607141": { name: "Lulu Refined table salt 700g", price: 4.25 },
  "5080400872": { name: "Keogh's Irish potato chips cheesy onion", price: 2.00 }
};

// Camera
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }
}).then(stream => {
  video.srcObject = stream;
  startAutoScan();
});

// Add item to cart
function addItem(name, price) {
  cart.push({ name, price });

  const li = document.createElement("li");
  li.textContent = `${name} - $${price.toFixed(2)}`;
  cartList.appendChild(li);

  total += price;
  totalSpan.textContent = total.toFixed(2);
}

// Auto barcode scanning
const codeReader = new ZXing.BrowserBarcodeReader();

function startAutoScan() {
  codeReader.decodeFromVideoDevice(null, video, (result, err) => {
    if (result && !scanCooldown) {
      const code = result.text;

      if (code === lastScanned) return;

      if (products[code]) {
        addItem(products[code].name, products[code].price);
        lastScanned = code;
        scanCooldown = true;

        // Cooldown to avoid multiple scans
        setTimeout(() => {
          scanCooldown = false;
        }, 2000);
      }
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

  cart = [];
  total = 0;
  cartList.innerHTML = "";
  totalSpan.textContent = "0.00";
}
