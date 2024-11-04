// Variables globales iniciales
let currentUser = null;
let products = [];
let cart = [];
let chatMessages = {};
let activeChat = null;
// Funciones para el Chat

particlesJS.load('particles-js', 'particles-config.json', function () {
    console.log('Particles.js loaded - callback');
});


window.startChat = function (producerName, productId) {
    const chatId = `${currentUser.name}_${producerName}_${productId}`;
    if (!chatMessages[chatId]) {
        chatMessages[chatId] = [];
    }
    activeChat = chatId;
    renderChat();
    showElement('chatInterface'); // Mostrar la interfaz del chat
}
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (message && activeChat) {
        chatMessages[activeChat].push({ text: message, sender: currentUser.name, timestamp: new Date() });
        renderChat();
        chatInput.value = ''; // Limpiar el campo de entrada

        // Simular respuesta del productor
        setTimeout(() => {
            const [consumer, producer] = activeChat.split('_');
            const response = currentUser.type === 'consumer'
                ? { text: "Gracias por tu interés. ¿En qué puedo ayudarte?", sender: producer, timestamp: new Date() }
                : { text: "Gracias por responder. Estoy interesado en tu producto.", sender: consumer, timestamp: new Date() };
            chatMessages[activeChat].push(response);
            renderChat();
        }, 1000);
    }
}
function renderChat() {
    const chatMessagesElement = document.getElementById('chatMessages');
    if (activeChat && chatMessages[activeChat]) {
        chatMessagesElement.innerHTML = chatMessages[activeChat].map(msg => `
            <div class="chat-message ${msg.sender === currentUser.name ? 'user' : 'other'}">
                <strong>${msg.sender}:</strong> ${msg.text}
                <span class="timestamp">${msg.timestamp.toLocaleTimeString()}</span>
            </div>
        `).join('');
        chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight; // Desplazar hacia abajo
    } else {
        chatMessagesElement.innerHTML = '<p>Selecciona un chat para comenzar</p>';
    }
}
// Event listeners para el chat
document.getElementById('sendMessage').addEventListener('click', sendMessage);
document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
// Función para renderizar chats para productores
function renderProducerChats() {
    const chatList = document.getElementById('producerChatList');
    const producerChats = Object.keys(chatMessages).filter(chatId => chatId.includes(currentUser.name));
    chatList.innerHTML = producerChats.map(chatId => {
        const [consumer, , productId] = chatId.split('_');
        const product = products.find(p => p.id === parseInt(productId));
        return `
            <div class="chat-item" onclick="openChat('${chatId}')">
                <strong>${consumer}</strong>
                <p>Producto: ${product ? product.name : 'Desconocido'}</p>
            </div>
        `;
    }).join('') || '<p>No hay chats activos</p>';
}
// Función para abrir un chat
function openChat(chatId) {
    activeChat = chatId;
    renderChat();
    showElement('chatInterface'); // Mostrar la interfaz de chat
}
// Mock API functions
const api = {
    login: async (credentials) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { id: 1, name: credentials.name, type: credentials.type, plan: credentials.plan };
    },
    getProducts: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            { id: 1, name: "Tomates Orgánicos", price: 2.50, imageUrl: "/assets/placeholder.svg", description: "Tomates frescos cultivados sin pesticidas.", producer: "Finca El Sol" },
            { id: 2, name: "Lechugas Hidropónicas", price: 1.75, imageUrl: "/assets/placeholder.svg", description: "Lechugas crujientes cultivadas en sistema hidropónico.", producer: "Huerta Verde" },
            { id: 3, name: "Fresas Premium", price: 3.50, imageUrl: "/assets/placeholder.svg", description: "Fresas dulces y jugosas de variedad premium.", producer: "Frutales del Valle" },
            { id: 4, name: "Zanahorias Orgánicas", price: 1.80, imageUrl: "/assets/placeholder.svg", description: "Zanahorias orgánicas ricas en betacaroteno.", producer: "EcoVerde" },
            { id: 5, name: "Espinacas Baby", price: 2.20, imageUrl: "/assets/placeholder.svg", description: "Espinacas tiernas ideales para ensaladas.", producer: "Hortalizas Frescas" },
        ];
    },
    addProduct: async (product) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { id: Date.now(), ...product };
    },
    getWeather: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            temperature: 25,
            condition: "Soleado",
            forecast: "Se esperan lluvias para mañana",
            alerts: ["Ola de calor prevista para la próxima semana"]
        };
    },
    getOrders: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            { id: 1, product: "Tomates Orgánicos", quantity: 5, status: "En camino", consumer: "María López" },
            { id: 2, product: "Lechugas Hidropónicas", quantity: 3, status: "Entregado", consumer: "Juan Pérez" },
        ];
    },
    getEvents: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            { id: 1, name: "Feria Agrícola Sostenible", date: "2024-06-15", description: "Exhibición de las últimas tecnologías en agricultura sostenible." },
            { id: 2, name: "Taller de Agricultura Regenerativa", date: "2024-07-01", description: "Aprende técnicas avanzadas de agricultura regenerativa." },
            { id: 3, name: "evento para productores lideres", date: "2024-10-01", description: "conoce a otros productores y asociate." },
        ];

    },
    getJobs: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            { id: 1, title: "Ingeniero Agrónomo", company: "AgroTech Solutions", description: "Buscamos ingeniero agrónomo con experiencia en sistemas de riego inteligente." },
            { id: 2, title: "Técnico en Hidroponía", company: "Hidro Cultivos", description: "Se requiere técnico especializado en sistemas hidropónicos a gran escala." },
        ];
    },
};
// Utility functions
function showElement(id) {
    document.getElementById(id).style.display = 'block';
}

function hideElement(id) {
    document.getElementById(id).style.display = 'none';
}
function setActiveTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}
// Login and Registration
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nextStep1').addEventListener('click', () => {
        hideElement('step1');
        showElement('step2');
    });

    document.getElementById('nextStep2').addEventListener('click', () => {
        hideElement('step2');
        showElement('step3');
    });

    document.getElementById('userType').addEventListener('change', (e) => {
        if (e.target.value === 'producer') {
            showElement('producerFields');
        } else {
            hideElement('producerFields');
        }
    });

    document.getElementById('plan').addEventListener('change', (e) => {
        const planDetails = document.getElementById('planDetails');
        let details = '';
        switch (e.target.value) {
            case 'basic':
                details = `
                    <h4>Características del Plan Básico:</h4>
                    <ul>
                        <li>Registro de Usuarios</li>
                        <li>Acceso al Marketplace</li>
                        <li>Soporte Básico</li>
                        <li>Alertas Climáticas</li>
                        <li>Escaneo de Terreno Básico</li>
                        <li>Sección de Empleos y Eventos</li>
                        <li>Servicios Logísticos Básicos</li>
                    </ul>
                `;
                break;
            case 'standard':
                details = `
                    <h4>Características del Plan Estándar:</h4>
                    <ul>
                        <li>Todo lo incluido en el Plan Básico</li>
                        <li>Predicción Climática Avanzada con IA</li>
                        <li>Análisis de Cultivos</li>
                        <li>Soporte 24/7</li>
                        <li>Sistema de Mapeo en Vivo</li>
                    </ul>
                `;
                break;
            case 'premium':
                details = `
                    <h4>Características del Plan Premium:</h4>
                    <ul>
                        <li>Todo lo incluido en el Plan Estándar</li>
                        <li>Integración con Drones</li>
                        <li>Catálogo de Químicos Agropecuarios</li>
                        <li>Acceso Anticipado a Programas M.I.P.E.</li>
                        <li>Espacio para Anuncios de Empresas Locales</li>
                        <li>Datos Curiosos y Flash Cards Educativas</li>
                    </ul>
                `;
                break;
        }
        planDetails.innerHTML = details;
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const credentials = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            type: document.getElementById('userType').value,
            plan: document.getElementById('plan').value
        };
        try {
            currentUser = await api.login(credentials);
            hideElement('loginView');
            showElement('logoutBtn');
            if (currentUser.type === 'producer') {
                showElement('producerDashboard');
                loadProducerDashboard();
            } else {
                showElement('consumerDashboard');
                loadConsumerDashboard();
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        currentUser = null;
        hideElement('logoutBtn');
        hideElement('producerDashboard');
        hideElement('consumerDashboard');
        showElement('loginView');
    });

    // Producer Dashboard
    async function loadProducerDashboard() {
        products = await api.getProducts();
        renderProducts();
        renderWeather();
        renderOrders();
        renderEvents();
        renderJobs();
        renderProducerChats();
    }

    function renderProducts() {
        const productList = document.getElementById('productList');
        productList.innerHTML = products.filter(p => p.producer === currentUser.name).map(product => `
            <div class="card product-card">
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>$${product.price.toFixed(2)}</strong></p>
                <button onclick="editProduct(${product.id})">Editar</button>
            </div>
        `).join('');
    }

    document.getElementById('addProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newProduct = {
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            description: document.getElementById('productDescription').value,
            imageUrl: "/assets/placeholder.svg",
            producer: currentUser.name
        };
        const addedProduct = await api.addProduct(newProduct);
        products.push(addedProduct);
        renderProducts();
        e.target.reset();
    });

    async function renderWeather() {
        const weather = await api.getWeather();
        const weatherCard = document.getElementById('weatherCard');
        weatherCard.innerHTML = `
            <h3>Clima</h3>
            <p>${weather.temperature}°C - ${weather.condition}</p>
            <p>${weather.forecast}</p>
            <p>${weather.alerts[0]}</p>
            <button onclick="requestAIAdvice()">Solicitar Consejo IA</button>
        `;
    }

    window.requestAIAdvice = function () {
        const advices = [
            "Basado en las condiciones actuales, se recomienda aumentar el riego en un 15%.",
            "Los niveles de nitrógeno en el suelo son bajos. Considere aplicar fertilizante orgánico.",
            "Las condiciones son ideales para la siembra de maíz en los próximos 5 días."
        ];
        const advice = advices[Math.floor(Math.random() * advices.length)];
        const aiAdviceCard = document.getElementById('aiAdviceCard');
        aiAdviceCard.innerHTML = `
            <h3>Consejo IA</h3>
            <p>${advice}</p>
        `;
        showElement('aiAdviceCard');
    }

    async function renderOrders() {
        const orders = await api.getOrders();
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = orders.map(order => `
            <div class="card">
                <h3>${order.product}</h3>
                <p>Pedido #${order.id}</p>
                <p>Cantidad: ${order.quantity}</p>
                <p>Cliente: ${order.consumer}</p>
                <p>Estado: ${order.status}</p>
            </div>
        `).join('');
    }

    async function renderEvents() {
        const events = await api.getEvents();
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = events.map(event => `
            <div class="card">
                <h3>${event.name}</h3>
                <p>${event.date}</p>
                <p>${event.description}</p>
            </div>
        `).join('');
    }

    async function renderJobs() {
        const jobs = await api.getJobs();
        const jobList = document.getElementById('jobList');
        jobList.innerHTML = jobs.map(job => `
            <div class="card">
                <h3>${job.title}</h3>
                <p>${job.company}</p>
                <p>${job.description}</p>
                <button>Aplicar</button>
            </div>
        `).join('');
    }

    // Consumer Dashboard
    async function loadConsumerDashboard() {
        products = await api.getProducts();
        renderMarketplace();
        renderConsumerChats();
    }

    function renderMarketplace() {
        const marketplaceList = document.getElementById('marketplaceList');
        marketplaceList.innerHTML = products.map(product => `
            <div class="card product-card">
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>$${product.price.toFixed(2)}</strong></p>
                <button onclick="addToCart(${product.id})">Agregar al Carrito</button>
                <button onclick="startChat('${product.producer}', ${product.id})">Chat con Productor</button>
            </div>
        `).join('');
    }

    window.addToCart = function (productId) {
        const product = products.find(p => p.id === productId);
        cart.push(product);
        renderCart();
    }

    function renderCart() {
        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = cart.map(item => `
            <div>
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `).join('');
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('cartTotal').textContent = `Total: $${total.toFixed(2)}`;
    }

    // Chat functionality
    window.startChat = function (producerName, productId) {
        const chatId = `${currentUser.name}_${producerName}_${productId}`;
        if (!chatMessages[chatId]) {
            chatMessages[chatId] = [];
        }
        activeChat = chatId;
        renderChat();
        showElement('chatInterface');
    }

    function sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        if (message && activeChat) {
            chatMessages[activeChat].push({ text: message, sender: currentUser.name, timestamp: new Date() });
            renderChat();
            chatInput.value = '';
            // Simulated response (in a real app, this would be handled by the server)
            setTimeout(() => {
                const [consumer, producer] = activeChat.split('_');
                const response = currentUser.type === 'consumer'
                    ? { text: "Gracias por tu interés ¿En qué puedo ayudarte?", sender: producer, timestamp: new Date() }
                    : { text: "Gracias por responder. Estoy interesado en tu producto.", sender: consumer, timestamp: new Date() };
                chatMessages[activeChat].push(response);
                renderChat();
            }, 1000);
        }
    }
    function renderChat() {
        const chatMessagesElement = document.getElementById('chatMessages');
        if (activeChat && chatMessages[activeChat]) {
            chatMessagesElement.innerHTML = chatMessages[activeChat].map(msg => `
                <div class="chat-message ${msg.sender === currentUser.name ? 'user' : 'other'}">
                    <strong>${msg.sender}:</strong> ${msg.text}
                    <span class="timestamp">${msg.timestamp.toLocaleTimeString()}</span>
                </div>
            `).join('');
            chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
        } else {
            chatMessagesElement.innerHTML = '<p>Selecciona un chat para comenzar</p>';
        }
    }
    function renderProducerChats() {
        const chatList = document.getElementById('producerChatList');
        const producerChats = Object.keys(chatMessages).filter(chatId => chatId.includes(currentUser.name));
        chatList.innerHTML = producerChats.map(chatId => {
            const [consumer, , productId] = chatId.split('_');
            const product = products.find(p => p.id === parseInt(productId));
            return `
                <div class="chat-item" onclick="openChat('${chatId}')">
                    <strong>${consumer}</strong>
                    <p>Producto: ${product ? product.name : 'Desconocido'}</p>
                </div>
            `;
        }).join('') || '<p>No hay chats activos</p>';
    }
    function renderConsumerChats() {
        const chatList = document.getElementById('consumerChatList');
        const consumerChats = Object.keys(chatMessages).filter(chatId => chatId.includes(currentUser.name));
        chatList.innerHTML = consumerChats.map(chatId => {
            const [, producer, productId] = chatId.split('_');
            const product = products.find(p => p.id === parseInt(productId));
            return `
                <div class="chat-item" onclick="openChat('${chatId}')">
                    <strong>${producer}</strong>
                    <p>Producto: ${product ? product.name : 'Desconocido'}</p>
                </div>
            `;
        }).join('') || '<p>No hay chats activos</p>';
    }
    window.openChat = function (chatId) {
        activeChat = chatId;
        renderChat();
        showElement('chatInterface');
    }
    // Event listeners
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            setActiveTab(e.target.dataset.tab);
        });
    });

    document.getElementById('sendMessage').addEventListener('click', sendMessage);

    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    const socket = io();

// Escuchar por nuevos productos
socket.on('productoAgregado', (producto) => {
    const productosDiv = document.getElementById('productos');
    const nuevoProducto = document.createElement('div');
    nuevoProducto.innerText = `Nuevo producto: ${producto.nombre}`;
    productosDiv.appendChild(nuevoProducto);
});

// Escuchar por mensajes de consumidores
socket.on('mensajeRecibido', (mensaje) => {
    const mensajesDiv = document.getElementById('mensajes');
    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.innerText = `Mensaje: ${mensaje.texto}`;
    mensajesDiv.appendChild(nuevoMensaje);
});

// Enviar mensaje de consumidor
document.getElementById('enviarMensaje').onclick = () => {
    const mensajeInput = document.getElementById('mensajeInput');
    const mensaje = { texto: mensajeInput.value };
    socket.emit('mensajeConsumidor', mensaje);
    mensajeInput.value = ''; // Limpiar el input
};

    // Initialize particles.js
      particlesJS('particles-js', {
          particles: {
              number: { value: 80, density: { enable: true, value_area: 800 } },
              color: { value: "#10b981" },
              shape: { type: "circle" },
              opacity: { value: 0.5, random: true },
              size: { value: 3, random: true },
              line_linked: { enable: true, distance: 150, color: "#10b981", opacity: 0.4, width: 1 },
              move: { enable: true, speed: 6, direction: "none", random: true, straight: true, out_mode: "out", bounce: true }
          },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
        },
        retina_detect: true
    });
});