const form = document.querySelector('#searchForm');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    getApi();
})

const makeImgs = (shows) => {
    for (let result of shows) {
        if (result.show.image) {
            const img = document.createElement('img');
            img.src = result.show.image.medium;
            document.getElementById('container').append(img);
        }
    }
}

const getApi = async () => {
    const searchTerm = form.elements.query.value;
    const config = { params: { q: searchTerm } };
    const res = await axios.get(`https://api.tvmaze.com/search/shows`, config);
    container.innerHTML = '';
    makeImgs(res.data);
    form.elements.query.value = '';
}