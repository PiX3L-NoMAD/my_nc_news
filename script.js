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