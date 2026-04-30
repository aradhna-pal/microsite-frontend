
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
              <a href="product.php?slug=${slug} ">
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
                <a href="product.php?id=${p.id}">
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


  

  

// const domain = "http://microsite_backend.workarya.com";



// 1) id read
const id = new URLSearchParams(window.location.search).get("id");
if(!id) {
  console.error("Product id missing");
}

// 2) API call by id
fetch(`${domain}/api/product/getproductbyid/${id}`)
  .then(res => res.json())
  .then(res => {
    if(!res.status) return;
    loadProduct(res.data);
  })
  .catch(console.error);

// 3) Fill data
function loadProduct(p){

  const pName = document.getElementById("pName");
  if (pName) pName.innerText = p.productName || '';

  const pPrice = document.getElementById("pPrice");
  if (pPrice) pPrice.innerText = `₹${p.price || 0}`;

  const sdec = document.getElementById("sdec");
  if (sdec) sdec.innerText = p.shortDescription || '';


  const pDesc = document.getElementById("pDesc");
  if (pDesc) pDesc.innerText = p.description || '';

  const pCat = document.getElementById("pCat");
  if (pCat) {
    pCat.innerHTML = `
      <span><b>Category:</b></span>
      <a href="#">${p.categoryName ?? ''}</a>
    `;
  }

  const brand = document.getElementById("brand");
  if (brand) {
    brand.innerHTML = `

        <span><b>Brand:</b></span>
        <a href="#">${p.brandName ?? ''}</a>
    `;
  }

  // Main image
  const main = document.getElementById("product-zoom");
  if (main) {
    main.src = domain + p.image;
    main.setAttribute("data-zoom-image", domain + p.image);
  }

  // Gallery
  const gallery = document.getElementById("product-zoom-gallery");
  if (gallery) {
    gallery.innerHTML = "";
    const images = [p.image, ...(p.imageGallery || [])];

    images.forEach((img, i) => {
      gallery.innerHTML += `
        <a class="product-gallery-item ${i===0?'active':''}" href="#"
           data-image="${domain+img}"
           data-zoom-image="${domain+img}">
           <img src="${domain+img}" alt="">
        </a>
      `;
    });
  }

  // Sizes
  const size = document.getElementById("size");
  if (size) {
    size.innerHTML = `<option>Select size</option>`;
    (p.sizeNames || []).forEach(s => {
      size.innerHTML += `<option value="${s}">${s}</option>`;
    });
  }

  // Colors
  const colors = document.getElementById("colorThumbs");
  if (colors) {
    colors.innerHTML = "";
    (p.colorNames || []).forEach(c => {
      colors.innerHTML += `
        <a href="#" title="${c}">
          <span style="display:inline-block;width:25px;height:25px;border-radius:50%;background:${c};border:1px solid #ccc"></span>
        </a>
      `;
    });
  }
}
