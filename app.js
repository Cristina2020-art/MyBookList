// Book Class
class Book {
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class
class UI {

    // FUNCTION TO DISPLAY THE BOOKS IN TABLE
    static displayBooks(){
        let books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));

        // console.log(books);
    }

    // FUNCTION TO ADD A BOOK TO THE TABLE
    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    // FUNCTION TO CLEAR FIELDS AFTER ADDING THE BOOK
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    // FUNCTION TO DELETE A BOOK FROM TABLE
    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    // FUNCTION TO SHOW ALERT
    static showAlerts(message,className){
        // CREATE ALERT DIV WITH ALL NECESSARY PROPERTIES
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        // ADD MESSAGE TO THIS DIV
        div.appendChild(document.createTextNode(message));
        // ADD DIV TO DOM
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
}

// STORE CLASS : HANDLES STORAGE
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
          books = [];
        } else {
          books = JSON.parse(localStorage.getItem('books'));
        }
    
        return books;
      }

    static saveBook(book){
        let books;
        books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
          if(book.isbn === isbn) {
            books.splice(index, 1);
          }
        });
    
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// EVENT: DISPLAY BOOKS
document.addEventListener('DOMContentLoaded',UI.displayBooks);

// EVENT: ADD BOOK TO LIST 
document.querySelector('#book-form').addEventListener('submit',(e) => {
    
    // PREVENT DEFAULT
    e.preventDefault();

    // GET VALUES
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if(title === '' || author === '' || isbn === ''){
        UI.showAlerts('Please fill in all details...','danger');
    } else {
        // CREATE BOOK OBJECT
        const book = new Book(title,author,isbn);

        // ADD BOOK TO LIST
        UI.addBookToList(book);

        // SAVE BOOK TO LOCAL STORAGE
        Store.saveBook(book);

        // SHOW SUCCESS MESSAGE
        UI.showAlerts('Book Added','success');

        // CLEAR FIELDS
        UI.clearFields();
    }

});

// EVENT: REMOVE A BOOK
document.querySelector('#book-list').addEventListener('click',(e) => {
    UI.deleteBook(e.target);

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlerts('Book Removed','success');
});