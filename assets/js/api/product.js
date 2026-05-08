var domain = "http://microsite_backend.workarya.com";
var api = `${domain}/api/product/getproduct`;

const selectedProductIds = new Set();

function parseArray(val) {
  if (!val) return [];
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch (e) {
      return [];
    }
  }
  return Array.isArray(val) ? val : [];
}

window.getProductCardHTML = function (p, wrapperClass, showCheckbox = true) {
  let pColors = parseArray(p.colorNames);
  let pVariants = parseArray(p.variants);

  let mainGallery = parseArray(p.imageGallery);
  let mainHoverImg = mainGallery.length > 0 ? mainGallery[0] : "";

  let gridColorMap = {};
  pColors.forEach((c) => {
    gridColorMap[c] = {
      image: p.image,
      hoverImage: mainHoverImg,
      price: p.discountPrice > 0 ? p.discountPrice : p.price,
      name: p.productName,
    };
  });
  pVariants.forEach((v) => {
    const vActive =
      v.isActive !== undefined
        ? v.isActive
        : v.IsActive !== undefined
          ? v.IsActive
          : v.isactive;
    if (
      vActive === true ||
      vActive === 1 ||
      String(vActive).toLowerCase() === "true"
    ) {
      let vColors = parseArray(v.colorNames);
      let vGallery = parseArray(v.imageGallery);
      let vHoverImg = vGallery.length > 0 ? vGallery[0] : mainHoverImg;

      vColors.forEach((c) => {
        if (!gridColorMap[c]) {
          gridColorMap[c] = {
            image: v.image || p.image,
            hoverImage: vHoverImg,
            price: v.discountPrice > 0 ? v.discountPrice : (v.price > 0 ? v.price : (p.discountPrice > 0 ? p.discountPrice : p.price)),
            name: v.variantName || p.productName,
          };
        }
      });
    }
  });

  let gridColorHtml = "";
  let firstGridColor = "";
  Object.keys(gridColorMap).forEach((c, i) => {
    const vData = gridColorMap[c];
    if (i === 0) firstGridColor = c;
    gridColorHtml += `
            <a href="#" class="grid-color-swatch ${i === 0 ? "active" : ""}" title="${c}" style="display: inline-block; margin-right: 5px;"
               data-img="${vData.image}" data-hover-img="${vData.hoverImage || ""}" data-price="${vData.price || 0}" data-name="${vData.name}">
               <span style="display:block;width:20px;height:20px;border-radius:50%;background:${c};border:1px solid #ccc"></span>
            </a>
         `;
  });

  let firstGridData =
    firstGridColor && gridColorMap[firstGridColor]
      ? gridColorMap[firstGridColor]
      : { image: p.image, hoverImage: mainHoverImg };
  let hoverHtml = firstGridData.hoverImage
    ? `<img src="${firstGridData.hoverImage}" alt="${p.productName}" class="product-image-hover grid-product-image-hover">`
    : "";

  const isChecked = selectedProductIds.has(String(p.id)) ? "checked" : "";
  const checkboxHtml = showCheckbox
    ? `<input type="checkbox" class="product-select-cb" value="${p.id}" ${isChecked} style="position: absolute; top: 15px; left: 15px; z-index: 10; width: 18px; height: 18px; cursor: pointer;">`
    : "";

  let innerHTML = `
          <div class="product product-7 text-center" style="position: relative;">
            ${checkboxHtml}
            <figure class="product-media">
              
              <!-- ✅ Image click also sends id -->
              <a href="product.php?id=${p.id}&color=${encodeURIComponent(firstGridColor)}">
                <img src="${firstGridData.image}" alt="${p.productName}" class="product-image grid-product-image">
                ${hoverHtml}
              </a>

              <div class="product-action-vertical">
                <a href="#" class="btn-product-icon btn-wishlist btn-expandable">
                  <span>add to wishlist</span>
                </a>

                <button 
                  type="button"
                  class="btn-product-icon btn-quickview"
                  data-id="${p.id}"
                  data-color="${firstGridColor}"
                  title="Quick view">
                  <span>Quick view</span>
                </button>
              </div>

              <div class="product-action">
                <a href="#" class="btn-product btn-cart" data-id="${p.id}">
                  <span>add to cart</span>
                </a>
              </div>
            </figure>

            <div class="product-body">
              <div class="product-cat">
                <a href="#">${p.categoryName ?? "Category"}</a>
              </div>

              <h3 class="product-title">
                <a href="product.php?id=${p.id}&color=${encodeURIComponent(firstGridColor)}" class="grid-product-title">
                  ${p.productName}
                </a>
              </h3>

              <div class="product-price grid-product-price">
                ₹${p.discountPrice > 0 ? p.discountPrice : p.price}
              </div>
              
              <div class="product-nav product-nav-thumbs mt-1">
                ${gridColorHtml}
              </div>
            </div>
          </div>
      `;
  return wrapperClass
    ? `<div class="${wrapperClass}">${innerHTML}</div>`
    : innerHTML;
};

window.renderShopGrid = function (products) {
  const row = document.getElementById("productRow");
  if (row) {
    const itemsPerPage = 50;
    let currentPage = 1;
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const toolboxInfo = document.querySelector(".toolbox-info");
    const paginationWrap = document.querySelector(".pagination");

    function renderPage(page) {
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      currentPage = page;

      row.innerHTML = "";
      const start = (page - 1) * itemsPerPage;
      const end = Math.min(start + itemsPerPage, totalItems);
      const paginatedItems = products.slice(start, end);

      if (paginatedItems.length === 0) {
        row.innerHTML =
          "<p class='text-center w-100' style='padding: 50px 0;'>No products found.</p>";
      } else {
        paginatedItems.forEach((p) => {
          row.innerHTML += window.getProductCardHTML(
            p,
            "col-6 col-md-4 col-lg-4 col-xl-3",
          );
        });
      }

      if (toolboxInfo) {
        const selectAllChecked =
          paginatedItems.length > 0 &&
          paginatedItems.every((p) => selectedProductIds.has(String(p.id)))
            ? "checked"
            : "";
        toolboxInfo.innerHTML = `Showing <span>${end > 0 ? start + 1 : 0}-${end} of ${totalItems}</span> Products
          <span style="margin-left: 20px; font-weight: bold; align-items: center; gap: 5px;">
             <input type="checkbox" id="selectAllProducts" ${selectAllChecked} style="width: 16px; height: 16px; cursor: pointer; margin: 0;">
             <label for="selectAllProducts" style="margin: 0; cursor: pointer;">Select All</label>
          </span>
          <span style="margin-left: 20px; color: #030303; font-weight: bold;">
             Selected: <span id="selectedProductCount">${selectedProductIds.size}</span>
          </span>
          <button id="addSelectedToCart" class="btn btn-outline-primary-2 btn-sm" style="margin-left: 20px; padding: 5px 15px; min-width: 130px; border-radius: 4px;">Add Selected to Cart</button>`;
      }

      if (paginationWrap) {
        let pgHtml = `
            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                <a class="page-link page-link-prev" href="#" aria-label="Previous" tabindex="-1" aria-disabled="${currentPage === 1}">
                    <span aria-hidden="true"><i class="icon-long-arrow-left"></i></span>Prev
                </a>
            </li>
          `;

        for (let i = 1; i <= totalPages; i++) {
          pgHtml += `<li class="page-item ${i === currentPage ? "active" : ""}" ${i === currentPage ? 'aria-current="page"' : ""}>
                <a class="page-link page-num" href="#" data-page="${i}">${i}</a>
            </li>`;
        }

        pgHtml += `
            <li class="page-item-total" style="margin-left: 10px; margin-right: 10px; display: flex; align-items: center;">of ${totalPages}</li>
            <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
                <a class="page-link page-link-next" href="#" aria-label="Next">
                    Next <span aria-hidden="true"><i class="icon-long-arrow-right"></i></span>
                </a>
            </li>
          `;
        paginationWrap.innerHTML = pgHtml;
      }
    }

    renderPage(currentPage);

    const newPaginationWrap = paginationWrap
      ? paginationWrap.cloneNode(true)
      : null;
    if (paginationWrap && newPaginationWrap) {
      paginationWrap.parentNode.replaceChild(newPaginationWrap, paginationWrap);
      newPaginationWrap.addEventListener("click", function (e) {
        e.preventDefault();
        const target = e.target.closest("a.page-link");
        if (!target) return;

        if (target.classList.contains("page-link-prev") && currentPage > 1) {
          renderPage(currentPage - 1);
        } else if (
          target.classList.contains("page-link-next") &&
          currentPage < totalPages
        ) {
          renderPage(currentPage + 1);
        } else if (target.classList.contains("page-num")) {
          renderPage(parseInt(target.getAttribute("data-page")));
        }

        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the list when page changes
      });
    }
  }
};

fetch(api)
  .then((res) => res.json())
  .then((products) => {
    // 1) Main Shop Page Grid
    window.renderShopGrid(products);

    // 2) Featured Products (Homepage Carousel)
    const featuredTab = document.getElementById("featured-women-tab");
    if (featuredTab) {
      const carousel = featuredTab.querySelector(".owl-carousel");
      if (carousel) {
        if (window.jQuery && $(carousel).hasClass("owl-loaded")) {
          $(carousel)
            .trigger("destroy.owl.carousel")
            .removeClass("owl-loaded owl-hidden");
          $(carousel).find(".owl-stage-outer").children().unwrap();
        }
        carousel.innerHTML = "";
        const featuredProducts = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        featuredProducts.forEach((p) => {
          carousel.innerHTML += window.getProductCardHTML(p, "", false);
        });
        setTimeout(() => {
          if (window.jQuery && $.fn.owlCarousel) {
            let options = $(carousel).data("owl-options") || {
              nav: false,
              dots: true,
              margin: 20,
              loop: false,
              responsive: {
                0: { items: 2 },
                480: { items: 2 },
                768: { items: 3 },
                992: { items: 4 },
                1200: { items: 5, nav: true },
              },
            };
            $(carousel).owlCarousel(options);
          }
        }, 100);
      }
    }

    // 3) New Arrivals (Homepage Grid)
    const newArrivalsTab = document.getElementById("new-women-tab");
    if (newArrivalsTab) {
      const rowContainer = newArrivalsTab.querySelector(".row");
      if (rowContainer) {
        rowContainer.innerHTML = "";
        const newArrivals = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        newArrivals.forEach((p) => {
          rowContainer.innerHTML += window.getProductCardHTML(
            p,
            "col-6 col-md-4 col-lg-3 col-xl-5col",
            false,
          );
        });
      }
    }
  })
  .catch((err) => console.error(err));

// const
//  = "http://microsite_backend.workarya.com";

// 1) id read
var currentProductId = new URLSearchParams(window.location.search).get("id");
var currentProductColor = new URLSearchParams(window.location.search).get(
  "color",
);

// Helper to attach variants if the getproductbyid API omits them
async function attachVariantsIfNeeded(p) {
  let pVariants = parseArray(p.variants || p.Variants);
  if (pVariants.length === 0) {
    try {
      const res = await fetch(`${domain}/api/variant/getvariant`);
      const allVars = await res.json();
      if (Array.isArray(allVars)) {
        p.variants = allVars.filter(
          (v) =>
            String(v.productId) === String(p.id) ||
            String(v.ProductId) === String(p.id),
        );
      }
    } catch (e) {
      console.error("Failed to fetch variants", e);
    }
  } else {
    p.variants = pVariants; // normalize property name
  }
  return p;
}

if (currentProductId) {
  // 2) API call by id for standalone product page
  fetch(`${domain}/api/product/getproductbyid/${currentProductId}`)
    .then((res) => res.json())
    .then(async (res) => {
      if (!res.status) return;
      let p = await attachVariantsIfNeeded(res.data);
      loadProduct(p);
    })
    .catch(console.error);
}

// --- QUICK VIEW INLINE POPUP LOGIC ---
document.addEventListener("click", function (e) {
  const qvBtn = e.target.closest(".btn-quickview");
  if (qvBtn) {
    e.preventDefault();
    const prodId = qvBtn.getAttribute("data-id");
    const color = qvBtn.getAttribute("data-color");
    if (prodId) openQuickViewModal(prodId, color);
  }
});

function openQuickViewModal(prodId, selectedColor) {
  fetch(`${domain}/api/product/getproductbyid/${prodId}`)
    .then((res) => res.json())
    .then(async (res) => {
      if (!res.status) return;
      const p = await attachVariantsIfNeeded(res.data);

      let qvModal = document.getElementById("quickViewModal");
      if (!qvModal) {
        qvModal = document.createElement("div");
        qvModal.id = "quickViewModal";
        qvModal.className = "container quickView-container mfp-hide";
        document.body.appendChild(qvModal);
      }

      // Gallery Images
      const images = [p.image, ...(p.imageGallery || [])].filter(Boolean);
      let leftHtml = "";
      let rightHtml = "";
      images.forEach((img, i) => {
        let hash = `hash-${i}`;
        let active = i === 0 ? "active" : "";
        leftHtml += `
            <a href="#${hash}" class="carousel-dot ${active}">
                <img src="${img}">
            </a>`;
        rightHtml += `
            <div class="intro-slide" data-hash="${hash}">
                <img src="${img}" alt="Image" style="max-width: 100%; height: auto; max-height: 500px; object-fit: contain; margin: 0 auto;">
            </div>`;
      });

      // Colors & Sizes Mapping
      let colorMap = {};
      let mainColors = parseArray(p.colorNames);
      let mainSizes = parseArray(p.sizeNames);
      let allVariants = parseArray(p.variants);

      // Start with main product data
      mainColors.forEach((c) => {
        colorMap[c] = {
          id: p.id,
          name: p.productName,
          price: p.discountPrice > 0 ? p.discountPrice : p.price,
          image: p.image,
          sizes: mainSizes,
          gallery: p.imageGallery || [],
        };
      });
      // Overwrite with variant data
      allVariants.forEach((v) => {
        const vActive =
          v.isActive !== undefined
            ? v.isActive
            : v.IsActive !== undefined
              ? v.IsActive
              : v.isactive;
        if (
          vActive === true ||
          vActive === 1 ||
          String(vActive).toLowerCase() === "true"
        ) {
          let vColors = parseArray(v.colorNames);
          let vSizes = parseArray(v.sizeNames);
          vColors.forEach((c) => {
            // Variant data takes precedence
            colorMap[c] = {
              id: v.id,
              name: v.variantName || p.productName,
              price: v.discountPrice > 0 ? v.discountPrice : (v.price > 0 ? v.price : (p.discountPrice > 0 ? p.discountPrice : p.price)),
              image: v.image || p.image,
              sizes: vSizes.length > 0 ? vSizes : mainSizes,
              gallery:
                v.imageGallery && v.imageGallery.length > 0
                  ? v.imageGallery
                  : p.imageGallery || [],
            };
          });
        }
      });

      let colorHtml = "";
      let firstColorSizes = mainSizes;
      Object.keys(colorMap).forEach((c, i) => {
        const vData = colorMap[c];
        if (i === 0) firstColorSizes = vData.sizes;
        let sizesStr = JSON.stringify(vData.sizes).replace(/"/g, "&quot;");
        let galleryStr = JSON.stringify(vData.gallery).replace(/"/g, "&quot;");
        colorHtml += `
         <a href="#" class="color-swatch ${i === 0 ? "active" : ""}" title="${c}" data-id="${vData.id || p.id}" data-name="${vData.name || ""}" data-price="${vData.price || 0}" data-image="${vData.image || ""}" data-sizes="${sizesStr}" data-gallery="${galleryStr}">
            <span style="display:inline-block;width:25px;height:25px;border-radius:50%;background:${c};border:1px solid #ccc;margin-right:5px;"></span>
         </a>`;
      });

      // Sizes
      let sizeHtml =
        '<option value="#" selected="selected">Select a size</option>';
      firstColorSizes.forEach((s) => {
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
                    <h2 class="product-title">${p.productName || ""}</h2>
                    <h3 class="product-price">₹${p.discountPrice > 0 ? p.discountPrice : p.price}</h3>
                    <div class="ratings-container">
                        <div class="ratings">
                            <div class="ratings-val" style="width: 80%;"></div>
                        </div>
                        <span class="ratings-text">( 2 Reviews )</span>
                    </div>
                    <p class="product-txt">${p.shortDescription || p.description || ""}</p>

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
                            <input type="number" id="qty" class="form-control" value="1" min="1" max="10" step="1" data-decimals="0" required style="display: none;">
                            <div class="input-group input-spinner">
                                <div class="input-group-prepend">
                                    <button style="min-width: 26px" class="btn btn-decrement btn-spinner" type="button"><i class="icon-minus"></i></button>
                                </div>
                                <input type="text" style="text-align: center" class="form-control" required value="1" readonly>
                                <div class="input-group-append">
                                    <button style="min-width: 26px" class="btn btn-increment btn-spinner" type="button"><i class="icon-plus"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="product-details-action">
                        <div class="details-action-wrapper">
                            <a href="#" class="btn-product btn-wishlist" title="Wishlist"><span>Add to Wishlist</span></a>
                            <a href="#" class="btn-product btn-compare" title="Compare"><span>Add to Compare</span></a>
                        </div>
                        <a href="#" class="btn-product btn-cart" data-id="${p.id}"><span>add to cart</span></a>
                    </div>

                    <div class="product-details-footer">
                        <div class="product-cat">
                            <span>Category:</span>
                            <a href="#">${p.categoryName || ""}</a>
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
          items: { src: "#quickViewModal" },
          type: "inline",
          mainClass: "mfp-ajax-product",
          removalDelay: 300,
          callbacks: {
            open: function () {
              // Initialize Carousel safely AFTER popup is visible
              setTimeout(() => {
                let $carousel = $("#quickViewModal .qv-carousel");
                if ($carousel.length && $.fn.owlCarousel) {
                  $carousel.owlCarousel({
                    items: 1,
                    dots: false,
                    nav: false,
                    URLhashListener: true,
                    responsive: { 900: { items: 1, nav: true, dots: true } },
                  });
                }

                // Auto-click the color swatch to sync data
                let activeSwatch = null;
                if (selectedColor) {
                  activeSwatch = document.querySelector(
                    `#quickViewModal .color-swatch[title="${selectedColor}"]`,
                  );
                }
                if (!activeSwatch) {
                  activeSwatch = document.querySelector(
                    "#quickViewModal .color-swatch.active",
                  );
                }
                if (activeSwatch) activeSwatch.click();
              }, 100);
            },
          },
        });
      }
    })
    .catch(console.error);
}

// 3) Fill data
function loadProduct(p) {
  const pName = document.getElementById("pName");
  if (pName) pName.innerText = p.productName || "";

  const pPrice = document.getElementById("pPrice");
  if (pPrice) pPrice.innerText = `₹${p.discountPrice > 0 ? p.discountPrice : p.price}`;
 

  const sdec = document.getElementById("sdec");
  if (sdec) sdec.innerText = p.shortDescription || "";

  const pDesc = document.getElementById("pDesc");
  if (pDesc) pDesc.innerText = p.description || "";

  const pCat = document.getElementById("pCat");
  if (pCat) {
    pCat.innerHTML = `
      <span><b>Category:</b></span>
      <a href="#">${p.categoryName ?? ""}</a>
    `;
  }

  const brand = document.getElementById("brand");
  if (brand) {
    brand.innerHTML = `

        <span><b>Brand:</b></span>
        <a href="#">${p.brandName ?? ""}</a>
    `;
  }

  // Main image
  const main = document.getElementById("product-zoom");
  if (main) {
    main.src = p.image;
    main.setAttribute("data-zoom-image", p.image);
  }

  // Gallery
  const gallery = document.getElementById("product-zoom-gallery");
  if (gallery) {
    gallery.innerHTML = "";
    const images = [p.image, ...(p.imageGallery || [])];

    images.forEach((img, i) => {
      gallery.innerHTML += `
        <a class="product-gallery-item ${i === 0 ? "active" : ""}" href="#"
           data-image="${img}"
           data-zoom-image="${img}">
           <img src="${img}" alt="">
        </a>
      `;
    });
  }

  let colorMap = {};
  let mainColors = parseArray(p.colorNames);
  let mainSizes = parseArray(p.sizeNames);
  let allVariants = parseArray(p.variants);

  // Start with main product data
  mainColors.forEach((c) => {
    colorMap[c] = {
      id: p.id,
      name: p.productName,
      price: p.discountPrice > 0 ? p.discountPrice : p.price,
      image: p.image,
      sizes: mainSizes,
      gallery: p.imageGallery || [],
    };
  });
  // Overwrite with variant data
  allVariants.forEach((v) => {
    const vActive =
      v.isActive !== undefined
        ? v.isActive
        : v.IsActive !== undefined
          ? v.IsActive
          : v.isactive;
    if (
      vActive === true ||
      vActive === 1 ||
      String(vActive).toLowerCase() === "true"
    ) {
      let vColors = parseArray(v.colorNames);
      let vSizes = parseArray(v.sizeNames);
      vColors.forEach((c) => {
        // Variant data takes precedence
        colorMap[c] = {
          id: v.id,
          name: v.variantName || p.productName,
          price: v.discountPrice > 0 ? v.discountPrice : (v.price > 0 ? v.price : (p.discountPrice > 0 ? p.discountPrice : p.price)),
          image: v.image || p.image,
          sizes: vSizes.length > 0 ? vSizes : mainSizes,
          gallery:
            v.imageGallery && v.imageGallery.length > 0
              ? v.imageGallery
              : p.imageGallery || [],
        };
      });
    }
  });

  let firstColorSizes = mainSizes;
  const colors = document.getElementById("colorThumbs");
  if (colors) {
    colors.innerHTML = "";
    Object.keys(colorMap).forEach((c, i) => {
      const vData = colorMap[c];
      if (i === 0) firstColorSizes = vData.sizes;
      let sizesStr = JSON.stringify(vData.sizes).replace(/"/g, "&quot;");
      let galleryStr = JSON.stringify(vData.gallery).replace(/"/g, "&quot;");
      colors.innerHTML += `
        <a href="#" class="color-swatch ${i === 0 ? "active" : ""}" title="${c}" style="display: inline-block; margin-right: 5px;" data-id="${vData.id || p.id}" data-name="${vData.name || ""}" data-price="${vData.price || 0}" data-image="${vData.image || ""}" data-sizes="${sizesStr}" data-gallery="${galleryStr}">
          <span style="display:block;width:25px;height:25px;border-radius:50%;background:${c};border:1px solid #ccc"></span>
        </a>
      `;
    });
  }

  const size = document.getElementById("size");
  if (size) {
    size.innerHTML = `<option>Select size</option>`;
    firstColorSizes.forEach((s) => {
      size.innerHTML += `<option value="${s}">${s}</option>`;
    });
  }

  // Auto click the first color swatch to sync image/price/sizes on load
  const cartBtn = document.querySelector(".product-details-action .btn-cart");
  if (cartBtn) {
    cartBtn.setAttribute("data-id", p.id);
  }

  setTimeout(() => {
    let activeSwatch = null;
    if (typeof currentProductColor !== "undefined" && currentProductColor) {
      activeSwatch = document.querySelector(
        `#colorThumbs .color-swatch[title="${currentProductColor}"]`,
      );
    }
    if (!activeSwatch) {
      activeSwatch = document.querySelector(
        "#colorThumbs .color-swatch.active",
      );
    }
    if (activeSwatch) activeSwatch.click();
  }, 100);
}

// --- Handle Variant Color Click (Updates Sizes, Price, Image, Title) ---
document.addEventListener("click", function (e) {
  const swatch = e.target.closest(".color-swatch");
  if (swatch) {
    e.preventDefault();

    // Toggle active classes
    const parent = swatch.parentElement;
    if (parent) {
      parent
        .querySelectorAll(".color-swatch")
        .forEach((el) => el.classList.remove("active"));
    }
    swatch.classList.add("active");

    // Extract variant data
    const varId = swatch.getAttribute("data-id");
    const name = swatch.getAttribute("data-name");
    const price = swatch.getAttribute("data-price");
    const img = swatch.getAttribute("data-image");
    const sizesStr = swatch.getAttribute("data-sizes");
    const galleryStr = swatch.getAttribute("data-gallery");
    let sizes = [];
    try {
      sizes = JSON.parse(sizesStr);
    } catch (err) {}

    const qvModal = document.getElementById("quickViewModal");
    const isQuickView = qvModal && qvModal.contains(swatch);

    const titleEl = isQuickView
      ? qvModal.querySelector(".product-title")
      : document.getElementById("pName");
    const priceEl = isQuickView
      ? qvModal.querySelector(".product-price")
      : document.getElementById("pPrice");
    const sizeEl = isQuickView
      ? qvModal.querySelector("#size")
      : document.getElementById("size");

    if (name && titleEl) titleEl.innerText = name;
    if (price && priceEl) priceEl.innerText = "₹" + price;

    const cartBtn = isQuickView
      ? qvModal.querySelector(".btn-cart")
      : document.querySelector(".product-details-action .btn-cart");
    if (cartBtn && varId) {
      cartBtn.setAttribute("data-variant-id", varId);
    }

    if (img) {
      if (isQuickView) {
        let newGallery = [];
        try {
          newGallery = JSON.parse(galleryStr);
        } catch (e) {}
        const allImages = [img, ...newGallery].filter(Boolean);

        const qvLeft = qvModal.querySelector(".product-left");
        const qvRight = qvModal.querySelector(".product-right .owl-carousel");

        if (qvLeft && qvRight) {
          if (window.jQuery && $(qvRight).hasClass("owl-loaded")) {
            $(qvRight)
              .trigger("destroy.owl.carousel")
              .removeClass("owl-loaded owl-hidden");
            $(qvRight).find(".owl-stage-outer").children().unwrap();
          }
          qvLeft.innerHTML = "";
          qvRight.innerHTML = "";

          allImages.forEach((gImg, i) => {
            const hash = `hash-${i}`;
            qvLeft.innerHTML += `<a href="#${hash}" class="carousel-dot ${i === 0 ? "active" : ""}"><img src="${gImg}"></a>`;
            qvRight.innerHTML += `<div class="intro-slide" data-hash="${hash}"><img src="${gImg}" alt="Image" style="max-width: 100%; height: auto; max-height: 500px; object-fit: contain; margin: 0 auto;"></div>`;
          });

          setTimeout(() => {
            if (window.jQuery && $.fn.owlCarousel) {
              $(qvRight).owlCarousel({
                items: 1,
                dots: false,
                nav: false,
                URLhashListener: true,
                responsive: { 900: { items: 1, nav: true, dots: true } },
              });
            }
          }, 100);
        }
      } else {
        const mainImg = document.getElementById("product-zoom");
        const galleryEl = document.getElementById("product-zoom-gallery");

        if (mainImg) {
          mainImg.src = img;
          mainImg.setAttribute("data-zoom-image", img);

          // Re-initialize elevateZoom for the main product page so hover zoom works on the new variant image
          if (window.jQuery && $.fn.elevateZoom) {
            $(".zoomContainer").remove();

            if (galleryEl) {
              galleryEl.innerHTML = "";
              let newGallery = [];
              try {
                newGallery = JSON.parse(galleryStr);
              } catch (e) {}
              const allImages = [img, ...newGallery].filter(Boolean);
              allImages.forEach((gImg, i) => {
                galleryEl.innerHTML += `<a class="product-gallery-item ${i === 0 ? "active" : ""}" href="#" data-image="${gImg}" data-zoom-image="${gImg}"><img src="${gImg}" alt=""></a>`;
              });
            }

            $(mainImg).removeData("elevateZoom");
            $(mainImg).elevateZoom({
              gallery: "product-zoom-gallery",
              galleryActiveClass: "active",
              zoomType: "inner",
              cursor: "crosshair",
              zoomWindowFadeIn: 400,
              zoomWindowFadeOut: 400,
              responsive: true,
            });
          }
        }
      }
    }

    if (sizeEl) {
      sizeEl.innerHTML = isQuickView
        ? '<option value="#" selected="selected">Select a size</option>'
        : "<option>Select size</option>";
      sizes.forEach(
        (s) => (sizeEl.innerHTML += `<option value="${s}">${s}</option>`),
      );
    }
  }
});

// --- Handle Product Details Quantity Increment/Decrement ---
document.addEventListener("click", function(e) {
  const incBtn = e.target.closest(".product-details-quantity .btn-increment");
  const decBtn = e.target.closest(".product-details-quantity .btn-decrement");

  if (incBtn || decBtn) {
    e.preventDefault();
    const container = (incBtn || decBtn).closest(".product-details-quantity");
    const hiddenInput = container.querySelector("input[type='number']");
    const visibleInput = container.querySelector("input[type='text']");

    if (hiddenInput && visibleInput) {
      let currentVal = parseInt(visibleInput.value) || 1;
      const min = parseInt(hiddenInput.getAttribute("min")) || 1;
      const max = parseInt(hiddenInput.getAttribute("max")) || 10;

      if (incBtn && currentVal < max) currentVal++;
      else if (decBtn && currentVal > min) currentVal--;

      visibleInput.value = currentVal;
      hiddenInput.value = currentVal;
    }
  }
});

// const domain = "http://microsite_backend.workarya.com";

document.addEventListener("click", async function (e) {
  const btn = e.target.closest(".btn-cart");
  if (!btn) return;

  e.preventDefault();

  const productId = btn.getAttribute("data-id");
  const variantId = btn.getAttribute("data-variant-id");

  // Get quantity if selected (e.g., from product details page)
  let qty = 1;
  const qtyInput = document.getElementById("qty");
  if (qtyInput && btn.closest(".product-details-action")) {
      qty = parseInt(qtyInput.value) || 1;
  }

  const formData = new FormData();
  formData.append("productIds", productId);
  if (variantId) {
      formData.append("variantId", variantId);
  }
  formData.append("quantity", qty);

  const token = localStorage.getItem("token");
  let guestId = localStorage.getItem("guestId");
  let headers = {};
  if (token) headers["Authorization"] = "Bearer " + token;
  else if (guestId) headers["guestId"] = guestId;

  try {
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<span>Adding...</span>';
    btn.style.pointerEvents = 'none';

    const res = await fetch(`${domain}/api/cart/add-multiple`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    const data = await res.json();
    
    btn.innerHTML = originalHtml;
    btn.style.pointerEvents = 'auto';

    if (data.status) {
      if (data.guestId && !token) localStorage.setItem("guestId", data.guestId);
      
      // Instantly update the cart counter UI
      document.querySelectorAll('.cart-count').forEach(el => {
          el.innerText = parseInt(el.innerText || 0) + qty;
      });
      
      // Fetch API internally to refresh the dropdown mini-cart data
      if (typeof window.loadCart === 'function') {
          window.loadCart();
      }

      iziToast.success({
        title: "Success",
        message: "Product added to cart",
        position: "topRight",
        timeout: 3000
      });
    } else {
      iziToast.error({
        title: "Error",
        message: data.message || "Failed to add product",
        position: "topRight"
      });
    }
  } catch (err) {
    console.error(err);
    iziToast.error({
      title: "Server Error",
      message: "Something went wrong",
      position: "topRight"
    });
  }
});

// --- Handle Product Checkbox Selections ---
document.addEventListener("change", function (e) {
  if (e.target.classList.contains("product-select-cb")) {
    if (e.target.checked) {
      selectedProductIds.add(e.target.value);
    } else {
      selectedProductIds.delete(e.target.value);
    }
    updateSelectionUI();
  }

  if (e.target.id === "selectAllProducts") {
    const isChecked = e.target.checked;
    document.querySelectorAll(".product-select-cb").forEach((cb) => {
      cb.checked = isChecked;
      if (isChecked) {
        selectedProductIds.add(cb.value);
      } else {
        selectedProductIds.delete(cb.value);
      }
    });
    updateSelectionUI();
  }
});

function updateSelectionUI() {
  const countEl = document.getElementById("selectedProductCount");
  if (countEl) {
    countEl.innerText = selectedProductIds.size;
  }
  const selectAllCb = document.getElementById("selectAllProducts");
  if (selectAllCb) {
    const cbs = document.querySelectorAll(".product-select-cb");
    const checkedCbs = document.querySelectorAll(".product-select-cb:checked");
    selectAllCb.checked = cbs.length > 0 && cbs.length === checkedCbs.length;
  }
}

// --- Handle Grid Color Swatch Click ---
document.addEventListener("click", function (e) {
  const gridSwatch = e.target.closest(".grid-color-swatch");
  if (gridSwatch) {
    e.preventDefault();

    // Toggle active class
    const parent = gridSwatch.closest(".product-nav-thumbs");
    if (parent) {
      parent
        .querySelectorAll(".grid-color-swatch")
        .forEach((el) => el.classList.remove("active"));
    }
    gridSwatch.classList.add("active");

    // Extract data
    const img = gridSwatch.getAttribute("data-img");
    const hoverImg = gridSwatch.getAttribute("data-hover-img");
    const price = gridSwatch.getAttribute("data-price");
    const name = gridSwatch.getAttribute("data-name");

    // Update DOM
    const productCard = gridSwatch.closest(".product");
    if (productCard) {
      if (img) {
        const imgEl = productCard.querySelector(".grid-product-image");
        if (imgEl) imgEl.src = img;
      }

      if (hoverImg !== null) {
        const hoverImgEl = productCard.querySelector(
          ".grid-product-image-hover",
        );
        if (hoverImgEl && hoverImg) {
          hoverImgEl.src = hoverImg;
        } else if (!hoverImgEl && hoverImg) {
          const imgLink = productCard.querySelector("figure.product-media a");
          if (imgLink)
            imgLink.insertAdjacentHTML(
              "beforeend",
              `<img src="${hoverImg}" alt="Hover image" class="product-image-hover grid-product-image-hover">`,
            );
        } else if (hoverImgEl && !hoverImg) {
          hoverImgEl.remove();
        }
      }

      if (price) {
        const priceEl = productCard.querySelector(".grid-product-price");
        if (priceEl) priceEl.innerText = "₹" + price;
      }
      if (name) {
        const titleEl = productCard.querySelector(".grid-product-title");
        if (titleEl) titleEl.innerText = name;
      }

      // Update Quick View and Product Page links to carry the selected color
      const qvBtn = productCard.querySelector(".btn-quickview");
      if (qvBtn) {
        const pId = qvBtn.getAttribute("data-id");
        qvBtn.setAttribute("data-color", gridSwatch.getAttribute("title"));
        const mainLinks = productCard.querySelectorAll(
          'a[href*="product.php?id="]',
        );
        mainLinks.forEach((link) => {
          link.setAttribute(
            "href",
            `product.php?id=${pId}&color=${encodeURIComponent(gridSwatch.getAttribute("title"))}`,
          );
        });
      }
    }
  }
});

// --- Handle Add Selected Products to Cart ---
document.addEventListener("click", async function (e) {
  if (e.target.id === "addSelectedToCart") {
    e.preventDefault();

    if (selectedProductIds.size === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Please select at least one product",
        position: "topRight"
      });
      return;
    }

    const btn = e.target;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = 'Adding...';
    btn.style.pointerEvents = 'none';

    const formData = new FormData();
    const productsArray = Array.from(selectedProductIds).map(id => ({
      productId: id,
      quantity: 1
    }));
    
    Array.from(selectedProductIds).forEach(id => {
      formData.append("productIds[]", id);
      formData.append("quantities[]", 1);
    });
    // Fallback payload styles to match different backend implementations
    formData.append("products", JSON.stringify(productsArray));

    const token = localStorage.getItem("token");
    let guestId = localStorage.getItem("guestId");
    let headers = {};
    if (token) headers["Authorization"] = "Bearer " + token;
    else if (guestId) headers["guestId"] = guestId;

    try {
      const res = await fetch(`${domain}/api/cart/add-multiple`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const data = await res.json();
      
      btn.innerHTML = originalHtml;
      btn.style.pointerEvents = 'auto';

      if (data.status) {
        if (data.guestId && !token) localStorage.setItem("guestId", data.guestId);
        
        document.querySelectorAll('.cart-count').forEach(el => {
            el.innerText = parseInt(el.innerText || 0) + selectedProductIds.size;
        });
        
        if (typeof window.loadCart === 'function') {
            window.loadCart();
        }

        // Clear selection
        selectedProductIds.clear();
        updateSelectionUI();
        document.querySelectorAll(".product-select-cb").forEach(cb => cb.checked = false);
        const selectAllCb = document.getElementById("selectAllProducts");
        if (selectAllCb) selectAllCb.checked = false;

        iziToast.success({
          title: "Success",
          message: data.message || "Selected products added to cart",
          position: "topRight"
        });
      } else {
        iziToast.error({
          title: "Error",
          message: data.message || "Failed to add products",
          position: "topRight"
        });
      }
    } catch (err) {
      console.error(err);
      btn.innerHTML = originalHtml;
      btn.style.pointerEvents = 'auto';
      iziToast.error({
        title: "Server Error",
        message: "Something went wrong",
        position: "topRight"
      });
    }
  }
});
