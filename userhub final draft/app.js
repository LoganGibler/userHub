const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';


function fetchUsers(){
  return fetchData(`${BASE_URL}/users`)
}

function fetchUserPosts(userId){
  return fetchData(`${BASE_URL}/users/${ userId }/posts?_expand=user`)
}

function fetchPostComments(postId){
  return fetchData(`${BASE_URL}/posts/${ postId }/comments`)
}

function fetchUserAlbumList(userId){
  return fetchData(`${BASE_URL}/users/${ userId }/albums?_expand=user&_embed=photos`)
}


function renderUser(user){
  return $(`<div class="user-card">
    <header><h2>${user.name}</h2></header>
    <section class="company-info">
      <p><b>Contact:</b> ${user.email}</p>
      <p><b>Works for:</b> ${user.company.name}</b></p>
      <p><b>Company creed:</b> "${user.company.catchPhrase}, which will ${user.company.bs}!"</p>
    </section>
    <footer>
      <button class="load-posts">POSTS BY ${user.username}</button>
      <button class="load-albums">ALBUMS BY ${user.username}</button>
    </footer>
  </div>`).data('user', user)
}

function renderUserList(userList){
    const userLists = $('#user-list')
    userLists.empty();
    userList.forEach((user)=> {
    userLists.append(renderUser(user))
    })
}

function bootstrap(){
    fetchUsers().then(renderUserList)
}
  bootstrap()

$('#user-list').on('click', '.user-card .load-posts', function() {
    const user = $(this).closest('.user-card').data('user')
  
    fetchUserPosts(user.id)
      .then(renderPostList)
});
  
$('#user-list').on('click', '.user-card .load-albums', function() {
    const user = $(this).closest('.user-card').data('user')
  
    fetchUserAlbumList(user.id)
      .then(renderAlbumList)
});

function renderAlbum(album){
    const albums = $(`<div class="album-card">
      <header><h3>${album.title}, by ${album.user.username}</h3></header>
      <section class="photo-list"></section>
    </div>`)
  
    const photoListElement = albums.find('.photo-list')
    album.photos.forEach((photo) =>{
    photoListElement.append(renderPhoto(photo))
    })
  
    return albums
}

  function renderPhoto(photo){
    return $(`<div class="photo-card">
      <a href="${photo.url}" target="_blank">
        <img src="${photo.thumbnailUrl}"/>
        <figure>${photo.title}</figure>
      </a>
    </div>`)
}
  
function fetchData(url){
    return fetch(url).then((e) => {
      return e.json()
    }).catch((error) => {
      console.error(error)
    })
}


function renderPost(post){
  return $(`<div class="post-card">
    <header>
      <h3>${post.title}</h3>
      <h3>--- ${post.user.username}</h3>
    </header>
    <p>${post.body}</p>
    <footer>
      <div class="comment-list"></div>
      <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
    </footer>
  </div>`).data('post', post)
}

function renderPostList(postList){
  $('#app section.active').removeClass('active')

  const postListElement = $('#post-list')
  postListElement.empty().addClass('active')
  postList.forEach((post) => {
  postListElement.append( renderPost(post) )
  })
}


function renderAlbumList(albumList) {
    $('#app section.active').removeClass('active')
    const albumListElement = $('#album-list')
    albumListElement.empty().addClass('active')
    albumList.forEach((album) => {
    albumListElement.append( renderAlbum(album) )
  })
}

function setCommentsOnPost(post) {
    if (post.comments) {
      return Promise.reject(null)
    }
    return fetchPostComments(post.id).then((comments) => {
      post.comments = comments
      return post
    });
}
  
function toggleComments(card) {
  const footer = card.find('footer')

  if (footer.hasClass('comments-open')) {
    footer.removeClass('comments-open')
    footer.find('.verb').text('show')
  } else {
    footer.addClass('comments-open')
    footer.find('.verb').text('hide')
  }
}

$('#post-list').on('click', '.post-card .toggle-comments', function () {
  const card = $(this).closest('.post-card')
  const post = card.data('post')
  const comment = card.find('.comment-list')

  setCommentsOnPost(post)
    .then((post) => {
      comment.empty();
      post.comments.forEach((comment) => {
        comment.prepend($(`<h3>${comment.body} &nbsp&nbsp ${comment.email}</h3>`));
      });
      toggleComments(postCardElement);
    })
    .catch(function () {
      toggleComments(postCardElement);
    });
});




