<?php include 'header.php'; ?>

<main class="main">
	<div class="page-header text-center" style="background-image: url('assets/images/page-header-bg.jpg')">
		<div class="container">
			<h1 class="page-title">Contact <span></span></h1>
		</div><!-- End .container -->
	</div><!-- End .page-header -->
	<nav aria-label="breadcrumb" class="breadcrumb-nav border-0 mb-0">
		<div class="container">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="index.html">Home</a></li>
				<li class="breadcrumb-item active" aria-current="page">Contact </li>
			</ol>
		</div><!-- End .container -->
	</nav><!-- End .breadcrumb-nav -->

	<div class="page-content">
		<div class="map-wrap mb-4">
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.981969685582!2d77.37806287613411!3d28.51019018962474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce937dd33a677%3A0xf2482b431fe4c606!2sATS%20Bouquet!5e0!3m2!1sen!2sin!4v1777543057123!5m2!1sen!2sin"
				allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">
			</iframe>
		</div>
		<style>
			.map-wrap {
				width: 100%;
			}

			.map-wrap iframe {
				width: 100%;
				height: 450px;
				/* change if needed */
				border: 0;
				display: block;
			}
		</style>
		<div class="container">
			<div class="row">
				<div class="col-md-4">
					<div class="contact-box text-center">
						<h3>Office</h3>

						<address>1 New York Plaza, New York, <br>NY 10004, USA</address>
					</div><!-- End .contact-box -->
				</div><!-- End .col-md-4 -->

				<div class="col-md-4">
					<div class="contact-box text-center">
						<h3>Start a Conversation</h3>

						<div><a href="https://portotheme.com/cdn-cgi/l/email-protection#eecd"><span class="__cf_email__"
									data-cfemail="2d44434b426d604241414c034e4240">[email&#160;protected]</span></a>
						</div>
						<div><a href="tel:#">+1 987-876-6543</a>, <a href="tel:#">+1 987-976-1234</a></div>
					</div><!-- End .contact-box -->
				</div><!-- End .col-md-4 -->

				<div class="col-md-4">
					<div class="contact-box text-center">
						<h3>Social</h3>

						<div class="social-icons social-icons-color justify-content-center">
							<a href="#" class="social-icon social-facebook" title="Facebook" target="_blank"><i
									class="icon-facebook-f"></i></a>
							<a href="#" class="social-icon social-twitter" title="Twitter" target="_blank"><i
									class="icon-twitter"></i></a>
							<a href="#" class="social-icon social-instagram" title="Instagram" target="_blank"><i
									class="icon-instagram"></i></a>
							<a href="#" class="social-icon social-youtube" title="Youtube" target="_blank"><i
									class="icon-youtube"></i></a>
							<a href="#" class="social-icon social-pinterest" title="Pinterest" target="_blank"><i
									class="icon-pinterest"></i></a>
						</div><!-- End .soial-icons -->
					</div><!-- End .contact-box -->
				</div><!-- End .col-md-4 -->
			</div><!-- End .row -->

			<hr class="mt-3 mb-5 mt-md-1">
			<div class="touch-container row justify-content-center">
				<div class="col-md-9 col-lg-7">
					<div class="text-center">
						<h2 class="title mb-1">Get In Touch</h2><!-- End .title mb-2 -->
						<p class="lead text-primary">
							We collaborate with ambitious brands and people; we’d love to build something great
							together.
						</p><!-- End .lead text-primary -->
						<p class="mb-3">Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu
							pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, fermentum et, dapibus
							sed, urna.</p>
					</div><!-- End .text-center -->

					<form action="#" id="addenquiry" class="contact-form mb-2">
						<div class="row">
							<div class="col-sm-4">
								<label for="cname" class="sr-only">Name</label>
								<input type="text" class="form-control" id="cname" placeholder="Name *" required>
							</div><!-- End .col-sm-4 -->

							<div class="col-sm-4">
								<label for="cemail" class="sr-only">Name</label>
								<input type="email" class="form-control" id="cemail" placeholder="Email *" required>
							</div><!-- End .col-sm-4 -->

							<div class="col-sm-4">
								<label for="cphone" class="sr-only">Phone</label>
								<input type="tel" class="form-control" id="cphone" placeholder="Phone">
							</div><!-- End .col-sm-4 -->
						</div><!-- End .row -->

						<label for="csubject" class="sr-only">Subject</label>
						<input type="text" class="form-control" id="csubject" placeholder="Subject">

						<label for="cmessage" class="sr-only">Message</label>
						<textarea class="form-control" cols="30" rows="4" id="cmessage" required
							placeholder="Message *"></textarea>

						<div class="text-center">
							<button type="submit" class="btn btn-outline-primary-2 btn-minwidth-sm">
								<span>SUBMIT</span>
								<i class="icon-long-arrow-right"></i>
							</button>
						</div><!-- End .text-center -->
					</form>
				</div><!-- End .col-md-9 col-lg-7 -->
			</div><!-- End .row -->
		</div><!-- End .container -->
	</div><!-- End .page-content -->
</main><!-- End .main -->


<?php include 'footer.php'; ?>