// Función para buscar un artista en iTunes
function searchArtist() {
    var searchQuery = document.getElementById('searchInput').value;
    var apiUrl = 'https://itunes.apple.com/es/search?term=' + encodeURIComponent(searchQuery) + '&entity=musicArtist&limit=1&sort=popular'; // Agregamos "/es" para la tienda de iTunes de España

    // Realizar la solicitud de búsqueda utilizando fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                var artistId = data.results[0].artistId;
                fetchAlbums(artistId); // Llamar a la función para obtener los álbumes del artista encontrado
            } else {
                displayError('No se encontró el artista.');
            }
        })
        .catch(error => console.error('Error al realizar la búsqueda:', error));
}

// Función para obtener los álbumes de un artista
function fetchAlbums(artistId) {
    var apiUrl = 'https://itunes.apple.com/lookup?id=' + artistId + '&entity=album&country=es'; // Agregamos "&country=es" para buscar en la tienda de iTunes de España

    // Realizar la solicitud para obtener los álbumes del artista utilizando fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Filtrar y ordenar los álbumes por popularidad
            var sortedAlbums = data.results.slice(1).sort((a, b) => b.collectionPopularity - a.collectionPopularity);
            // Mostrar solo los primeros 5 álbumes
            displayAlbums(sortedAlbums);
        })
        .catch(error => console.error('Error al obtener los álbumes:', error));
}

// Función para mostrar los álbumes en la página
function displayAlbums(albums) {
    var albumsContainer = document.getElementById('albumsContainer');
    albumsContainer.innerHTML = ''; // Limpiar el contenedor

    // Iterar sobre cada álbum y crear un elemento para mostrarlo en la página
    albums.forEach(function(album) {
        var albumDiv = document.createElement('div');
        albumDiv.classList.add('album');
        albumDiv.setAttribute('data-album-id', album.collectionId); // Agregar el ID del álbum como atributo de datos

        // Agregar evento de clic al álbum para redirigir a los detalles del álbum
        albumDiv.addEventListener('click', function() {
            var albumId = album.collectionId;
            redirectToAlbumDetailsPage(albumId);
        });

        // Crear elementos para el título, la imagen y el precio del álbum
        var albumTitle = document.createElement('h2');
        albumTitle.textContent = album.collectionName;
        albumTitle.classList.add('albumTitle'); // Cambia 'albumtitle' a 'albumTitle'
        albumDiv.appendChild(albumTitle);

        var albumImage = document.createElement('img');
        albumImage.src = album.artworkUrl100;
        albumImage.alt = album.collectionName;
        albumDiv.appendChild(albumImage);

        var albumPrice = document.createElement('p');
        albumPrice.textContent = 'Precio: ' + album.collectionPrice + ' ' + album.currency;
        albumDiv.appendChild(albumPrice);

        albumsContainer.appendChild(albumDiv);
    });
}

// Función para redirigir a la página de detalles del álbum
function redirectToAlbumDetailsPage(albumId) {
    // Redirigir a la página de detalles del álbum con el ID del álbum como parámetro
    window.location.href = 'album-details.html?id=' + albumId;
}

// Función para mostrar un mensaje de error en la página
function displayError(message) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<p>' + message + '</p>';
}
