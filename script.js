// script.js

let cart = JSON.parse(localStorage.getItem('cart')) || {};

function updateLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
  // Optional: Add logic here to update the cart icon or count
}

// Add event listeners for + and - buttons
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');

  items.forEach(item => {
    const text = item.childNodes[0].nodeValue.trim();
    const [priceStr, ...nameParts] = text.split(' ');
    const price = parseFloat(priceStr.replace('₱', ''));
    const name = nameParts.join(' ');

    const [minusBtn, plusBtn] = item.querySelectorAll('button');

    minusBtn.addEventListener('click', () => {
      if (cart[name]) {
        cart[name].qty--;
        if (cart[name].qty === 0) delete cart[name];
        updateLocalStorage();
        updateCartDisplay();
      }
    });

    plusBtn.addEventListener('click', () => {
      if (!cart[name]) cart[name] = { price, qty: 0 };
      cart[name].qty++;
      updateLocalStorage();
      updateCartDisplay();
    });
  });

  const viewCartBtn = document.querySelector('.view-cart');
  if (viewCartBtn) {
    viewCartBtn.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }

  if (window.location.pathname.includes('checkout.html')) {
    displayCheckout();
  } else if (window.location.pathname.includes('summary.html')) {
    displaySummary();
  } else if (window.location.pathname.includes('receipt.html')) {
    displayReceipt();
  }
});

function displayCheckout() {
  const list = document.getElementById('checkout-list');
  list.innerHTML = '';
  for (let [name, { price, qty }] of Object.entries(cart)) {
    const li = document.createElement('li');
    li.textContent = `${name} x${qty} - ₱${price * qty}`;
    list.appendChild(li);
  }
}

function goToSummary() {
  window.location.href = 'summary.html';
}

function displaySummary() {
  const tableBody = document.querySelector('#summary-table tbody');
  tableBody.innerHTML = '';
  let total = 0;

  for (let [name, { price, qty }] of Object.entries(cart)) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td>${qty}</td><td>₱${price * qty}</td>`;
    tableBody.appendChild(tr);
    total += price * qty;
  }

  const trTotal = document.createElement('tr');
  trTotal.innerHTML = `<td colspan="2"><strong>Total</strong></td><td><strong>₱${total}</strong></td>`;
  tableBody.appendChild(trTotal);
}

function goToReceipt() {
  const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
  localStorage.setItem('payment', selectedPayment);
  window.location.href = 'receipt.html';
}

function displayReceipt() {
  const receiptDiv = document.getElementById('receipt');
  const payment = localStorage.getItem('payment');
  let total = 0;
  let receiptHTML = `<ul>`;

  for (let [name, { price, qty }] of Object.entries(cart)) {
    const subtotal = price * qty;
    total += subtotal;
    receiptHTML += `<li>${name} x${qty} - ₱${subtotal}</li>`;
  }

  receiptHTML += `</ul>`;
  receiptHTML += `<p><strong>Total: ₱${total}</strong></p>`;
  receiptHTML += `<p><strong>Payment Method: ${payment}</strong></p>`;

  receiptDiv.innerHTML = receiptHTML;

  // Optional: Clear cart after displaying receipt
  localStorage.removeItem('cart');
  localStorage.removeItem('payment');
}
