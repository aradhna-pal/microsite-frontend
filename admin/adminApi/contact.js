
// const domain = "http://microsite_backend.workarya.com";

// ✅ LOAD CONTACTS
async function loadContacts() {
    try {
        const res = await fetch(`${domin}/api/contacts/getcontact`);
        const result = await res.json();

        const tbody = document.getElementById('contactTableBody');
        tbody.innerHTML = '';

        if (!result.status || !result.data.length) {
            tbody.innerHTML = `
                <li class="attribute-item">
                    <div class="body-text">No contacts found</div>
                </li>`;
            return;
        }

        result.data.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'attribute-item flex items-center justify-between gap20';

            li.innerHTML = `
                <div class="body-text" style="flex:0 0 60px;">${index + 1}</div>
                <div class="body-text">${item.name}</div>
                <div class="body-text">${item.email}</div>
                <div class="body-text">${item.subject}</div>
                <div class="body-text">${item.message}</div>
                <div class="body-text">${item.phone}</div>
                <div class="body-text">${new Date(item.createdat).toLocaleDateString()}</div>

              

                <div class="list-icon-function">
                    <div class="item text-danger" onclick="deleteContact(${item.id})">
                        <i class="icon-trash-2"></i>
                    </div>
                </div>
            `;

            tbody.appendChild(li);
        });

    } catch (err) {
        console.error('Error loading contacts:', err);
    }
}

// ✅ DELETE CONTACT
function deleteContact(id) {
    iziToast.question({
        timeout: false,
        overlay: true,
        displayMode: 'once',
        title: 'Confirm',
        message: 'Delete this contact?',
        position: 'center',
        buttons: [
            ['<button><b>Yes</b></button>', async function (instance, toast) {

                try {
                    const res = await fetch(`${domin}/api/contacts/deletecontact/${id}`, {
                        method: 'DELETE'
                    });

                    if (res.ok) {
                        iziToast.success({
                            title: 'Deleted',
                            message: 'Contact deleted successfully'
                        });

                        loadContacts(); // ✅ direct recall, no timeout needed
                    } else {
                        iziToast.error({
                            title: 'Error',
                            message: 'Delete failed'
                        });
                    }

                } catch (err) {
                    iziToast.error({
                        title: 'Error',
                        message: 'Server error'
                    });
                }

                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

            }, true],
            ['<button>No</button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            }]
        ]
    });
}

function editContact(id) {
    console.log('Edit contact:', id);
}

document.addEventListener('DOMContentLoaded', loadContacts);
