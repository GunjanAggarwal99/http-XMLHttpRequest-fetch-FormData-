// Import stylesheets
import './style.css';

// Write Javascript code!
const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

function sendHttpRequest(method, url, data) {
  // const promise = new Promise((resolve, reject) => {
  // const xhr = new XMLHttpRequest();
  //  xhr.setRequestHeader('Content-Type','application/json'); /*how we send header request by setRequestHeader method*/
  //   xhr.open(method, url);
  //   xhr.responseType = 'json';

  //   xhr.onload = function () {
  //     if (xhr.status >= 200 && xhr.status < 300) {
  //       resolve(xhr.response);
  //     } else {
  //       reject(new Error('Something went Wrong'));
  //     }
  //   };
  //   xhr.onerror = function () {
  //     reject(new Error('Failed to send request'));
  //   };
  //   xhr.send(JSON.stringify(data));
  // });
  // return promise;

  return fetch(url, {
    method: method /*by default it will take GET method only */,
    body: data /* in case if we use formData then we dont have to tell it will automatically convert the data*/,
    // body: JSON.stringify(data),
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then((errData) => {
          console.log(errData);
          throw new Error('something went wrong - server side');
        });
      }
    })
    .catch((error) => {
      /* it will go in catch() block only if we have network connectivety issues otherwise we have to handle it in then () block with if/else statemenet*/
      console.log(error);
      throw new Error('Something went wrong');
    });
}

async function fetchPosts() {
  try {
    // const responseData = await sendHttpRequest(
    //   'GET',
    //   'https://jsonplaceholder.typicode.com/posts'

    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    );
    const listOfPosts = response.data;
    // const listOfPosts = responseData;
    for (const post of listOfPosts) {
      const postEl = document.importNode(postTemplate.content, true);
      postEl.querySelector('h2').textContent = post.title.toUpperCase();
      postEl.querySelector('p').textContent = post.body;
      postEl.querySelector('li').id = post.id;
      listElement.append(postEl);
    }
  } catch (error) {
    alert(error.message);
  }
}

async function createPost(title, content) {
  const userId = Math.random();
  const post = {
    title: title,
    body: content,
    userId: userId,
  };
  const fd = new FormData(
    form
  ); /* if we directly want to send data from the form ,it is mandotory to add name attribute in html file*/
  // fd.append('title', title);
  // fd.append('body', content);
  fd.append('userId', userId);
  // await sendHttpRequest(
  //   'POST',
  //   'https://jsonplaceholder.typicode.com/posts',
  //   fd
  // );
  await axios.post('https://jsonplaceholder.typicode.com/posts', fd);
}
fetchButton.addEventListener('click', fetchPosts);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const enteredTitle = event.currentTarget.querySelector('#title').value;
  const enteredContent = event.currentTarget.querySelector('#content').value;

  createPost(enteredTitle, enteredContent);
});
postList.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const post = event.target.closest('li').id;
    // sendHttpRequest(
    //   'DELETE',
    //   `https://jsonplaceholder.typicode.com/posts/${post}`
    // );
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${post}`);
  }
});
