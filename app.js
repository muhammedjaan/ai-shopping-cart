const video = document.getElementById("camera");
const cartList = document.getElementById("cart");
const totalSpan = document.getElementById("total");

let total = 0;

navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }
}).then(stream => {
  video.srcObject = stream;
}).catch(() => {
  alert("Camera access denied");
});

function addItem(name, price) {
  const li = document.createElement("li");
  li.textContent = `${name} - $${price.toFixed(2)}`;
  cartList.appendChild(li);

  total += price;
  totalSpan.textContent = total.toFixed(2);
}

const codeReader = new ZXing.BrowserBarcodeReader();

function startBarcodeScan() {
  codeReader.decodeOnceFromVideoDevice(null, video)
    .then(result => {
      addItem("Packaged Item", 1.50);
      alert("Barcode scanned: " + result.text);
    });
}

function readWeight() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  Tesseract.recognize(canvas, "eng", {
    tessedit_char_whitelist: "0123456789."
  }).then(({ data }) => {
    const match = data.text.match(/\d+(\.\d+)?/);
    if (!match) {
      alert("Weight not detected");
      return;
    }

    const weight = parseFloat(match[0]);
    const price = weight * 3.0;
    addItem(`Fruit (${weight} kg)`, price);
  });
}
