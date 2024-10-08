document.addEventListener('DOMContentLoaded', () => {

  // Initialize Quill
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'], // toggled buttons
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }], // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }], // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }], // outdent/indent
        [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ 'color': [] }, { 'background': [] }], // dropdown with defaults
        [{ 'font': [] }],
        ['link', 'image', 'clean'] // remove formatting button
      ]
    }
  });

  // For saving a new blog post
  const blogForm = document.getElementById('blogForm');
  let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || []; // Initialize blogPosts globally

  if (blogForm) {
    blogForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const title = document.getElementById('title').value;
      const image = document.getElementById('image').files[0];
      const description = document.getElementById('description').value;
      const content = quill.root.innerHTML; // Quill editor content

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
          content: content, // Quill editor content
          image: photoData
        };

        blogPosts.push(blogPost);
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

        alert('Blog post saved!');
        blogForm.reset();
        quill.setContents([]); // Clear the Quill editor
        displayBlogs(blogPosts); // Refresh the display after saving
      };

      if (image) {
        reader.readAsDataURL(image); // This line starts reading the file
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
          showModal(post.title, post.content); // Pass title and content to modal
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
        displayBlogs(filteredPosts); // Display filtered posts
      });
    }
  }
});

// Modal-related functions
const showModal = (title, content) => {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  modalTitle.innerHTML = title;       // Set modal title
  modalContent.innerHTML = content;   // Set modal content

  modal.style.display = 'block';      // Show modal
};

// Close modal when "X" is clicked
const closeModal = () => {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';       // Hide modal
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



// document.addEventListener('DOMContentLoaded', () => {
//   const blogForm = document.getElementById('blogForm');
//   const blogTableBody = document.getElementById('blogTable').querySelector('tbody');
//   const blogCards = document.getElementById('blogCards');
//   const searchInput = document.getElementById('searchInput');
//   let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || []; // Initialize blogPosts globally

//   // Initialize Quill
//   const quill = new Quill('#editor', {
//     theme: 'snow',
//     modules: {
//       toolbar: [
//         ['bold', 'italic', 'underline'],
//         ['blockquote', 'code-block'],
//         [{ 'header': 1 }, { 'header': 2 }],
//         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//         [{ 'script': 'sub' }, { 'script': 'super' }],
//         [{ 'indent': '-1' }, { 'indent': '+1' }],
//         [{ 'size': ['small', false, 'large', 'huge'] }],
//         [{ 'color': [] }, { 'background': [] }],
//         [{ 'font': [] }],
//         ['link', 'image', 'clean']
//       ]
//     }
//   });

//   // Display entries in the blog table
//   function displayEntries() {
//     blogTableBody.innerHTML = ''; // Clear existing entries
//     blogPosts.forEach((post, index) => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${post.title}</td>
//         <td><img src="${post.image}" alt="Image" width="100"></td>
//         <td>${post.description}</td>
//         <td>
//           <button onclick="editEntry(${index})">Edit</button>
//           <button onclick="deleteEntry(${index})">Delete</button>
//         </td>
//       `;
//       blogTableBody.appendChild(row);
//     });
//   }

//   // For saving a new blog post
//   if (blogForm) {
//     blogForm.addEventListener('submit', (event) => {
//       event.preventDefault();

//       const title = document.getElementById('title').value;
//       const image = document.getElementById('image').files[0];
//       const description = document.getElementById('description').value;
//       const content = quill.root.innerHTML; // Quill editor content

//       // Validate title
//       if (title.length > 10) {
//         alert('Title can only be a maximum of 10 characters.');
//         return;
//       }

//       // Validate image size
//       if (image && image.size > 1 * 1024 * 1024) {
//         alert('Image file size must be less than 1 MB.');
//         return;
//       }

//       // Validate description length
//       if (description.length > 300) {
//         alert('Description can only be a maximum of 300 characters.');
//         return;
//       }

//       // Use FileReader to read the image as DataURL
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         const photoData = e.target.result;

//         const blogPost = {
//           title: title,
//           description: description,
//           content: content,
//           image: photoData
//         };

//         blogPosts.push(blogPost);
//         localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

//         alert('Blog post saved!');
//         blogForm.reset();
//         quill.setContents([]); // Clear the Quill editor
//         displayEntries(); // Refresh the display after saving
//       };

//       if (image) {
//         reader.readAsDataURL(image); // This line starts reading the file
//       }
//     });
//   }

//   // Edit an entry
//   window.editEntry = function(index) {
//     const entry = blogPosts[index];
//     document.getElementById('title').value = entry.title;
//     document.getElementById('description').value = entry.description;
//     quill.root.innerHTML = entry.content; // Set Quill content

//     // Remove the entry from localStorage after editing
//     deleteEntry(index);
//   };

//   // Delete an entry
//   window.deleteEntry = function(index) {
//     blogPosts.splice(index, 1);
//     localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
//     displayEntries();
//   };

//   // For displaying blog posts on the cards page
//   if (blogCards) {
//     const displayBlogs = (posts) => {
//       blogCards.innerHTML = '';
//       posts.forEach((post) => {
//         const card = document.createElement('div');
//         card.classList.add('card');

//         card.innerHTML = `
//           <img src="${post.image}" alt="${post.title}">
//           <h3>${post.title}</h3>
//           <p>${post.description}</p>
//         `;

//         // Render the content as HTML
//         const viewbtn = document.createElement('button');
//         viewbtn.innerHTML = 'View';
//         card.appendChild(viewbtn);

//         // Open modal when View button is clicked
//         viewbtn.addEventListener('click', () => {
//           showModal(post.title, post.content); // Pass title and content to modal
//         });

//         blogCards.appendChild(card);
//       });
//     };

//     // Initial display of all blogs
//     displayBlogs(blogPosts);

//     // Function to filter blogs
//     if (searchInput) {
//       searchInput.addEventListener('input', () => {
//         const query = searchInput.value.toLowerCase();
//         const filteredPosts = blogPosts.filter((post) => {
//           return (
//             post.title.toLowerCase().includes(query) ||
//             post.description.toLowerCase().includes(query)
//           );
//         });
//         displayBlogs(filteredPosts); // Display filtered posts
//       });
//     }
//   }

//   // Initial display of entries in the table
//   displayEntries();

//   // Modal-related functions
//   const showModal = (title, content) => {
//     const modal = document.getElementById('modal');
//     const modalTitle = document.getElementById('modalTitle');
//     const modalContent = document.getElementById('modalContent');

//     modalTitle.innerHTML = title;       // Set modal title
//     modalContent.innerHTML = content;   // Set modal content

//     modal.style.display = 'block';      // Show modal
//   };

//   // Close modal when "X" is clicked
//   const closeModal = () => {
//     const modal = document.getElementById('modal');
//     modal.style.display = 'none';       // Hide modal
//   };

//   // Close modal when clicking outside of modal content
//   window.onclick = (event) => {
//     const modal = document.getElementById('modal');
//     if (event.target === modal) {
//       modal.style.display = 'none';     // Hide modal
//     }
//   };

//   // Close modal when "X" button is clicked
//   const closeButton = document.getElementById('closeModal');
//   if (closeButton) {
//     closeButton.addEventListener('click', closeModal);
//   }
// });
