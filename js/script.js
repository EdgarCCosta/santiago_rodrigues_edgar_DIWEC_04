

function searchArtist() {
    var searchQuery = document.getElementById('searchInput').value;
    var apiUrl = 'https://itunes.apple.com/es/search?term=' + encodeURIComponent(searchQuery) + '&entity=musicArtist&limit=1&sort=popular'; // Agregamos "/es" para la tienda de iTunes de España

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                var artistId = data.results[0].artistId;
                fetchAlbums(artistId);
            } else {
                displayError('No se encontró el artista.');
            }
        })
        .catch(error => console.error('Error al realizar la búsqueda:', error));
}

function fetchAlbums(artistId) {
    var apiUrl = 'https://itunes.apple.com/lookup?id=' + artistId + '&entity=album&country=es'; // Agregamos "&country=es" para buscar en la tienda de iTunes de España

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

function displayAlbums(albums) {
    var albumsContainer = document.getElementById('albumsContainer');
    albumsContainer.innerHTML = ''; // Limpiamos el contenedor

    albums.forEach(function(album) {
        var albumDiv = document.createElement('div');
        albumDiv.classList.add('album');
        albumDiv.setAttribute('data-album-id', album.collectionId); // Agregar el ID del álbum como atributo de datos
    
        // Agregar evento de clic al álbum
        albumDiv.addEventListener('click', function() {
            var albumId = album.collectionId;
            redirectToAlbumDetailsPage(albumId);
        });

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



function fetchTracks(albumId, albumDiv) {
    var apiUrl = 'https://itunes.apple.com/lookup?id=' + albumId + '&entity=song&country=es'; // Agregamos "&country=es" para buscar en la tienda de iTunes de España
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        var tracksContainer = document.createElement('div');
        tracksContainer.classList.add('track-list'); // Agregamos la clase track-list al contenedor de canciones

        if (data.results && data.results.length > 1) {
          var tracks = data.results.slice(1); // Excluimos el primer elemento que es el álbum mismo
          tracks.forEach(function(track) {
            var trackItem = document.createElement('p');
            trackItem.textContent = track.trackName;
            tracksContainer.appendChild(trackItem);
          });
        } else {
          var noTracksMessage = document.createElement('p');
          noTracksMessage.textContent = 'No se encontraron canciones para este álbum.';
          tracksContainer.appendChild(noTracksMessage);
        }

        albumDiv.appendChild(tracksContainer); // Agregamos el contenedor de canciones al álbum
      })
      .catch(error => console.error('Error al obtener las canciones:', error));
}

function fetchAlbumDetails(albumId) {
    var apiUrl = 'https://itunes.apple.com/lookup?id=' + albumId + '&entity=song&country=es';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 1) {
                var album = data.results[0]; // El primer elemento contiene los detalles del álbum
                if (Array.isArray(data.results.slice(1))) {
                    displayAlbumDetails(album, data.results.slice(1)); // Pasar los detalles del álbum y las canciones a la función
                } else {
                    displayError('No se encontraron detalles del álbum.');
                }
            } else {
                displayError('No se encontraron detalles del álbum.');
            }
        })
        .catch(error => console.error('Error al obtener los detalles del álbum:', error));
}

// Función para buscar un artista en iTunes
function searchArtist() {
    var searchQuery = $('#searchInput').val();
    var apiUrl = 'https://itunes.apple.com/es/search?term=' + encodeURIComponent(searchQuery) + '&entity=musicArtist&limit=1&sort=popular'; // Agregamos "/es" para la tienda de iTunes de España

    // Realizar la solicitud de búsqueda utilizando AJAX
    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.results.length > 0) {
                var artistId = data.results[0].artistId;
                fetchAlbums(artistId); // Llamar a la función para obtener los álbumes del artista encontrado
            } else {
                displayError('No se encontró el artista.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    });
}

// Función para obtener los álbumes de un artista
function fetchAlbums(artistId) {
    var apiUrl = 'https://itunes.apple.com/lookup?id=' + artistId + '&entity=album&country=es'; // Agregamos "&country=es" para buscar en la tienda de iTunes de España

    // Realizar la solicitud para obtener los álbumes del artista utilizando AJAX
    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Filtrar y ordenar los álbumes por popularidad
            var sortedAlbums = data.results.slice(1).sort((a, b) => b.collectionPopularity - a.collectionPopularity);
            // Guardar los álbumes para la funcionalidad de ordenar por precio
            albums = sortedAlbums;
            // Mostrar solo los primeros 5 álbumes
            displayAlbums(sortedAlbums);
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener los álbumes:', error);
        }
    });
}

function fetchAlbumDetails(albumId) {
    var apiUrl = 'https://itunes.apple.com/lookup?id=' + albumId + '&entity=song&country=es';

    // Realizar la solicitud para obtener los detalles del álbum y las canciones utilizando AJAX
    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.results && data.results.length > 0) {
                var album = data.results[0]; // El primer elemento contiene los detalles del álbum
                var tracks = data.results.slice(1); // Las pistas comienzan desde el segundo elemento
                displayAlbumDetails(album, tracks); // Pasar los detalles del álbum y las pistas a la función
            } else {
                displayError('No se encontraron detalles del álbum.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener los detalles del álbum:', error);
        }
    });
}

// Función para mostrar los álbumes en la página
function displayAlbumDetails(album, tracks) {
    var albumDetailsContainer = document.getElementById('albumDetails');
    albumDetailsContainer.innerHTML = ''; // Limpiar el contenedor de detalles del álbum

    var albumTitle = document.createElement('h2');
    albumTitle.textContent = album.collectionName;
    albumDetailsContainer.appendChild(albumTitle);

    var albumImage = document.createElement('img');
    albumImage.src = album.artworkUrl100;
    albumImage.alt = album.collectionName;
    albumDetailsContainer.appendChild(albumImage);

    // Agregar el nombre del artista en negrita
    var artistName = document.createElement('p');
    artistName.innerHTML = '<strong>Artista:</strong> ' + album.artistName;
    albumDetailsContainer.appendChild(artistName);

    // Formatear la fecha para mostrar solo la parte de la fecha sin la hora
    var releaseDate = new Date(album.releaseDate);
    var formattedReleaseDate = releaseDate.toLocaleDateString(); // Obtener la parte de la fecha en formato local

    var albumReleaseDate = document.createElement('p');
    albumReleaseDate.innerHTML = '<strong>Fecha de lanzamiento:</strong> ' + formattedReleaseDate;
    albumDetailsContainer.appendChild(albumReleaseDate);

    var albumGenre = document.createElement('p');
    albumGenre.innerHTML = '<strong>Género:</strong> ' + album.primaryGenreName;
    albumDetailsContainer.appendChild(albumGenre);

    // Mostrar la breve descripción del álbum
    var albumDescription = document.createElement('p');
    albumDescription.textContent = album.collectionDescription; // Esto obtiene la descripción del álbum
    albumDetailsContainer.appendChild(albumDescription);

    // Título de la lista de canciones
    var tracklistTitle = document.createElement('h3');
    tracklistTitle.textContent = 'TRACK LIST';
    albumDetailsContainer.appendChild(tracklistTitle);

    // Mostrar las canciones del álbum
    if (tracks.length > 0) {
        var tracksContainer = document.createElement('div');
        tracksContainer.classList.add('track-list');
        tracks.forEach(function(track) {
            var trackItem = document.createElement('p');
            trackItem.textContent = track.trackName;
            tracksContainer.appendChild(trackItem);
        });
        albumDetailsContainer.appendChild(tracksContainer);
    } else {
        var noTracksMessage = document.createElement('p');
        noTracksMessage.textContent = 'No se encontraron canciones para este álbum.';
        albumDetailsContainer.appendChild(noTracksMessage);
    }

    var itunesButton = document.createElement('a');
    itunesButton.textContent = 'Precio: ' + album.collectionPrice + ' ' + album.currency;
    itunesButton.href = album.collectionViewUrl;
    itunesButton.target = '_blank'; // Abrir en una nueva ventana
    itunesButton.classList.add('itunes-button');
    albumDetailsContainer.appendChild(itunesButton);

}


// Función para redirigir a la página de detalles del álbum
function redirectToAlbumDetailsPage(albumId) {
    // Redirigir a la página de detalles del álbum con el ID del álbum como parámetro
    window.location.href = 'album-details.html?id=' + albumId;
}

// Función para mostrar un mensaje de error en la página
function displayError(message) {
    var resultsDiv = $('#searchResults');
    resultsDiv.html('<p>' + message + '</p>');
}

// Función para ordenar los álbumes por precio
function sortAlbumsByPrice() {
    // Verificar si hay álbumes para ordenar
    if (albums.length === 0) {
        return; // No hay álbumes para ordenar
    }

    // Obtener el botón de ordenar por precio
    var sortButton = $('#sortPriceButton');

    // Verificar el estado actual del botón para decidir el orden
    if (sortButton.text() === 'Ordenar por precio ascendente') {
        // Ordenar los álbumes por precio de manera ascendente
        albums.sort((a, b) => parseFloat(a.collectionPrice) - parseFloat(b.collectionPrice));
        // Cambiar el texto del botón
        sortButton.text('Ordenar por precio descendente');
    } else {
        // Ordenar los álbumes por precio de manera descendente
        albums.sort((a, b) => parseFloat(b.collectionPrice) - parseFloat(a.collectionPrice));
        // Cambiar el texto del botón
        sortButton.text('Ordenar por precio ascendente');
    }

    // Mostrar los álbumes ordenados en la página
    displayAlbums(albums);
}

var albums = []; // Variable global para almacenar los álbumes


function redirectToAlbumDetailsPage(albumId) {
    // Redirigir a la página de detalles del álbum con el ID del álbum como parámetro
    window.location.href = 'album-details.html?id=' + albumId;
}



function displayError(message) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<p>' + message + '</p>';
}