document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
});

async function loadProducts() {
  try {
    console.log('Loading products...'); // debug
    const response = await fetch('/api/products/list');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    console.log('Products loaded:', products); // debug
    
    const listContainer = document.querySelector('.list');
    if (!listContainer) {
      console.error('List container not found!');
      return;
    }
    
    listContainer.innerHTML = '';
    
    if (products.length === 0) {
      listContainer.innerHTML = '<p>No products found</p>';
      return;
    }
    
    products.forEach(product => {
      const productCard = `
        <div class="product-card">
          <h4>${product.name}</h4>
          <p>Price: ฿${product.price}</p>
          <p>Stock: ${product.stock || 0}</p>
          <p>${product.description || ''}</p>
          <div class="product-actions">
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
          </div>
        </div>
      `;
      listContainer.innerHTML += productCard;
    });
  } catch (err) {
    console.error('Error loading products:', err);
    const listContainer = document.querySelector('.list');
    if (listContainer) {
      listContainer.innerHTML = '<p>Error loading products</p>';
    }
  }
}

// ดึงข้อมูลสินค้าโดย ID
async function getProductById(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    const product = await response.json();
    console.log(product);
    return product;
  } catch (err) {
    console.error('Error:', err);
  }
}

// ฟังก์ชันสำหรับ edit และ delete (เพิ่มภายหลัง)
function editProduct(id) {
  console.log('Edit product:', id);
}

function deleteProduct(id) {
  console.log('Delete product:', id);
}