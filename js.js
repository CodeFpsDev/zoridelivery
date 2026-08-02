// js.js - Proyecto Zory App (Versión Universal y Segura)

const database = {
    "burgerland": {
        nombre: "Burgerland",
        banner: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "b1", nombre: "Cheddar Burger", descripcion: "Doble carne, cheddar y aderezo especial.", precio: 5500, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
            { id: "b2", nombre: "Bacon Monster", descripcion: "Triple carne, triple cheddar y mucha panceta.", precio: 6800, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200" }
        ]
    },
    "açaí berry": {
        nombre: "Açaí Berry",
        banner: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "ac1", nombre: "Bowl Tradicional", descripcion: "Açaí puro, banana, granolas y miel.", precio: 25000, img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200" },
            { id: "ac2", nombre: "Berry Explosion", descripcion: "Açaí, frutillas, arándanos y leche condensada.", precio: 30000, img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200" }
        ]
    },
    "absoluto": {
        nombre: "Absoluto",
        banner: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "abs1", nombre: "Pizza Mozzarella", descripcion: "Salsa casera, abundante mozzarella y orégano.", precio: 40000, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200" }
        ]
    },
    "home burger": {
        nombre: "Home Burger",
        banner: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "hb1", nombre: "Home Classic", descripcion: "Carne casera, queso mozzarella, lechuga y tomate.", precio: 26000, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" }
        ]
    },
    "valhalla": {
        nombre: "Valhalla",
        banner: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "v1", nombre: "Valquiria Burger", descripcion: "Medallón de vacío, provoleta y cebolla caramelizada.", precio: 36000, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200" }
        ]
    },
    "rolling cook": {
        nombre: "Rolling Cook",
        banner: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "rc1", nombre: "Rolling Burger", descripcion: "Medallón smash, cheddar, pepinillos y aderezo especial.", precio: 28000, img: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=200" }
        ]
    }
};

let cart = {};

function obtenerStoreActual() {
    let tituloPage = document.title.toLowerCase().trim();
    for (let key in database) {
        if (tituloPage.includes(key)) {
            return database[key];
        }
    }

    let rawPath = window.location.pathname.split("/").pop().toLowerCase().replace(".html", "").replace(/[-_]/g, " ");
    for (let key in database) {
        if (rawPath.includes(key)) {
            return database[key];
        }
    }

    if (document.body.innerHTML.toLowerCase().includes("burgerland")) {
        return database["burgerland"];
    }

    return database["burgerland"];
}

function initStore() {
    crearEstructuraCarritoUI();

    const store = obtenerStoreActual();

    if (store) {
        const titleElem = document.getElementById('storeTitle');
        if (titleElem) titleElem.innerText = store.nombre;

        const bannerElem = document.getElementById('storeBanner');
        if (bannerElem && store.banner) bannerElem.src = store.banner;

        const menuContainer = document.getElementById('menuContainer');
        if (menuContainer && store.productos) {
            let html = '';
            store.productos.forEach(prod => {
                const qty = cart[prod.nombre] ? cart[prod.nombre].qty : 0;
                html += `
                    <div class="item">
                        <img src="${prod.img}" alt="${prod.nombre}" class="item-img" />
                        <div class="item-info">
                            <div class="item-title">${prod.nombre}</div>
                            <div class="item-desc">${prod.descripcion}</div>
                            <div class="item-price">Gs. ${prod.precio.toLocaleString('es-PY')}</div>
                        </div>
                        <div class="controls">
                            <button class="btn-qty" onclick="updateQty('${prod.nombre}', ${prod.precio}, -1)">-</button>
                            <span class="qty-count" id="qty-${prod.nombre}">${qty}</span>
                            <button class="btn-qty" onclick="updateQty('${prod.nombre}', ${prod.precio}, 1)">+</button>
                            <button class="btn-pedir" onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio})" style="margin-left: 8px; background: #ff7300; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">PEDIR</button>
                        </div>
                    </div>
                `;
            });
            menuContainer.innerHTML = html;
        }
    }

    renderCart();
}

function crearEstructuraCarritoUI() {
    if (!document.getElementById('cartBar')) {
        const cartBarHTML = `
            <div id="cartBar" onclick="abrirModalCarrito()" style="position: fixed; bottom: 20px; right: 20px; background: rgba(16, 124, 65, 0.90); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); color: #ffffff; padding: 14px 22px; border-radius: 50px; font-weight: bold; cursor: pointer; display: none; box-shadow: 0 10px 30px rgba(0,0,0,0.35); z-index: 1000; align-items: center; gap: 10px; font-family: 'Poppins', sans-serif; border: 1px solid rgba(255, 255, 255, 0.35);">
                🛒 <span id="cartCount">0</span> • <span id="cartTotal">Gs. 0</span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartBarHTML);
    }

    if (!document.getElementById('modalCarritoZori')) {
        const modalHTML = `
            <div id="modalCarritoZori" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: none; justify-content: center; align-items: center; z-index: 2000; font-family: 'Poppins', sans-serif; padding: 16px; box-sizing: border-box;">
                <div style="background: #ffffff; width: 100%; max-width: 500px; max-height: 90vh; border-radius: 20px; padding: 24px; box-sizing: border-box; color: #1e293b; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.3); position: relative;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h3 id="modalStoreTitle" style="margin:0; font-size: 20px; font-weight: 700; color: #0f172a;">Tu Pedido</h3>
                        <button onclick="cerrarModalCarrito()" style="background: transparent; border: none; color: #64748b; width: 32px; height: 32px; border-radius: 50%; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold;">&times;</button>
                    </div>

                    <div style="border-bottom: 1px solid #e2e8f0; margin-bottom: 16px;"></div>
                    
                    <div id="listaModalCarrito"></div>

                    <div style="border-bottom: 1px solid #e2e8f0; margin: 16px 0;"></div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 6px;">Tu Nombre:</label>
                        <input type="text" id="inputNombreCliente" placeholder="Nombre" style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; box-sizing: border-box; font-family: 'Poppins', sans-serif; outline: none; font-size: 15px;">
                    </div>
                    
                    <!-- Recordatorio de ubicación -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 10px; font-size: 13px; color: #475569; text-align: center; margin-bottom: 20px; font-family: 'Poppins', sans-serif;">
                        📍 <strong>Recordatorio:</strong> Envía tu ubicación actual desde el chat
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <span style="font-weight:700; font-size: 18px; color: #0f172a;">Total:</span>
                        <span id="totalModalCarrito" style="font-weight:700; font-size: 20px; color: #0f172a;">Gs. 0</span>
                    </div>

                    <button onclick="sendWhatsApp()" style="background: #22c55e; color: white; border: none; padding: 14px; width: 100%; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px;">
                        💬 Pedir Ahora
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

function updateQty(name, price, change) {
    if (!cart[name]) {
        cart[name] = { price: price, qty: 0 };
    }

    cart[name].qty += change;

    if (cart[name].qty <= 0) {
        delete cart[name];
    }

    const qtyElement = document.getElementById(`qty-${name}`);
    if (qtyElement) {
        qtyElement.innerText = cart[name] ? cart[name].qty : 0;
    }

    renderCart();
}

function agregarAlCarrito(nombre, precio) {
    updateQty(nombre, precio, 1);
}

function renderCart() {
    let totalItems = 0;
    let totalPrice = 0;

    for (let item in cart) {
        totalItems += cart[item].qty;
        totalPrice += cart[item].qty * cart[item].price;
    }

    const cartBar = document.getElementById('cartBar');
    if (!cartBar) return;

    if (totalItems > 0) {
        cartBar.style.display = 'flex';
        const countElem = document.getElementById('cartCount');
        const totalElem = document.getElementById('cartTotal');
        
        const textoPedido = totalItems === 1 ? 'pedido' : 'pedidos';
        if (countElem) countElem.innerText = `${totalItems} ${textoPedido}`;
        if (totalElem) totalElem.innerText = `Gs. ${totalPrice.toLocaleString('es-PY')}`;
    } else {
        cartBar.style.display = 'none';
        cerrarModalCarrito();
    }
}

function abrirModalCarrito() {
    const modal = document.getElementById('modalCarritoZori');
    const listaDiv = document.getElementById('listaModalCarrito');
    const totalP = document.getElementById('totalModalCarrito');
    const titleModal = document.getElementById('modalStoreTitle');

    if (!modal || !listaDiv) return;

    const store = obtenerStoreActual();
    if (titleModal) titleModal.innerText = `Tu Pedido`;

    listaDiv.innerHTML = '';
    let totalPrecio = 0;

    for (let nombre in cart) {
        let item = cart[nombre];
        let subtotal = item.price * item.qty;
        totalPrecio += subtotal;

        listaDiv.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
                <div>
                    <span style="font-weight: 600; font-size: 14px; color: #0f172a;">${nombre}</span><br>
                    <small style="color: #64748b;">${item.qty} x Gs. ${item.price.toLocaleString('es-PY')} = <strong style="color: #0f172a;">Gs. ${subtotal.toLocaleString('es-PY')}</strong></small>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button onclick="updateQty('${nombre}', ${item.price}, -1); abrirModalCarrito();" style="background:#f1f5f9; color:#0f172a; border:1px solid #cbd5e1; border-radius:6px; width:28px; height:28px; cursor:pointer; font-weight:bold;">-</button>
                    <span style="font-weight: 600; font-size: 14px;">${item.qty}</span>
                    <button onclick="updateQty('${nombre}', ${item.price}, 1); abrirModalCarrito();" style="background:#ff7300; color:white; border:none; border-radius:6px; width:28px; height:28px; cursor:pointer; font-weight:bold;">+</button>
                </div>
            </div>
        `;
    }

    if (totalP) {
        totalP.innerText = `Gs. ${totalPrecio.toLocaleString('es-PY')}`;
    }

    modal.style.display = 'flex';
}

function cerrarModalCarrito() {
    const modal = document.getElementById('modalCarritoZori');
    if (modal) modal.style.display = 'none';
}

function sendWhatsApp() {
    const nombreCliente = document.getElementById('inputNombreCliente').value.trim();

    if (!nombreCliente) {
        alert("Por favor, ingresá tu nombre y apellido para continuar.");
        document.getElementById('inputNombreCliente').focus();
        return;
    }

    const store = obtenerStoreActual();

    let message = `Nuevo Pedido\n\n`;
    message += `Hola Zory, quiero hacer un pedido de ${store.nombre}:\n\n`;
    let totalPrice = 0;

    for (let item in cart) {
        let itemTotal = cart[item].qty * cart[item].price;
        totalPrice += itemTotal;
        message += `- ${cart[item].qty}x ${item} (Gs. ${itemTotal.toLocaleString('es-PY')})\n`;
    }

    message += `\nTotal: Gs. ${totalPrice.toLocaleString('es-PY')}\n\n`;
    message += `A nombre de: ${nombreCliente}\n`;
    message += `(Envío mi ubicación actual desde aquí)`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${store.whatsapp}?text=${encodedMessage}`, '_blank');
}
// 1. Inyectar automáticamente la pantalla de carga con tu logo
// Reemplazá desde aquí hasta el final de tu archivo js.js:

// 1. Inyectar automáticamente la pantalla de carga con tu logo
function crearPantallaCarga() {
    if (!document.getElementById('zory-loader')) {
        const loaderHTML = `
            <div id="zory-loader" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 99999; transition: opacity 0.5s ease; font-family: 'Poppins', sans-serif;">
                <img src="logo png.png" alt="Zory Logo" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 20px; animation: pulse 1.5s infinite;">
                <h2 id="loader-text" style="font-size: 18px; color: #0f172a; font-weight: 600; margin-bottom: 8px;">Cargando Zory...</h2>
                <p id="loader-sub" style="font-size: 13px; color: #64748b;">Preparando tu experiencia</p>
            </div>
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.08); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
            </style>
        `;
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    }
}

// 3. Controladores de carga y conexión (al final del archivo)
window.addEventListener('load', () => {
    const loader = document.getElementById('zory-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 600);
    }
});

window.addEventListener('offline', () => {
    const loader = document.getElementById('zory-loader');
    const titleText = document.getElementById('loader-text');
    const subText = document.getElementById('loader-sub');
    
    if (loader && titleText && subText) {
        titleText.innerText = "¡Sin conexión a internet!";
        subText.innerText = "Por favor, verifica tu red para continuar.";
        loader.style.display = 'flex';
        loader.style.opacity = '1';
    }
});

window.addEventListener('online', () => {
    const loader = document.getElementById('zory-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    crearPantallaCarga(); // <-- Acá ya lo activamos por defecto al iniciar
    initStore();
});

document.addEventListener('DOMContentLoaded', initStore);