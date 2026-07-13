const BASE_URL = 'https://dummyjson.com';


export const loginUser = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });

  if (!response.ok) {
    throw new Error('Usuario o contraseña incorrectos');
  }
  return await response.json();
};


export const fetchProducts = async ({ limit = 10, skip = 0, search = '', category = '' }) => {
  let url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  
  if (search) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  } else if (category && category !== 'all') {
    url = `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al cargar la lista de productos');
  return await response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${BASE_URL}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return await response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
};