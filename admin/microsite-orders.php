<?php include 'include/header.php'; ?>
<div class="main-content">
  <div class="main-content-inner">
    <div class="main-content-wrap">
      <h3 class="mb-20">Microsites Order (CRUD)</h3>
      <div class="wg-box mb-20">
        <form id="micrositeOrderFilterForm" class="form-new-product">
          <fieldset class="name mb-12">
            <div class="body-title mb-10">Microsite ID</div>
            <input id="orderMicrositeId" type="number" required>
          </fieldset>
          <button class="tf-button" type="submit">Load Orders</button>
        </form>
      </div>

      <div class="wg-box">
        <table class="table">
          <thead>
            <tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody id="micrositeOrdersTableBody"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<?php include 'include/footer.php'; ?>
