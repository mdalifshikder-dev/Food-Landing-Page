// Verde & Saffron Food Landing Page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  const currency = "$";
  const deliveryFee = 2.99;
  const freeThreshold = 35;

  // 1. Category Filtering
  const filterButtons = document.querySelectorAll(".category-filter-btn");
  const foodCards = document.querySelectorAll(".food-item");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("btn-success");
        b.classList.add("btn-outline-success");
      });
      btn.classList.remove("btn-outline-success");
      btn.classList.add("btn-success");

      const filter = btn.getAttribute("data-filter");
      foodCards.forEach((card) => {
        const itemCat = card.getAttribute("data-category");
        if (filter === "all" || itemCat === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // 2. Add To Cart Handlers
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price") || "0");
      const img = btn.getAttribute("data-img");

      addToCart({ id, name, price, img });

      // Temporary button state
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Added!';
      btn.classList.add("btn-success");
      btn.classList.remove("btn-warning");
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.add("btn-warning");
        btn.classList.remove("btn-success");
      }, 1200);
    });
  });

  function addToCart(item) {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
  }

  function updateCartUI() {
    const badge = document.getElementById("cartCountBadge");
    const itemsList = document.getElementById("cartItemsList");
    const subtotalEl = document.getElementById("cartSubtotal");
    const feeEl = document.getElementById("cartDeliveryFee");
    const totalEl = document.getElementById("cartTotal");

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalCount;

    if (cart.length === 0) {
      itemsList.innerHTML = `
        <div class="text-center py-5 text-muted">
          <i class="bi bi-bag-x fs-1 d-block mb-3 text-secondary"></i>
          <h6>Your cart is empty</h6>
          <p class="small">Add some appetizing dishes from our menu!</p>
        </div>`;
      subtotalEl.textContent = currency + "0.00";
      feeEl.textContent = "FREE";
      totalEl.textContent = currency + "0.00";
      return;
    }

    let subtotal = 0;
    itemsList.innerHTML = cart
      .map((item, idx) => {
        subtotal += item.price * item.quantity;
        return `
        <div class="d-flex align-items-center gap-3 py-3 border-bottom">
          <img src="${item.img}" class="rounded-3" width="55" height="55" style="object-fit:cover;" onerror="this.src='images/hero-food.jpg'">
          <div class="flex-grow-1">
            <h6 class="mb-1 text-dark small fw-bold">${item.name}</h6>
            <div class="text-success small fw-semibold">${currency}${item.price.toFixed(2)}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary rounded-circle px-2 py-0 decrease-btn" data-idx="${idx}">-</button>
            <span class="fw-bold small">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary rounded-circle px-2 py-0 increase-btn" data-idx="${idx}">+</button>
          </div>
        </div>`;
      })
      .join("");

    const fee = subtotal >= freeThreshold ? 0 : deliveryFee;
    const grandTotal = subtotal + fee;

    subtotalEl.textContent = currency + subtotal.toFixed(2);
    feeEl.textContent = fee === 0 ? "FREE" : currency + fee.toFixed(2);
    totalEl.textContent = currency + grandTotal.toFixed(2);

    // Bind quantity stepper buttons
    itemsList.querySelectorAll(".decrease-btn").forEach((b) => {
      b.addEventListener("click", () => {
        const idx = parseInt(b.getAttribute("data-idx"));
        if (cart[idx].quantity > 1) {
          cart[idx].quantity -= 1;
        } else {
          cart.splice(idx, 1);
        }
        updateCartUI();
      });
    });

    itemsList.querySelectorAll(".increase-btn").forEach((b) => {
      b.addEventListener("click", () => {
        const idx = parseInt(b.getAttribute("data-idx"));
        cart[idx].quantity += 1;
        updateCartUI();
      });
    });
  }

  // 3. Checkout Button
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Please add some items to your cart first!");
        return;
      }
      alert(
        "Order Confirmed! 🍲 Thank you for dining with " +
          "Verde & Saffron" +
          ". Your fresh meal is being prepared!",
      );
      cart = [];
      updateCartUI();
    });
  }

  // 4. Reservation Form Submission
  const resForm = document.getElementById("reservationForm");
  if (resForm) {
    resForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "Reservation Successful! 🌿 We have reserved your table. A confirmation SMS will be sent to your phone number shortly.",
      );
      resForm.reset();
    });
  }

  // Initialize empty cart state
  updateCartUI();
});


