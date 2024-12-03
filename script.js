const header = document.getElementById("header")
console.log(header.textContent);

const menuButton = document.getElementsByClassName("menu-item");
console.log(menuButton.length);

const paragraphs = document.getElementsByTagName("p");
console.log(paragraphs[0].textContent);

const handleMenuItemClick = () => {
    console.log("clicked");
}

menuButton.addEventsListener('click', handleMenuItemClick);

// Handles contact form:
const form = document.getElementById('contact-form');
const nameField = document.getElementById('name');
const nameError = document.getElementById('name-error');

const handleSubmission = (e) => {
    const firstNameRegex = /^[\p{L}\p{M}'-]+(?: [\p{L}\p{M}'-]+)*$/u;
    
    if(!firstNameRegex.test(nameField.value)) {
        e.preventDefault();
        nameField.classList.add('error');
        nameError.textContent = 'Invalid characters in name field';
    }
};

form.addEventListener('submit', handleSubmission)
