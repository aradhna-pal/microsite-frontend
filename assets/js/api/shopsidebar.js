
// const domain = "http://microsite_backend.workarya.com";
const sizeApi = `${domain}/api/admin/getsize`;

fetch(sizeApi)
  .then(res => res.json())
  .then(sizes => {
    const box = document.getElementById("sizeFilter");
    box.innerHTML = "";

    sizes.forEach((s, i) => {
      const id = `size-${i+1}`;

      box.innerHTML += `
        <div class="filter-item">
          <div class="custom-control custom-checkbox">
            <input type="checkbox"
                   class="custom-control-input size-checkbox"
                   id="${id}"
                   value="${s.id}">
            <label class="custom-control-label" for="${id}">
              ${s.sizeName}
            </label>
          </div>
        </div>
      `;
    });
  })
  .catch(err => console.error(err));




  // =================================================== brand ==================================


// const domain = "http://microsite_backend.workarya.com";
const brandApi = `${domain}/api/admin/getbrand`;

fetch(brandApi)
  .then(res => res.json())
  .then(result => {
    if (!result.status) return;

    const box = document.getElementById("brandFilter");
    box.innerHTML = "";

    result.data.forEach((b, i) => {
      const id = `brand-${i + 1}`;

      box.innerHTML += `
        <div class="filter-item">
          <div class="custom-control custom-checkbox">
            <input type="checkbox"
                   class="custom-control-input brand-checkbox"
                   id="${id}"
                   value="${b.id}">
            <label class="custom-control-label" for="${id}">
              ${b.brandName}
            </label>
          </div>
        </div>
      `;
    });
  })
  .catch(err => console.error("Brand load error:", err));



  // ============================================= color =========================================



const colorApi = `${domain}/api/admin/getcolor`;

fetch(colorApi)
  .then(res => res.json())
  .then(colors => {
    const box = document.getElementById("colorFilter");
    box.innerHTML = "";

    colors
      .filter(c => c.isactive)   // sirf active colors
      .forEach(c => {
        box.innerHTML += `
          <a href="#"
             class="color-item"
             title="${c.colorname}"
             data-id="${c.id}"
             style="
               background:${c.colorcode};
               width:28px;
               height:28px;
               border-radius:50%;
               display:inline-block;
               margin:4px;
               border:1px solid #ddd;">
            <span class="sr-only">${c.colorname}</span>
          </a>
        `;
      });
  })
  .catch(err => console.error(err));




  // ============================================== category =========================================



const catApi   = `${domain}/api/category/get`;
const subApi   = `${domain}/api/subcategory/get`;
const childApi = `${domain}/api/childCategory/get`;
fetch(catApi)
  .then(res => res.json())
  .then(cats => {
    const box = document.getElementById("categoryFilter");
    box.innerHTML = "";

    cats.filter(c => c.status).forEach(c => {
      const id = `cat-${c.id}`;

      box.innerHTML += `
        <div class="filter-item" id="wrap-${c.id}">
          <div class="custom-control custom-checkbox">
            <input type="checkbox"
                   class="custom-control-input category-checkbox"
                   id="${id}"
                   value="${c.id}">
            <label class="custom-control-label" for="${id}">
              ${c.name}
            </label>
          </div>

          <!-- Subcategory will open here -->
          <ul class="subcategory-list"
              id="sub-list-${c.id}"
              style="display:none; margin-left:20px;"></ul>
        </div>
      `;
    });

    bindCategoryClick();
  });
  function bindCategoryClick() {
  document.querySelectorAll(".category-checkbox").forEach(cb => {
    cb.addEventListener("change", function () {
      const catId = this.value;
      const subList = document.getElementById(`sub-list-${catId}`);

      if (this.checked) {
        subList.style.display = "block";

        if (subList.innerHTML.trim() === "") {
          loadSubCategories(catId, subList);
        }
      } else {
        subList.style.display = "none";
        // Uncheck all nested checkboxes
        subList.querySelectorAll('input[type="checkbox"]').forEach(childCb => {
          if (childCb.checked) {
            childCb.checked = false;
            childCb.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
    });
  });
}

function loadSubCategories(catId, subList) {
  fetch(subApi)
    .then(res => res.json())
    .then(subs => {
      const filtered = subs.filter(s => s.categoryId == catId && s.status);

      filtered.forEach(s => {
        subList.innerHTML += `
          <li class="sub-item" style="list-style:none; margin-top:6px;">
            <input type="checkbox"
                   class="subcategory-checkbox"
                   id="sub-${s.id}"
                   value="${s.id}">
            <label for="sub-${s.id}">
              ${s.subCategoryName}
            </label>

            <!-- Child UL -->
            <ul class="child-list"
                id="child-list-${s.id}"
                style="display:none; margin-left:18px;"></ul>
          </li>
        `;
      });

      bindSubCategoryClick(); // 👈 important
    });
}
function bindSubCategoryClick() {
  document.querySelectorAll(".subcategory-checkbox").forEach(cb => {
    cb.addEventListener("change", function () {
      const subId = this.value;
      const childList = document.getElementById(`child-list-${subId}`);

      if (this.checked) {
        childList.style.display = "block";

        if (childList.innerHTML.trim() === "") {
          loadChildCategories(subId, childList);
        }
      } else {
        childList.style.display = "none";
        // Uncheck all nested checkboxes
        childList.querySelectorAll('input[type="checkbox"]').forEach(childCb => {
          if (childCb.checked) {
            childCb.checked = false;
            childCb.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
    });
  });
}
function loadChildCategories(subId, childList) {
  fetch(childApi)
    .then(res => res.json())
    .then(children => {
      const filtered = children.filter(c => c.subCategoryId == subId && c.status);

      filtered.forEach(c => {
        childList.innerHTML += `
          <li style="list-style:none; margin-top:5px;">
            <input type="checkbox"
                   class="child-checkbox"
                   id="child-${c.id}"
                   value="${c.id}">
            <label for="child-${c.id}">
              ${c.childCategoryName}
            </label>
          </li>
        `;
      });
    });
}

// ============================================== Active Filters Handling =========================================

function updateActiveFilters() {
  const cleanWidget = document.querySelector('.widget-clean');
  if (!cleanWidget) return;

  // Create a container for filter tags if it doesn't exist
  let tagsContainer = document.getElementById('active-filter-tags');
  if (!tagsContainer) {
    tagsContainer = document.createElement('div');
    tagsContainer.id = 'active-filter-tags';
    tagsContainer.style.display = 'flex';
    tagsContainer.style.flexWrap = 'wrap';
    tagsContainer.style.gap = '5px';
    tagsContainer.style.flex = '1';
    tagsContainer.style.margin = '0 10px';
    cleanWidget.style.display = 'flex';
    cleanWidget.style.alignItems = 'center';
    cleanWidget.insertBefore(tagsContainer, cleanWidget.querySelector('.sidebar-filter-clear'));
  }
  
  tagsContainer.innerHTML = '';

  const addTag = (id, label, type) => {
    const tag = document.createElement('span');
    tag.style.background = '#f4f4f4';
    tag.style.padding = '4px 8px';
    tag.style.border = '1px solid #ebebeb';
    tag.style.borderRadius = '3px';
    tag.style.fontSize = '12px';
    tag.style.display = 'inline-flex';
    tag.style.alignItems = 'center';
    tag.style.color = '#333';
    
    tag.innerHTML = `${label} <i class="icon-close" style="margin-left:5px; cursor:pointer;" onclick="removeFilter('${id}', '${type}')"></i>`;
    tagsContainer.appendChild(tag);
  };

  // Checkboxes
  document.querySelectorAll('.category-checkbox:checked, .subcategory-checkbox:checked, .child-checkbox:checked, .size-checkbox:checked, .brand-checkbox:checked').forEach(cb => {
    const label = cb.nextElementSibling ? cb.nextElementSibling.innerText.trim() : cb.value;
    addTag(cb.id, label, 'checkbox');
  });

  // Colors
  document.querySelectorAll('.color-item.selected').forEach(c => {
    const label = c.getAttribute('title') || 'Color';
    addTag(c.getAttribute('data-id'), label, 'color');
  });

  // Price Slider Tag
  const priceSlider = document.getElementById('price-slider');
  if (priceSlider && priceSlider.noUiSlider) {
    const prices = priceSlider.noUiSlider.get();
    const options = priceSlider.noUiSlider.options;
    const defaultMin = Array.isArray(options.range.min) ? options.range.min[0] : options.range.min;
    const defaultMax = Array.isArray(options.range.max) ? options.range.max[0] : options.range.max;
    if (Math.round(prices[0]) != Math.round(defaultMin) || Math.round(prices[1]) != Math.round(defaultMax)) {
        addTag('price-slider-tag', `Price: ₹${Math.round(prices[0])} - ₹${Math.round(prices[1])}`, 'price');
    }
  }

  applyFilters();
}

function applyFilters() {
  const catIds = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
  const subCatIds = Array.from(document.querySelectorAll('.subcategory-checkbox:checked')).map(cb => cb.value);
  const childCatIds = Array.from(document.querySelectorAll('.child-checkbox:checked')).map(cb => cb.value);
  const sizeIds = Array.from(document.querySelectorAll('.size-checkbox:checked')).map(cb => cb.value);
  const brandIds = Array.from(document.querySelectorAll('.brand-checkbox:checked')).map(cb => cb.value);
  const colorIds = Array.from(document.querySelectorAll('.color-item.selected')).map(el => el.getAttribute('data-id'));

  const searchInput = document.getElementById('q');
  const searchText = searchInput ? searchInput.value.trim() : '';

  const searchParams = new URLSearchParams();
  catIds.forEach(id => searchParams.append('categoryIds', id));
  subCatIds.forEach(id => searchParams.append('subCategoryIds', id));
  childCatIds.forEach(id => searchParams.append('childCategoryIds', id));
  brandIds.forEach(id => searchParams.append('brandId', id));
  sizeIds.forEach(id => searchParams.append('sizeIds', id));
  colorIds.forEach(id => searchParams.append('colorIds', id));
  
  const priceSlider = document.getElementById('price-slider');
  if (priceSlider && priceSlider.noUiSlider) {
    const prices = priceSlider.noUiSlider.get();
    if (prices && prices.length === 2) {
      searchParams.append('minPrice', Math.round(prices[0]));
      searchParams.append('maxPrice', Math.round(prices[1]));
    }
  }

  if (searchText) searchParams.append('search', searchText);

  let filterUrl = `${domain}/api/product/filter`;
  const queryString = searchParams.toString();
  if (queryString) {
    filterUrl += `?${queryString}`;
  } else {
    filterUrl = `${domain}/api/product/getproduct`;
  }

  if (typeof window.renderShopGrid === 'function') {
    fetch(filterUrl)
      .then(res => res.json())
      .then(res => {
        let products = Array.isArray(res) ? res : (res.data || []);
        window.renderShopGrid(products);
      })
      .catch(err => console.error(err));
  }
}

// Function to remove a filter tag
window.removeFilter = function(id, type) {
  if (type === 'checkbox') {
    const el = document.getElementById(id);
    if (el) {
      el.checked = false;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } else if (type === 'color') {
    const el = document.querySelector(`.color-item[data-id="${id}"]`);
    if (el) {
      el.classList.remove('selected');
    }
  } else if (type === 'price') {
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider && priceSlider.noUiSlider) {
      priceSlider.noUiSlider.reset();
      const priceText = document.getElementById('filter-price-range');
      if (priceText) {
         priceText.innerText = `₹${Math.round(Array.isArray(priceSlider.noUiSlider.options.range.min) ? priceSlider.noUiSlider.options.range.min[0] : priceSlider.noUiSlider.options.range.min)} - ₹${Math.round(Array.isArray(priceSlider.noUiSlider.options.range.max) ? priceSlider.noUiSlider.options.range.max[0] : priceSlider.noUiSlider.options.range.max)}`;
      }
    }
  }
  updateActiveFilters();
};

// Listen for checkbox changes using event delegation
document.addEventListener('change', function(e) {
  if (e.target.classList.contains('category-checkbox') || 
      e.target.classList.contains('subcategory-checkbox') || 
      e.target.classList.contains('child-checkbox') || 
      e.target.classList.contains('size-checkbox') || 
      e.target.classList.contains('brand-checkbox')) {
    updateActiveFilters();
  }
});

// Handle color clicks and 'Clean All' button
document.addEventListener("click", function (e) {
  const colorItem = e.target.closest('.color-item');
  if (colorItem) {
    e.preventDefault();
    colorItem.classList.toggle("selected");
    updateActiveFilters();
  }

  if (e.target.classList.contains('sidebar-filter-clear')) {
    e.preventDefault();
    // Uncheck all checkboxes
    document.querySelectorAll('.category-checkbox:checked, .subcategory-checkbox:checked, .child-checkbox:checked, .size-checkbox:checked, .brand-checkbox:checked').forEach(cb => {
      cb.checked = false;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    // Hide all sub and child lists to ensure they are closed
    document.querySelectorAll('.subcategory-list, .child-list').forEach(list => {
      list.style.display = 'none';
    });
    // Remove color selection
    document.querySelectorAll('.color-item.selected').forEach(c => c.classList.remove('selected'));
    
    // Reset Price slider
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider && priceSlider.noUiSlider) {
      priceSlider.noUiSlider.reset();
    }

    updateActiveFilters();
  }
});

// Init active filters display on page load
document.addEventListener('DOMContentLoaded', () => {
  updateActiveFilters();

  // Search Form Handler
  const searchInput = document.getElementById('q');
  if (searchInput) {
    const searchForm = searchInput.closest('form');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        applyFilters();
      });
    }
    searchInput.addEventListener('search', function() {
      if (!this.value) applyFilters();
    });

    // Real-time search as user types (with debounce)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        applyFilters();
      }, 400); // 400ms delay to avoid overloading the API
    });
  }

  // Hook Price Slider
  // Small delay to let template main.js initialize the slider
});