document.addEventListener('DOMContentLoaded', () => {

  // Initialize Quill
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'], 
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }], 
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }], 
        [{ 'indent': '-1'}, { 'indent': '+1' }], 
        [{ 'size': ['small', false, 'large', 'huge'] }], 
        [{ 'color': [] }, { 'background': [] }], 
        [{ 'font': [] }],
        ['link', 'image', 'clean'] 
      ]
    }
  });

  // For saving a new blog post
  const blogForm = document.getElementById('blogForm');
  let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || []; 

  if (blogForm) {
    blogForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const title = document.getElementById('title').value;
      const image = document.getElementById('image').files[0];
      const description = document.getElementById('description').value;
      const content = quill.root.innerHTML; 

      // Validate title
      if (title.length > 10) {
        alert('Title can only be a maximum of 10 characters.');
        return;
      }

      // Validate image size
      if (image && image.size > 1 * 1024 * 1024) {
        alert('Image file size must be less than 1 MB.');
        return;
      }

      // Validate description length
      if (description.length > 300) {
        alert('Description can only be a maximum of 300 characters.');
        return;
      }

      // Use FileReader to read the image as DataURL
      const reader = new FileReader();
      reader.onload = function (e) {
        const photoData = e.target.result;

        const blogPost = {
          title: title,
          description: description,
          content: content, 
          image: photoData
        };

        blogPosts.push(blogPost);
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

        alert('Blog post saved!');
        blogForm.reset();
        quill.setContents([]); 
        displayBlogs(blogPosts); 
      };

      if (image) {
        reader.readAsDataURL(image); 
      }
    });
  }

  // For displaying blog posts on the cards page
  const blogCards = document.getElementById('blogCards');
  if (blogCards) {
    const displayBlogs = (posts) => {
      blogCards.innerHTML = '';
      posts.forEach((post) => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <img src="${post.image}" alt="${post.title}">
          <h3>${post.title}</h3>
          <p>${post.description}</p>
        `;

        // Render the content as HTML
        const viewbtn = document.createElement('button');
        viewbtn.innerHTML = 'View';
        card.appendChild(viewbtn);

        // Open modal when View button is clicked
        viewbtn.addEventListener('click', () => {
          showModal(post.title, post.content); 
        });

        blogCards.appendChild(card);
      });
    };

    // Initial display of all blogs
    displayBlogs(blogPosts);

    // Function to filter blogs
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredPosts = blogPosts.filter((post) => {
          return (
            post.title.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query)
          );
        });
        displayBlogs(filteredPosts); 
      });
    }
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