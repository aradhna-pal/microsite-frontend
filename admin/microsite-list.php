<?php include 'include/header.php'; ?>
<!-- main-content -->
<div class="main-content">
  <div class="main-content-inner">
    <div class="main-content-wrap">
      <div class="flex items-center flex-wrap justify-between gap20 mb-27">
        <h3>All Microsite</h3>
        <ul class="breadcrumbs flex items-center flex-wrap justify-start gap10">
          <li><a href="index.php"><div class="text-tiny">Dashboard</div></a></li>
          <li><i class="icon-chevron-right"></i></li>
          <li><div class="text-tiny">Microsite</div></li>
        </ul>
      </div>

      <div class="wg-box">
        <div class="flex items-center justify-between gap10 flex-wrap">
          <div class="wg-filter flex-grow">
            <form class="form-search">
              <fieldset class="name">
                <input id="micrositeSearchInput" type="text" placeholder="Search here..." class="" name="name" tabindex="2" value="">
              </fieldset>
              <div class="button-submit"><button class="" type="submit"><i class="icon-search"></i></button></div>
            </form>
          </div>
          <button id="showMicrositeFormBtn" class="tf-button style-1 w208" type="button"><i class="icon-plus"></i>Add Microsite</button>
        </div>

        <div class="wg-table table-all-attribute" style="overflow-x: auto;">
          <ul class="table-title flex gap20 mb-14" style="white-space: nowrap; min-width: max-content;">
            <li style="flex:0 0 60px;"><div class="body-title">ID</div></li>
            <li style="flex:0 0 90px;"><div class="body-title">Logo</div></li>
            <li style="flex:0 0 170px;"><div class="body-title">Name</div></li>
            <li style="flex:0 0 130px;"><div class="body-title">Slug</div></li>
            <li style="flex:0 0 170px;"><div class="body-title">Domain</div></li>
            <li style="flex:0 0 200px;"><div class="body-title">URL</div></li>
            <li style="flex:0 0 180px;"><div class="body-title">Updated</div></li>
            <li style="flex:0 0 100px;"><div class="body-title">Status</div></li>
            <li style="flex:0 0 70px;"><div class="body-title">Edit</div></li>
            <li style="flex:0 0 70px;"><div class="body-title">Delete</div></li>
          </ul>
          <ul class="flex flex-column" id="micrositeTableBody" style="min-width: max-content;"></ul>
        </div>
      </div>

    </div>
  </div>
</div>
<?php include 'include/footer.php'; ?>
