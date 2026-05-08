document.addEventListener("DOMContentLoaded", () => {
  const enquiryForm = document.getElementById("addenquiry");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form values
      const fullName = document.getElementById("cname").value.trim();
      const email = document.getElementById("cemail").value.trim();
      const phone = document.getElementById("cphone").value.trim();
      const subject = document.getElementById("csubject").value.trim();
      const message = document.getElementById("cmessage").value.trim();

      // Basic validation for required fields
      if (!fullName || !email || !message) {
        iziToast.warning({
          title: "Required",
          message: "Please fill in all required fields (*)",
          position: "topRight",
        });
        return;
      }

      // Create FormData and map to the keys you specified
      const formData = new FormData();
      formData.append("FullName", fullName);
      formData.append("Email", email);
      formData.append("PhoneNumber", phone);
      formData.append("Subject", subject);
      formData.append("Message", message);

      const btnSubmit = enquiryForm.querySelector('button[type="submit"]');
      const originalBtnText = btnSubmit.innerHTML;
      btnSubmit.innerHTML = '<span>SENDING...</span>';
      btnSubmit.disabled = true;

      try {
        // Assumed API endpoint, please change if it's different
        const res = await fetch(`${domain}/api/contacts/addcontact`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.status !== false) {
          iziToast.success({
            title: "Success",
            message: data.message || "Your enquiry has been submitted!",
            position: "topRight",
          });
          enquiryForm.reset(); // Clear the form after successful submission
        } else {
          iziToast.error({
            title: "Error",
            message: data.message || "Failed to submit enquiry.",
            position: "topRight",
          });
        }
      } catch (error) {
        console.error("Enquiry Submit Error:", error);
        iziToast.error({
          title: "Server Error",
          message: "Something went wrong. Please try again later.",
          position: "topRight",
        });
      } finally {
        // Re-enable the button
        btnSubmit.innerHTML = originalBtnText;
        btnSubmit.disabled = false;
      }
    });
  }
});