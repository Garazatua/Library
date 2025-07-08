// dialog
const closeBtn = document.querySelector("#close-modal");
const showBtn = document.querySelector("#show-modal");
const dialog = document.querySelector("#mydialog");
closeBtn.addEventListener("click", () => {
  dialog.close();
});

showBtn.addEventListener("click", () => {
  dialog.showModal();
});

//logic
const container = document.querySelector(".cards-container");
const myLibrary = [];

class Book {
  id = crypto.randomUUID();
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.alreadyRead = read;
  }
}

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
}

function renderLibrary() {
  container.innerHTML = "";
  for (book of myLibrary) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", book.id);
    let title = document.createElement("h2");
    title.textContent = book.title;
    card.appendChild(title);
    let author = document.createElement("p");
    author.textContent = "Author: " + book.author;
    card.appendChild(author);
    let pages = document.createElement("p");
    pages.textContent = "Number of Pages: " + book.pages;
    card.appendChild(pages);
    let read = document.createElement("p");
    read.textContent = book.alreadyRead ? "Already read" : "Not read yet";
    card.appendChild(read);
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      const id = card.dataset.id;
      const index = myLibrary.findIndex((book) => book.id === id);
      myLibrary.splice(index, 1);
      renderLibrary();
    });

    card.appendChild(deleteButton);
    let changeReadStatus = document.createElement("button");
    changeReadStatus.textContent = book.alreadyRead
      ? "Mark as Unread"
      : "Mark as Read";
    changeReadStatus.addEventListener("click", () => {
      const id = card.dataset.id;
      const book = myLibrary.find((book) => book.id === id);
      book.alreadyRead = !book.alreadyRead;
      renderLibrary();
    });
    card.appendChild(changeReadStatus);

    container.appendChild(card);
  }
}

const form = document.querySelector("#new-book-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const pagesInput = document.querySelector("#pages");
const inputs = [titleInput, authorInput, pagesInput];
const formContainer = document.querySelector("#form-container");
const yesLabel = document.querySelector("#yes-label");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  removeAllErrors();
  let isValid = true;
  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      const errorSpan = document.createElement("span");
      errorSpan.classList.add("error-message");
      errorSpan.textContent = "This field is required";
      formContainer.insertBefore(errorSpan, input);
      isValid = false;
    }
  });
  const readRadios = document.querySelectorAll('input[name="read"]');
  const isReadSelected = [...readRadios].some((radio) => radio.checked);
  if (!isReadSelected) {
    const errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");
    errorSpan.textContent = "This field is required";
    formContainer.insertBefore(errorSpan, yesLabel);
    isValid = false;
  }
  if (!isValid) return;
  const read = form.read.value === "true";
  addBookToLibrary(form.title.value, form.author.value, form.pages.value, read);
  renderLibrary();
  dialog.close();
  form.reset();
});

function removeAllErrors() {
  const existingErrors = document.querySelectorAll(".error-message");
  existingErrors.forEach((span) => span.remove());
}
