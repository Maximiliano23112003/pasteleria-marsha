const products = [
  { id: 'postres', name: 'Postres (50 unidades)', price: 25000, image: 'img-04.jpeg' },
  { id: 'pompadour', name: 'Torta Pompadour (50 personas)', price: 38000, image: 'imagen-16.jpg' },
  { id: 'bizcochuelo', name: 'Torta Bizcochuelo (50 personas)', price: 36000, image: 'imagen-15.jpg' },
  { id: 'dulces', name: 'Dulces surtidos (100 unidades)', price: 30000, image: 'img-07.jpeg' },
  { id: 'tabla', name: 'Tabla de picoteo', price: 30000, image: 'img-05.jpeg' },
  { id: 'gomitas', name: 'Gomitas (1 kilo)', price: 15000, image: 'img-12.jpg' },   
  { id: 'tapaditos', name: 'Tapaditos (50 unidades)', price: 30000, image: 'img-08.jpeg' },
  { id: 'canapes', name: 'Canapés (100 unidades)', price: 25000, image: 'img-08.jpeg' },
  { id: 'sopaipillas', name: 'Mini sopaipillas (100 unidades)', price: 15000, image: 'img-17.jpeg' },
  { id: 'empanadas', name: 'Mini empanadas (50 unidades)', price: 30000, image: 'img-03.jpeg' },
  { id: 'pizzas', name: 'Mini pizzas (50 unidades)', price: 30000, image: 'img-02.jpeg' },
    ];

const cart = {};
const productsContainer = document.getElementById('products');
const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');
const sendWhatsappButton = document.getElementById('send-whatsapp');
const whatsappFloat = document.getElementById('whatsapp-float');
const contactWhatsappLink = document.getElementById('contact-whatsapp');
const resetCartButton = document.getElementById('reset-cart');
const clientNameInput = document.getElementById('client-name');
const eventDateInput = document.getElementById('event-date');
const extraNotesInput = document.getElementById('extra-notes');

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
}

function renderProducts() {
  productsContainer.innerHTML = products
    .map(product => `
      <article class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-card-body">
          <h4>${product.name}</h4>
          <p>${product.price ? formatCurrency(product.price) : ''}</p>
          <div class="product-price">
            <span>Precio</span>
            <strong>${formatCurrency(product.price)}</strong>
          </div>
          <div class="quantity-selector" aria-label="Selector de cantidad">
            <button type="button" class="quantity-decrease" data-id="${product.id}">-</button>
            <span id="qty-${product.id}">1</span>
            <button type="button" class="quantity-increase" data-id="${product.id}">+</button>
          </div>
          <button class="button button-primary add-to-quote" data-id="${product.id}">Agregar a cotización</button>
        </div>
      </article>
    `)
    .join('');
}

function renderCart() {
  const entries = Object.entries(cart);
  if (!entries.length) {
    cartList.innerHTML = '<p class="empty-cart">Aún no agregas productos.</p>';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  const total = entries.reduce((sum, [id, qty]) => sum + qty * products.find(item => item.id === id).price, 0);
  cartList.innerHTML = entries
    .map(([id, qty]) => {
      const product = products.find(item => item.id === id);
      return `
        <div class="cart-item">
          <strong>${product.name}</strong>
          <span>${qty} x ${formatCurrency(product.price)}</span>
          <span>Total: ${formatCurrency(product.price * qty)}</span>
        </div>
      `;
    })
    .join('');
  cartTotal.textContent = formatCurrency(total);
}

function updateQuantity(id, delta) {
  const qtyDisplay = document.getElementById(`qty-${id}`);
  if (!qtyDisplay) return;
  const current = Number(qtyDisplay.textContent) || 1;
  const next = Math.max(1, current + delta);
  qtyDisplay.textContent = next;
}

function addToCart(id) {
  const qtyElement = document.getElementById(`qty-${id}`);
  const quantity = Number(qtyElement.textContent) || 1;
  cart[id] = (cart[id] || 0) + quantity;
  renderCart();
}

function buildWhatsAppMessage() {
  const clientName = clientNameInput.value.trim() || 'Sin nombre';
  const eventDate = eventDateInput.value ? new Date(eventDateInput.value).toLocaleDateString('es-CL') : 'Sin fecha definida';
  const notes = extraNotesInput.value.trim();
  const entries = Object.entries(cart);
  const lines = [];

  if (entries.length) {
    lines.push('Estimados, solicito una cotización para los siguientes productos:');
    lines.push('');
    entries.forEach(([id, qty]) => {
      const product = products.find(item => item.id === id);
      lines.push(`- ${product.name} x ${qty}`);
    });
    const total = entries.reduce((sum, [id, qty]) => sum + qty * products.find(item => item.id === id).price, 0);
    lines.push('');
    lines.push(`Total estimado: ${formatCurrency(total)}`);
    lines.push('');
    lines.push('Por favor confirme disponibilidad actual de estos productos.');
  } else {
    lines.push('¡Hola! 👋');
    lines.push('');
    lines.push('Me interesa saber qué productos tienen disponible para hoy. ¿Podrían indicarme los productos y precios disponibles en este momento para cotizar?');
    lines.push('');
    lines.push('Estoy organizando un evento y necesito opciones frescas y de calidad. ¡Gracias! 😊');
  }

  if (entries.length) {
    lines.push('');
    lines.push(`Nombre: ${clientName}`);
    lines.push(`Fecha del evento: ${eventDate}`);
    if (notes) {
      lines.push(`Observaciones: ${notes}`);
    }
  }
  lines.push('');
  lines.push('Quedo atento a la disponibilidad y costos actuales.');
  return encodeURIComponent(lines.join('\n'));
}

function openWhatsAppWithMessage(message) {
  window.open(`https://wa.me/56964044114?text=${message}`, '_blank');
}

function observeSections() {
  const sections = document.querySelectorAll('.section-animate');
  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observerInstance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));
}

function initialize() {
  renderProducts();
  renderCart();
  observeSections();

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });
  }

  document.body.addEventListener('click', event => {
    const increaseButton = event.target.closest('.quantity-increase');
    const decreaseButton = event.target.closest('.quantity-decrease');
    const addButton = event.target.closest('.add-to-quote');

    if (increaseButton) {
      updateQuantity(increaseButton.dataset.id, 1);
    }

    if (decreaseButton) {
      updateQuantity(decreaseButton.dataset.id, -1);
    }

    if (addButton) {
      addToCart(addButton.dataset.id);
      addButton.textContent = 'Agregado';
      setTimeout(() => { addButton.textContent = 'Agregar a cotización'; }, 1200);
    }
  });

  if (sendWhatsappButton) {
    sendWhatsappButton.addEventListener('click', event => {
      event.preventDefault();
      const message = buildWhatsAppMessage();
      openWhatsAppWithMessage(message);
    });
  }

  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', event => {
      event.preventDefault();
      const message = buildWhatsAppMessage();
      openWhatsAppWithMessage(message);
    });
  }

  if (contactWhatsappLink) {
    contactWhatsappLink.addEventListener('click', event => {
      event.preventDefault();
      const message = buildWhatsAppMessage();
      openWhatsAppWithMessage(message);
    });
  }

  resetCartButton.addEventListener('click', () => {
    Object.keys(cart).forEach(key => delete cart[key]);
    renderCart();
  });
}

initialize();
