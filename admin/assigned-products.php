<?php include 'include/header.php'; ?>
<div class="main-content">
  <div class="main-content-inner">
    <div class="main-content-wrap">
      <h3 class="mb-20">Assigned Products (CRUD)</h3>
      <div class="wg-box mb-20">
        <form id="assignProductForm" class="form-new-product">
          <input type="hidden" id="assignId">
          <fieldset class="name mb-12">
            <div class="body-title mb-10">Microsite</div>
            <div class="select">
              <select id="assignMicrositeId" required>
                <option value="">Select Microsite</option>
              </select>
            </div>
          </fieldset>
          <fieldset class="name mb-12">
            <div class="body-title mb-10">Product</div>
            <div class="select">
              <select id="assignProductId" required>
                <option value="">Select Product</option>
              </select>
            </div>
          </fieldset>
          <fieldset class="name mb-12">
            <div class="body-title mb-10">Status</div>
            <select id="assignStatus">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </fieldset>
          <button class="tf-button" type="submit">Save Assignment</button>
        </form>
      </div>

      <div class="wg-box">
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Microsite</th><th>Product</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody id="assignedProductTableBody"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<?php include 'include/footer.php'; ?>
