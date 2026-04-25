<!DOCTYPE html>
<!--[if IE 8 ]><html class="ie" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-US" lang="en-US"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!-->
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-US" lang="en-US">
<!--<![endif]-->


<!-- Mirrored from themesflat.co/html/remos/ by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 21 Apr 2026 11:54:42 GMT -->
<head>
    <!-- Basic Page Needs -->
    <meta charset="utf-8">
    <!--[if IE]><meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'><![endif]-->
    <title>Remos eCommerce Admin Dashboard HTML Template</title>

    <meta name="author" content="themesflat.com">

    <!-- Mobile Specific Metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- Theme Style -->
    <link rel="stylesheet" type="text/css" href="css/animate.min.css">
    <link rel="stylesheet" type="text/css" href="css/animation.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-select.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">



    <!-- Font -->
    <link rel="stylesheet" href="font/fonts.css">

    <!-- Icon -->
    <link rel="stylesheet" href="icon/style.css">

    <!-- Favicon and Touch Icons  -->
    <link rel="shortcut icon" href="images/favicon.png">
    <link rel="apple-touch-icon-precomposed" href="images/favicon.png">

    <!-- toster -->
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/izitoast/dist/css/iziToast.min.css">
<script src="https://cdn.jsdelivr.net/npm/izitoast/dist/js/iziToast.min.js"></script>

    <!-- scripts file  -->
    <script src="./adminApi/auth.js"></script>
    <script src="./adminApi/domin.js"></script>
    <script src="./adminApi/login.js"></script>
    <script src="./adminApi/category.js"></script>
    <script src="./adminApi/color.js"></script>
    <script src="./adminApi/size.js"></script>
    <script src="./adminApi/brand.js"></script>
    <script src="./adminApi/user.js"></script>


</head>

<body class="body">

    <!-- #wrapper -->
    <div id="wrapper">
        <!-- #page -->
        <div id="page" class="">
            <!-- layout-wrap -->
           <div class="layout-wrap">
                <!-- preload -->
                <div id="preload" class="preload-container">
                    <div class="preloading">
                        <span></span>
                    </div>
                </div>
                <!-- /preload -->
                <!-- section-menu-left -->
                <div class="section-menu-left">
                    <div class="box-logo">
                        <a href="index.php" id="site-logo-inner">
                            <img class="" id="logo_header" alt="" src="images/logo/logo.png" data-light="images/logo/logo.png" data-dark="images/logo/logo-dark.png" >
                        </a>
                        <div class="button-show-hide">
                            <i class="icon-menu-left"></i>
                        </div>
                    </div>
                    <div class="section-menu-left-wrap">
                        <div class="center">
                            <div class="center-item">
                                <ul class="menu-list">
                                    <li class="menu-item  active">
                                        <a href="index.php" class="menu-item-button">
                                            <div class="icon"><i class="icon-grid"></i></div>
                                            <div class="text">Dashboard</div>
                                        </a>
                                        <!-- <ul class="sub-menu" style="display: block;">
                                            <li class="sub-menu-item">
                                                <a href="index.php" class="active">
                                                    <div class="text">Home 01</div>
                                                </a>
                                            </li>
                                           
                                           
                                        </ul> -->
                                    </li>
                                </ul>
                            </div>
                            <div class="center-item">
                                <div class="center-heading">All page</div>
                                <ul class="menu-list">
                                    <li class="menu-item has-children">
                                        <a href="javascript:void(0);" class="menu-item-button">
                                            <div class="icon"><i class="icon-shopping-cart"></i></div>
                                            <div class="text">Ecommerce</div>
                                        </a>
                                        <ul class="sub-menu">
                                            <li class="sub-menu-item">
                                                <a href="add-product.php" class="">
                                                    <div class="text">Add Product</div>
                                                </a>
                                            </li>
                                            <li class="sub-menu-item">
                                                <a href="product-list.php" class="">
                                                    <div class="text">Product List</div>
                                                </a>
                                            </li>
                                           
                                        </ul>
                                    </li>
                                    <li class="menu-item has-children">
                                        <a href="javascript:void(0);" class="menu-item-button">
                                            <div class="icon"><i class="icon-layers"></i></div>
                                            <div class="text">Category</div>
                                        </a>
                                        <ul class="sub-menu">
                                            <li class="sub-menu-item">
                                                <a href="category-list.php" class="">
                                                    <div class="text">Category</div>
                                                </a>
                                            </li>
                                            <li class="sub-menu-item">
                                                <a href="sub-category-list.php" class="">
                                                    <div class="text">Sub Category</div>
                                                </a>
                                            </li>
                                            <li class="sub-menu-item">
                                                <a href="child-category-list.php" class="">
                                                    <div class="text">Child Category</div>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                     <li class="menu-item has-children">
                                        <a href="javascript:void(0);" class="menu-item-button">
                                            <div class="icon"><i class="icon-layers"></i></div>
                                            <div class="text">Size</div>
                                        </a>
                                        <ul class="sub-menu">
                                            <li class="sub-menu-item">
                                                <a href="size-list.php" class="">
                                                    <div class="text">Size list</div>
                                                </a>
                                            </li>
                                           
                                        </ul>
                                    </li>
                                     <li class="menu-item has-children">
                                        <a href="javascript:void(0);" class="menu-item-button">
                                            <div class="icon"><i class="icon-layers"></i></div>
                                            <div class="text">Color</div>
                                        </a>
                                        <ul class="sub-menu">
                                            <li class="sub-menu-item">
                                                <a href="color-list.php" class="">
                                                    <div class="text">Color list</div>
                                                </a>
                                            </li>
                                           
                                        </ul>
                                    </li>
                                     <li class="menu-item has-children">
                                        <a href="javascript:void(0);" class="menu-item-button">
                                            <div class="icon"><i class="icon-layers"></i></div>
                                            <div class="text">Brand</div>
                                        </a>
                                        <ul class="sub-menu">
                                            <li class="sub-menu-item">
                                                <a href="brand-list.php" class="">
                                                    <div class="text">Brand list</div>
                                                </a>
                                            </li>
                                           
                                        </ul>
                                    </li>
                                   
                                    <li class="menu-item has-children">
                                        <a href="javascript:void(0);" class="menu-item-button">
                                            <div class="icon"><i class="icon-file-plus"></i></div>
                                            <div class="text">Order</div>
                                        </a>
                                        <ul class="sub-menu">
                                            <li class="sub-menu-item">
                                                <a href="oder-list.php" class="">
                                                    <div class="text">Order list</div>
                                                </a>
                                            </li>
                                            <li class="sub-menu-item">
                                                <a href="oder-detail.php" class="">
                                                    <div class="text">Order detail</div>
                                                </a>
                                            </li>
                                            <li class="sub-menu-item">
                                                <a href="oder-tracking.php" class="">
                                                    <div class="text">Order tracking</div>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="menu-item has-children">
                                        <a href="javascript:void(0);" class="menu-item-button">
                                            <div class="icon"><i class="icon-user"></i></div>
                                            <div class="text">User</div>
                                        </a>
                                        <ul class="sub-menu">
                                            <li class="sub-menu-item">
                                                <a href="all-user.php" class="">
                                                    <div class="text">All user</div>
                                                </a>
                                            </li>
                                            
                                           
                                            <li class="sub-menu-item">
                                                <a href="sign-up.php" class="">
                                                    <div class="text">Admin Sign up</div>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="menu-item has-children">
                                        <a href="javascript:void(0);" class="menu-item-button">
                                            <div class="icon"><i class="icon-user-plus"></i></div>
                                            <div class="text">Roles</div>
                                        </a>
                                        <ul class="sub-menu">
                                            <li class="sub-menu-item">
                                                <a href="all-roles.php" class="">
                                                    <div class="text">All roles</div>
                                                </a>
                                            </li>
                                            <li class="sub-menu-item">
                                                <a href="create-role.php" class="">
                                                    <div class="text">Create role</div>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                 
                                    <li class="menu-item">
                                        <a href="report.php" class="">
                                            <div class="icon"><i class="icon-pie-chart"></i></div>
                                            <div class="text">Report</div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="center-item">
                                <div class="center-heading">Setting</div>
                                <ul class="menu-list">
                                  
                                    <li class="menu-item">
                                        <a href="setting.php" class="">
                                            <div class="icon"><i class="icon-settings"></i></div>
                                            <div class="text">Setting</div>
                                        </a>
                                    </li>
                                    <li class="menu-item has-children">
                                        <a href="javascript:void(0);" class="menu-item-button">
                                            <div class="icon"><i class="icon-edit"></i></div>
                                            <div class="text">Pages</div>
                                        </a>
                                        <ul class="sub-menu">
                                            <li class="sub-menu-item">
                                                <a href="list-page.php" class="">
                                                    <div class="text">List page</div>
                                                </a>
                                            </li>
                                            <li class="sub-menu-item">
                                                <a href="new-page.php" class="">
                                                    <div class="text">New page</div>
                                                </a>
                                            </li>
                                            <li class="sub-menu-item">
                                                <a href="edit-page.php" class="">
                                                    <div class="text">Edit page</div>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                         
                          
                            
                            <div class="center-item">
                                <div class="center-heading">Connect us</div>
                                <ul class="wg-social">
                                    <li>
                                        <a href="#"><i class="icon-facebook"></i></a>
                                    </li>
                                    <li class="active">
                                        <a href="#"><i class="icon-twitter"></i></a>
                                    </li>
                                    <li>
                                        <a href="#"><i class="icon-linkedin"></i></a>
                                    </li>
                                    <li>
                                        <a href="#"><i class="icon-instagram"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="bot text-center">
                            <div class="wrap">
                                <div class="mb-20">
                                    <img src="images/menu-left/img-bot.png" alt="">
                                </div>
                                <div class="mb-20">
                                    <h6>Hi, how can we help?</h6>
                                    <div class="text">Contact us if you have any assistance, we will contact you as soon as possible</div>
                                </div>
                                <a href="#" class="tf-button w-full">Contact</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /section-menu-left -->
                <!-- section-content-right -->
                <div class="section-content-right">
                    <!-- header-dashboard -->
                    <div class="header-dashboard">
                        <div class="wrap">
                            <div class="header-left">
                                <a href="index-2.php">
                                    <img class="" id="logo_header_mobile" alt="" src="images/logo/logo.png" data-light="images/logo/logo.png" data-dark="images/logo/logo-dark.png" data-width="154px" data-height="52px" data-retina="images/logo/logo@2x.png">
                                </a>
                                <div class="button-show-hide">
                                    <i class="icon-menu-left"></i>
                                </div>
                                <form class="form-search flex-grow">
                                    <fieldset class="name">
                                        <input type="text" placeholder="Search here..." class="show-search" name="name" tabindex="2" value="" aria-required="true" required="">
                                    </fieldset>
                                    <div class="button-submit">
                                        <button class="" type="submit"><i class="icon-search"></i></button>
                                    </div>
                                   
                                </form>
                            </div>
                            <div class="header-grid">
                               
                                <div class="header-item button-dark-light">
                                    <i class="icon-moon"></i>
                                </div>
                              
                                <div class="header-item button-zoom-maximize">
                                    <div class="">
                                        <i class="icon-maximize"></i>
                                    </div>
                                </div>
                                <div class="popup-wrap apps type-header">
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton4" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span class="header-item">
                                                <i class="icon-grid"></i>
                                            </span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end has-content" aria-labelledby="dropdownMenuButton4" >
                                            <li>
                                                <h6>Related apps</h6>
                                            </li>
                                            <li>
                                                <ul class="list-apps">
                                                    <li class="item">
                                                        <div class="image">
                                                            <img src="images/apps/item-1.png" alt="">
                                                        </div>
                                                        <a href="#">
                                                            <div class="text-tiny">Photoshop</div>
                                                        </a>
                                                    </li>
                                                    <li class="item">
                                                        <div class="image">
                                                            <img src="images/apps/item-2.png" alt="">
                                                        </div>
                                                        <a href="#">
                                                            <div class="text-tiny">illustrator</div>
                                                        </a>
                                                    </li>
                                                    <li class="item">
                                                        <div class="image">
                                                            <img src="images/apps/item-3.png" alt="">
                                                        </div>
                                                        <a href="#">
                                                            <div class="text-tiny">Sheets</div>
                                                        </a>
                                                    </li>
                                                    <li class="item">
                                                        <div class="image">
                                                            <img src="images/apps/item-4.png" alt="">
                                                        </div>
                                                        <a href="#">
                                                            <div class="text-tiny">Gmail</div>
                                                        </a>
                                                    </li>
                                                    <li class="item">
                                                        <div class="image">
                                                            <img src="images/apps/item-5.png" alt="">
                                                        </div>
                                                        <a href="#">
                                                            <div class="text-tiny">Messenger</div>
                                                        </a>
                                                    </li>
                                                    <li class="item">
                                                        <div class="image">
                                                            <img src="images/apps/item-6.png" alt="">
                                                        </div>
                                                        <a href="#">
                                                            <div class="text-tiny">Youtube</div>
                                                        </a>
                                                    </li>
                                                    <li class="item">
                                                        <div class="image">
                                                            <img src="images/apps/item-7.png" alt="">
                                                        </div>
                                                        <a href="#">
                                                            <div class="text-tiny">Flaticon</div>
                                                        </a>
                                                    </li>
                                                    <li class="item">
                                                        <div class="image">
                                                            <img src="images/apps/item-8.png" alt="">
                                                        </div>
                                                        <a href="#">
                                                            <div class="text-tiny">Instagram</div>
                                                        </a>
                                                    </li>
                                                    <li class="item">
                                                        <div class="image">
                                                            <img src="images/apps/item-9.png" alt="">
                                                        </div>
                                                        <a href="#">
                                                            <div class="text-tiny">PDF</div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li><a href="#" class="tf-button w-full">View all app</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="popup-wrap user type-header">
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span class="header-user wg-user">
                                                <span class="image">
                                                    <img src="images/avatar/user-1.png" alt="">
                                                </span>
                                                <span class="flex flex-column">
                                                    <span class="body-title mb-2">Kristin Watson</span>
                                                    <span class="text-tiny">Admin</span>
                                                </span>
                                            </span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end has-content" aria-labelledby="dropdownMenuButton3" >
                                            <li>
                                                <a href="#" class="user-item">
                                                    <div class="icon">
                                                        <i class="icon-user"></i>
                                                    </div>
                                                    <div class="body-title-2">Account</div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" class="user-item">
                                                    <div class="icon">
                                                        <i class="icon-mail"></i>
                                                    </div>
                                                    <div class="body-title-2">Inbox</div>
                                                    <div class="number">27</div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" class="user-item">
                                                    <div class="icon">
                                                        <i class="icon-file-text"></i>
                                                    </div>
                                                    <div class="body-title-2">Taskboard</div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="setting.php" class="user-item">
                                                    <div class="icon">
                                                        <i class="icon-settings"></i>
                                                    </div>
                                                    <div class="body-title-2">Setting</div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" class="user-item">
                                                    <div class="icon">
                                                        <i class="icon-headphones"></i>
                                                    </div>
                                                    <div class="body-title-2">Support</div>
                                                </a>
                                            </li>
                                            <li>
                                                <div  style="cursor: pointer;" class="user-item">
                                                    <div class="icon">
                                                        <i class="icon-log-out"></i>
                                                    </div>
                                                    <div id="logout-btn" class="body-title-2">Log out</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    