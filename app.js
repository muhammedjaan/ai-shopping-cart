// Get elements
const cartList = document.getElementById("cart");
const totalSpan = document.getElementById("total");

// Cart data
let cart = [];
let total = 0;

// Prevent duplicate scans
let lastScanned = "";
let cooldown = false;

// Simple product database (you can add more)
const products = {
  "294017120781": { name: "Nestle 2 in 1 sugar free NESCAFE", price: 1.25 },
  "294011607141": { name: "Lulu Refined table salt 700g", price: 4.25 },
  "5080400872": { name: "Keogh's Irish potato chips cheesy onion", price: 2.00 }
};

// Add item to cart
function addItem(name, price) {
  cart.push({ name, price });

  const li = document.createElement("li");
  li.textContent = `${name} - $${price.toFixed(2)}`;
  cartList.appendChild(li);

  total += price;
  totalSpan.textContent = total.toFixed(2);
}

// Initialize Quagga
Quagga.init(
  {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#scanner"),
      constraints: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    },
    decoder: {
      readers: ["ean_reader", "ean_13_reader", "upc_reader"]
