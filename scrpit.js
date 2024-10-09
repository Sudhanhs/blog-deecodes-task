document.getElementById("blogForm").addEventListener("submit", saveBlog);

function saveBlog(e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const imageInput = document.getElementById("image");
  const description = document.getElementById("description").value;
  const category = document.querySelector('input[name="category"]:checked').value;

  const reader = new FileReader();
  reader.onload = function () {
    const image = reader.result;

    const blog = { title, image, description, category };
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    blogs.push(blog);
    localStorage.setItem("blogs", JSON.stringify(blogs));

    displayBlogs();
  };
  reader.readAsDataURL(imageInput.files[0]);

  document.getElementById("blogForm").reset();
}

function displayBlogs() {
  const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
  const blogTable = document.querySelector("#blogTable tbody");
  blogTable.innerHTML = "";

  blogs.forEach((blog, index) => {
    const row = blogTable.insertRow();
    row.innerHTML = `
      <td>${blog.title}</td>
      <td><img src="${blog.image}" alt="${blog.title}" width="50"></td>
      <td>${blog.description} width="30px"</td>
      <td>${blog.category}</td>
      <td>
    <button style="background-color: blue; color: white;" onclick="editBlog(${index})">Edit</button>
    <button style="background-color: red; color: white;" onclick="deleteBlog(${index})">Delete</button>
</td>
    `;
  });
}

function editBlog(index) {
  const blogs = JSON.parse(localStorage.getItem("blogs"));
  const blog = blogs[index];

  document.getElementById("title").value = blog.title;
  document.getElementById("description").value = blog.description;
  document.querySelector(`input[name="category"][value="${blog.category}"]`).checked = true;

  localStorage.setItem("editIndex", index);
}

function deleteBlog(index) {
  const blogs = JSON.parse(localStorage.getItem("blogs"));
  blogs.splice(index, 1);
  localStorage.setItem("blogs", JSON.stringify(blogs));

  displayBlogs();
}

window.onload = displayBlogs;




// Initialize Quill
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      ['link', 'image', 'clean']
    ]
  }
});


// Modal-related functions
const showModal = (title, content) => {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  modalTitle.innerHTML = title;
  modalContent.innerHTML = content;

  modal.style.display = 'block';
};

// Close modal when "X" is clicked
const closeModal = () => {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
};

// Close modal when clicking outside of modal content
window.onclick = (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = 'none';     // Hide modal
  }
};

// Close modal when "X" button is clicked
const closeButton = document.getElementById('closeModal');
if (closeButton) {
  closeButton.addEventListener('click', closeModal);
};