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
          <div class="product-image">
            <span>No Image</span>
          </div>
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-details">
              <div class="product-price">ราคา: ฿${product.price}</div>
              <div class="product-stock">
                ในคลัง: <span class="stock-count">${product.stock || 0} ชิ้น</span>
              </div>
            </div>
            <div class="product-actions">
              <button class="btn-edit" onclick="editProduct(${product.id})">แก้ไข</button>
              <button class="btn-delete" onclick="deleteProduct(${product.id})">ลบ</button>
            </div>
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