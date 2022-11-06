const axios = require('axios').default;
const KEY = '30885515-e5cd8644896c6a7d3960ad51e';
const BASE_URL = 'https://pixabay.com/api/';

export default class Articles {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async createArticle() {
    const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    this.pageIncrement();
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  pageIncrement() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
