(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
		const unsplashRequest = new XMLHttpRequest();
unsplashRequest.onload = addImage;
unsplashRequest.onerror = function (err){
	requestError(err, 'image');
}
unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);

unsplashRequest.setRequestHeader('Authorization', 'Client-ID 3b5bd3000744fa4e5d847678fd6cf4473274e0b4e767bc76aef6067a0eef3634');
unsplashRequest.send();

function addImage(){
	let htmlContent = '';
	const data = JSON.parse(this.responseText);
	
	if(data && data.results && data.results[0]){
	const firstImage = data.results[0];
	
	htmlContent = `<figure>
	<img src="${firstImage.urls.regular}" alt="${searchedForText}">
	<figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
	</figure>`;
	} else {
		htmlContent = '<div class="error-no-image">No images available</div>'
	}
	responseContainer.insertAdjacentHTML('afterbegin', htmlContent);

}

function addArticles () {
	let htmlContent = '';
	const data = JSON.parse(this.responseText);
	if(data.response && data.response.docs && data.response.docs.length > 1){
		htmlContent = '<ul>'+data.response.docs.map(article => `<li class="article">
		<h2><a href="${article.web_url}">${article.headline.main}</a></h2>
		<p>${article.snippet}</p>
		</li>`
		).join('') + '</ul>';
	} else {
		htmlContent = '<div class="error-no-articles">No article available</div>';
		
	}
	responseContainer.insertAdjacentHTML('beforeend',htmlContent);
}
const articleRequest = new XMLHttpRequest();
articleRequest.onload = addArticles;
articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=183232cfc98e4f75a9d037ed89aadfa3`);
articleRequest.send();

    });

})();
