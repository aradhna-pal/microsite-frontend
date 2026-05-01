var domain = "http://microsite_backend.workarya.com";
var api = `${domain}/api/product/getproduct`;

fetch(api)
  .then(res => res.json())
  .then(products => {
    const row = document.getElementById("productRow");
    row.innerHTML = "";

    products.forEach(p => {
      row.innerHTML += `
        <div class="col-6 col-md-4 col-lg-4 col-xl-3">
          <div class="product product-7 text-center">
            <figure class="product-media">
              
              <!-- ✅ Image click also sends id -->
              <a href="product.php?id=${p.id}">
                <img src="${p.image}" alt="${p.productName}" class="product-image">
              </a>

              <div class="product-action-vertical">
                <a href="#" class="btn-product-icon btn-wishlist btn-expandable">
                  <span>add to wishlist</span>
                </a>

                          <button 
              type="button"
              class="btn-product-icon btn-quickview"
              data-id="${p.id}"
              title="Quick view">
              <span>Quick view</span>
            </button>
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

  

  

// const 
//  = "http://microsite_backend.workarya.com";



// 1) id read
var currentProductId = new URLSearchParams(window.location.search).get("id");

if (currentProductId) {
  // 2) API call by id for standalone product page
  fetch(`${domain}/api/product/getproductbyid/${currentProductId}`)
    .then(res => res.json())
    .then(res => {
      if(!res.status) return;
      loadProduct(res.data);
    })
    .catch(console.error);
}

// --- QUICK VIEW INLINE POPUP LOGIC ---
document.addEventListener('click', function(e) {
  const qvBtn = e.target.closest('.btn-quickview');
  if (qvBtn) {
    e.preventDefault();
    const prodId = qvBtn.getAttribute('data-id');
    if (prodId) openQuickViewModal(prodId);
  }
});

function openQuickViewModal(prodId) {
  fetch(`${domain}/api/product/getproductbyid/${prodId}`)
    .then(res => res.json())
    .then(res => {
      if (!res.status) return;
      const p = res.data;
      
      let qvModal = document.getElementById('quickViewModal');
      if (!qvModal) {
         qvModal = document.createElement('div');
         qvModal.id = 'quickViewModal';
         qvModal.className = 'container quickView-container mfp-hide';
         document.body.appendChild(qvModal);
      }

      // Gallery Images
      const images = [p.image, ...(p.imageGallery || [])].filter(Boolean);
      let leftHtml = '';
      let rightHtml = '';
      images.forEach((img, i) => {
         let hash = `hash-${i}`;
         let active = i === 0 ? 'active' : '';
         leftHtml += `
            <a href="#${hash}" class="carousel-dot ${active}">
                <img src="${img}">
            </a>`;
         rightHtml += `
            <div class="intro-slide" data-hash="${hash}">
                <img src="${img}" alt="Image" style="max-width: 100%; height: auto; max-height: 500px; object-fit: contain; margin: 0 auto;">
            </div>`;
      });

      // Colors
      let colorHtml = '';
      (p.colorNames || []).forEach((c, i) => {
         colorHtml += `
         <a href="#" class="${i === 0 ? 'active' : ''}" title="${c}">
            <span style="display:inline-block;width:25px;height:25px;border-radius:50%;background:${c};border:1px solid #ccc;margin-right:5px;"></span>
         </a>`;
      });

      // Sizes
      let sizeHtml = '<option value="#" selected="selected">Select a size</option>';
      (p.sizeNames || []).forEach(s => {
         sizeHtml += `<option value="${s}">${s}</option>`;
      });

      // Build Modal HTML dynamically
      qvModal.innerHTML = `
        <div class="quickView-content">
            <div class="row">
                <div class="col-lg-7 col-md-6">
                    <div class="row">
                        <div class="product-left">
                            ${leftHtml}
                        </div>
                        <div class="product-right">
                            <div class="owl-carousel owl-theme owl-nav-inside owl-light mb-0 qv-carousel" data-toggle="owl">
                                ${rightHtml}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 col-md-6">
                    <h2 class="product-title">${p.productName || ''}</h2>
                    <h3 class="product-price">₹${p.price || 0}</h3>
                    <div class="ratings-container">
                        <div class="ratings">
                            <div class="ratings-val" style="width: 80%;"></div>
                        </div>
                        <span class="ratings-text">( 2 Reviews )</span>
                    </div>
                    <p class="product-txt">${p.shortDescription || p.description || ''}</p>

                    <div class="details-filter-row product-nav product-nav-thumbs">
                        <label for="size">color:</label>
                        ${colorHtml}
                    </div>

                    <div class="details-filter-row details-row-size">
                        <label for="size">Size:</label>
                        <div class="select-custom">
                            <select name="size" id="size" class="form-control">
                                ${sizeHtml}
                            </select>
                        </div>
                    </div>

                    <div class="details-filter-row details-row-size">
                        <label for="qty">Qty:</label>
                        <div class="product-details-quantity">
                            <input type="number" id="qty" class="form-control" value="1" min="1" max="10" step="1" data-decimals="0" required>
                        </div>
                    </div>

                    <div class="product-details-action">
                        <div class="details-action-wrapper">
                            <a href="#" class="btn-product btn-wishlist" title="Wishlist"><span>Add to Wishlist</span></a>
                            <a href="#" class="btn-product btn-compare" title="Compare"><span>Add to Compare</span></a>
                        </div>
                        <a href="#" class="btn-product btn-cart"><span>add to cart</span></a>
                    </div>

                    <div class="product-details-footer">
                        <div class="product-cat">
                            <span>Category:</span>
                            <a href="#">${p.categoryName || ''}</a>
                        </div>
                        <div class="social-icons social-icons-sm">
                            <span class="social-label">Share:</span>
                            <a href="#" class="social-icon" title="Facebook" target="_blank"><i class="icon-facebook-f"></i></a>
                            <a href="#" class="social-icon" title="Twitter" target="_blank"><i class="icon-twitter"></i></a>
                            <a href="#" class="social-icon" title="Instagram" target="_blank"><i class="icon-instagram"></i></a>
                            <a href="#" class="social-icon" title="Pinterest" target="_blank"><i class="icon-pinterest"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `;

      // Open Magnific Popup Inline
      if (window.jQuery && $.magnificPopup) {
          $.magnificPopup.open({
              items: { src: '#quickViewModal' },
              type: 'inline',
              mainClass: 'mfp-ajax-product',
              removalDelay: 300,
              callbacks: {
                  open: function() {
                      // Initialize Carousel safely AFTER popup is visible
                      setTimeout(() => {
                          let $carousel = $('#quickViewModal .qv-carousel');
                          if($carousel.length && $.fn.owlCarousel) {
                              $carousel.owlCarousel({
                              items: 1,
                                  dots: false,
                                  nav: false,
                                  URLhashListener: true,
                              responsive: { 900: { items: 1, nav: true, dots: true } }
                              });
                          }
                      }, 100);
                  }
              }
          });
      }
    })
    .catch(console.error);
}

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
    main.src =  p.image;
    main.setAttribute("data-zoom-image",  p.image);
  }

  // Gallery
  const gallery = document.getElementById("product-zoom-gallery");
  if (gallery) {
    gallery.innerHTML = "";
    const images = [p.image, ...(p.imageGallery || [])];

    images.forEach((img, i) => {
      gallery.innerHTML += `
        <a class="product-gallery-item ${i===0?'active':''}" href="#"
           data-image="${img}"
           data-zoom-image="${img}">
           <img src="${img}" alt="">
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
