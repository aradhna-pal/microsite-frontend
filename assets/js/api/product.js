
const domain = "http://microsite_backend.workarya.com";
const api = `${domain}/api/product/getproduct`;

fetch(api)
  .then(res => res.json())
  .then(products => {
    const row = document.getElementById("productRow");
    row.innerHTML = "";

    products.forEach(p => {
      const slug = p.slug;

      row.innerHTML += `
        <div class="col-6 col-md-4 col-lg-4 col-xl-3">
          <div class="product product-7 text-center">
            <figure class="product-media">
              <a href="product.php?slug=${slug}">
                <img src="${domain}${p.image}" alt="${p.productName}" class="product-image">
              </a>

              <div class="product-action-vertical">
                <a href="#" class="btn-product-icon btn-wishlist btn-expandable">
                  <span>add to wishlist</span>
                </a>

                <a href="popup/quickView.html?slug=${slug}" 
                   class="btn-product-icon btn-quickview" 
                   title="Quick view">
                  <span>Quick view</span>
                </a>
              </div>

              <div class="product-action">
                <a href="#" class="btn-product btn-cart">
                  <span>add to cart</span>
                </a>
              </div>
            </figure>

            <div class="product-body">
              <div class="product-cat">
                <a href="#">${p.categoryName ?? 'Category'}</a>
              </div>

              <h3 class="product-title">
                <a href="product.php?slug=${slug}">
                  ${p.productName}
                </a>
              </h3>

              <div class="product-price">
                ₹${p.price}
              </div>
            </div>
          </div>
        </div>
      `;
    });
  })
  .catch(err => console.error(err));


