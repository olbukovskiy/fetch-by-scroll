import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GetArticles from './findCards';

const createArticle = new GetArticles();
const throttle = require('lodash.throttle');

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryField: document.querySelector('.gallery'),
  loadingBalls: document.querySelector('.loading'),
};

refs.searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', throttle(scrollHandler, 250));

let lightbox = new SimpleLightbox('.gallery a', {
  animationSpeed: 250,
});

function scrollHandler() {
  const { scrollHeight, clientHeight, scrollTop } = document.documentElement;

  if (clientHeight + scrollTop === scrollHeight) {
    showLoading();
  }
}

async function onSearch(event) {
  event.preventDefault();
  refs.galleryField.innerHTML = '';

  createArticle.query = event.currentTarget.elements.searchQuery.value.trim();

  if (!createArticle.query) {
    refs.galleryField.innerHTML = '';
    Notify.failure('Sorry, search field is empty :(');
    return;
  }

  try {
    createArticle.resetPage();
    const { articleData, totalArticles, totalPages } = await getPicturesData();

    if (!articleData.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      refs.galleryField.innerHTML = '';
      return;
    }

    Notify.success(`Hooray! We found ${totalArticles} images.`);

    let markup = markupCreator(articleData);
    refs.galleryField.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    totalPagesCheck(createArticle.page, totalPages);
  } catch (error) {
    console.log(error);
  }
}

function markupCreator(items) {
  return items
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
 <a href="${largeImageURL}" class="wrapper">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item"><b>Likes: ${likes}</b></p>
    <p class="info-item"><b>Views: ${views}</b></p>
    <p class="info-item"><b>Comments: ${comments}</b></p>
    <p class="info-item"><b>Downloads: ${downloads}</b></p>
  </div>
</a>
`;
      }
    )
    .join('');
}

function totalPagesCheck(page, totalPages) {
  if (page === totalPages) {
    loadMoreBtn.hide();
    loadMoreBtn.disable();
    Notify.info(`We're sorry, but you've reached the end of search results.`);
    return;
  }
}

async function getPicturesData() {
  const newArticle = await createArticle.createArticle();
  const articleData = newArticle.data.hits;
  const totalArticles = newArticle.data.totalHits;
  const totalPages = Math.ceil(totalArticles / 40) + 1;
  return {
    articleData,
    totalArticles,
    totalPages,
  };
}

async function loadMore() {
  try {
    const { articleData, totalPages } = await getPicturesData();

    let markup = markupCreator(articleData);
    refs.galleryField.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    refs.loadingBalls.classList.remove('show');

    totalPagesCheck(createArticle.page, totalPages);
  } catch (error) {
    console.log(error);
  }
}

function showLoading() {
  refs.loadingBalls.classList.add('show');

  setTimeout(loadMore, 500);
}
