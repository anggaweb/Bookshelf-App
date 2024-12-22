document.addEventListener('DOMContentLoaded', function () {
  // Menangani form tambah buku
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  // Menangani form pencarian buku
  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBooks();
  });

  // Menangani aksi tombol 'Selesai dibaca' dan 'Hapus Buku'
  document.getElementById('incompleteBookList').addEventListener('click', handleBookActions);
  document.getElementById('completeBookList').addEventListener('click', handleBookActions);

  // Tampilkan buku saat halaman pertama kali dimuat
  displayBooks();
});

function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  // Validasi input
  if (!title || !author || !year) {
    alert('Semua kolom harus diisi!');
    return;
  }

  const newBook = {
    id: Date.now().toString(),  // Unik ID untuk buku
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  // Ambil buku yang sudah ada di localStorage, atau buat array baru jika kosong
  let books = JSON.parse(localStorage.getItem('books')) || [];

  // Tambahkan buku baru ke array
  books.push(newBook);

  // Simpan kembali ke localStorage
  localStorage.setItem('books', JSON.stringify(books));

  // Reset form input
  document.getElementById('bookForm').reset();

  // Tampilkan buku terbaru
  displayBooks();
}

function searchBooks() {
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();

  let books = JSON.parse(localStorage.getItem('books')) || [];
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));

  displayBooks(filteredBooks);
}

function handleBookActions(event) {
  const button = event.target;

  if (button.dataset.testid === 'bookItemIsCompleteButton') {
    markAsComplete(button.closest('[data-bookid]'));
  }

  if (button.dataset.testid === 'bookItemDeleteButton') {
    deleteBook(button.closest('[data-bookid]'));
  }

  if (button.dataset.testid === 'bookItemEditButton') {
    editBook(button.closest('[data-bookid]'));
  }
}

function markAsComplete(bookElement) {
  const bookId = bookElement.getAttribute('data-bookid');
  let books = JSON.parse(localStorage.getItem('books')) || [];

  const book = books.find(b => b.id === bookId);
  if (book) {
    book.isComplete = true;
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();  // Update tampilan
  }
}

function deleteBook(bookElement) {
  const bookId = bookElement.getAttribute('data-bookid');
  let books = JSON.parse(localStorage.getItem('books')) || [];

  books = books.filter(b => b.id !== bookId);
  localStorage.setItem('books', JSON.stringify(books));
  displayBooks();  // Update tampilan
}

function editBook(bookElement) {
  const bookId = bookElement.getAttribute('data-bookid');
  let books = JSON.parse(localStorage.getItem('books')) || [];

  const book = books.find(b => b.id === bookId);
  if (book) {
    document.getElementById('editBookForm').style.display = 'block';
    document.getElementById('editBookFormTitle').value = book.title;
    document.getElementById('editBookFormAuthor').value = book.author;
    document.getElementById('editBookFormYear').value = book.year;
    document.getElementById('editBookFormIsComplete').checked = book.isComplete;

    document.getElementById('editBookForm').onsubmit = function (event) {
      event.preventDefault();
      book.title = document.getElementById('editBookFormTitle').value;
      book.author = document.getElementById('editBookFormAuthor').value;
      book.year = document.getElementById('editBookFormYear').value;
      book.isComplete = document.getElementById('editBookFormIsComplete').checked;

      localStorage.setItem('books', JSON.stringify(books));
      displayBooks();
      document.getElementById('editBookForm').style.display = 'none';
    };

    document.getElementById('cancelEdit').onclick = function () {
      document.getElementById('editBookForm').style.display = 'none';
    };
  }
}

function displayBooks(filteredBooks = null) {
  const books = filteredBooks || JSON.parse(localStorage.getItem('books')) || [];
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books.forEach(book => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

function createBookElement(book) {
  const bookElement = document.createElement('div');
  bookElement.setAttribute('data-bookid', book.id);
  bookElement.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.textContent = book.title;
  title.setAttribute('data-testid', 'bookItemTitle');

  const author = document.createElement('p');
  author.textContent = `Penulis: ${book.author}`;
  author.setAttribute('data-testid', 'bookItemAuthor');

  const year = document.createElement('p');
  year.textContent = `Tahun: ${book.year}`;
  year.setAttribute('data-testid', 'bookItemYear');

  const buttonContainer = document.createElement('div');

  const completeButton = document.createElement('button');
  completeButton.textContent = 'Selesai dibaca';
  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit Buku';
  editButton.setAttribute('data-testid', 'bookItemEditButton');

  buttonContainer.appendChild(completeButton);
  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(editButton);

  bookElement.appendChild(title);
  bookElement.appendChild(author);
  bookElement.appendChild(year);
  bookElement.appendChild(buttonContainer);

  return bookElement;
}
