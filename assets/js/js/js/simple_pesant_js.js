
//get buttton from id
var btnRdt = document.getElementById("button_reddit");
var btnNws = document.getElementById("button_news");


function getRandomPost_forRedirect() {
  return fetch('https://www.reddit.com/r/FloridaMan/random.json', {
          headers: {
        'User-Agent': 'r/FloridaMan carousel by u/Raymon22'
    }
  })
    .then(response => response.json())
    .then(data => {
      // Process the received data here
      console.log(data);
      return data[0].data.children[0].data.url;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

//detect click event
btnRdt.addEventListener("click", function () {
    window.open("https://www.reddit.com/r/FloridaMan/", "_blank");
});

btnNws.addEventListener("click", async function () {
    try {
        const data_url = await getRandomPost_forRedirect();
        window.open(data_url, '_blank');
    } catch (error) {
        console.error(error);
    }
});


//Carousel code


function fetchCardData() {
  return fetch('https://www.reddit.com/r/FloridaMan/top/.json?t=month&limit=70')
    .then(response => response.json())
    .then(data => {
      return data.data.children.map(child => {
        const post = child.data;
        return {
          image: post.thumbnail,
          title: post.title,
          date: new Date(post.created_utc * 1000).toLocaleDateString(),
          author: post.author,
          upvotes: post.ups,
            url: post.url
        };
      });
    })
    .catch(error => {
      console.error('Error fetching card data:', error);
      return [];
    });
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function populateCarousel() {
  const carouselCards = document.querySelector('.carousel-cards');
  const cardData = await fetchCardData();

  const totalCards = cardData.length;
  const shuffledCards = shuffleArray([...cardData, ...cardData]); // Randomize the card order

  shuffledCards.forEach((data, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('border-black');
    card.classList.add('border-primary');
    card.classList.add('shadow-0');
    card.innerHTML = `
      <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
        <img src="${data.image}" class="card-img-top" alt="${data.title}" />
        <a href="#!">
          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div>
        </a>
      </div>
      <div class="card-body">
        <h5 class="card-title">${data.title}</h5>
      </div>
      <div class="card-footer d-flex justify-content-between">
        <span class="author">r/${data.author}</span>
        <span class="upvotes">${data.upvotes}<img src="assets/images/upvote.png" style="margin-left: 5px; margin-bottom: 4px; width: 12px; height: 12px;" alt="Upvote" class="upvote-icon"></span>
      </div>
      <div class="card-header d-flex justify-content-end">${data.date}</div>
    `;

    card.addEventListener('click', () => {
      window.open(data.url, '_blank'); // Replace 'data.url' with the URL you want to redirect to
    });


    carouselCards.appendChild(card);

    if (index === totalCards - 1) {
      const clonedCards = [...carouselCards.children];
      clonedCards.forEach((card) => {
        carouselCards.appendChild(card.cloneNode(true));
      });
    }
  });
}

populateCarousel();
