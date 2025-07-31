// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const message = document.getElementById('message');
const dashboard = document.getElementById('dashboard');
const userInfo = document.getElementById('userInfo');
const userData = document.getElementById('userData');
const logoutBtn = document.getElementById('logoutBtn');

// Funciones de utilidad
function showMessage(text, type = 'error') {
  message.textContent = text;
  message.className = `message ${type}`;
  message.style.display = 'block';
}

function hideMessage() {
  message.style.display = 'none';
}

function showDashboard() {
  dashboard.style.display = 'block';
  document.querySelector('.login-card').style.display = 'none';
}

function hideDashboard() {
  dashboard.style.display = 'none';
  document.querySelector('.login-card').style.display = 'block';
}

// Manejo del formulario de login
loginForm.addEventListener('submit', async e => {
  e.preventDefault();

  const cedula = document.getElementById('cedula').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!cedula || !password) {
    showMessage('Por favor complete todos los campos');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Iniciando sesión...';
  hideMessage();

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cedula, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Credenciales inválidas');
    }

    const result = await response.json();

    // La API devuelve { data: { access_token, user }, statusCode, message, timestamp }
    const { access_token, user } = result.data;

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    showMessage('Login exitoso', 'success');
    setTimeout(() => {
      showDashboard();
      displayUserInfo(user);
      loadUserData();
    }, 1000);
    console.log(result);
    console.log(access_token);
  } catch (error) {
    showMessage(error.message || 'Error al iniciar sesión');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
});

// Mostrar información del usuario
function displayUserInfo(user) {
  userInfo.innerHTML = `
    <h3>Bienvenido, ${user.fullname}</h3>
    <p><strong>Cédula:</strong> ${user.cedula}</p>
    <p><strong>Rol:</strong> ${user.role}</p>
    <p><strong>División:</strong> ${user.division || 'N/A'}</p>
    <p><strong>Cargo:</strong> ${user.cargo || 'N/A'}</p>
    <p><strong>Email:</strong> ${user.user_email || 'N/A'}</p>
  `;
}

// Cargar datos de usuarios
async function loadUserData() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch('http://localhost:3000/vappusuarios', {
      headers: { Authorization: 'Bearer ' + token },
    });

    if (!response.ok) {
      throw new Error('Error al cargar datos');
    }

    const result = await response.json();
    // La API devuelve { data: [...], statusCode, message, timestamp }
    const users = result.data || result;

    userData.innerHTML = `
      <h4>Usuarios del Sistema (${users.length})</h4>
      <div style="max-height: 300px; overflow-y: auto;">
        <pre style="font-size: 0.8rem;">${JSON.stringify(users.slice(0, 10), null, 2)}</pre>
      </div>
    `;
  } catch (error) {
    userData.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

// Manejo del logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  hideDashboard();
  document.getElementById('cedula').value = '';
  document.getElementById('password').value = '';
  hideMessage();
});

// Verificar sesión al cargar la página
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    try {
      const userData = JSON.parse(user);
      showDashboard();
      displayUserInfo(userData);
      loadUserData();
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});
