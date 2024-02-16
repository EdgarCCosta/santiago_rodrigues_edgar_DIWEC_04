var albums = []; // Variable global para almacenar los álbumes

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

// Función para obtener los detalles del álbum
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
function displayAlbums(albums) {
    var albumsContainer = $('#albumsContainer');
    albumsContainer.empty(); // Limpiamos el contenedor

    albums.forEach(function(album) {
        var albumDiv = $('<div>').addClass('album').attr('data-album-id', album.collectionId);
    
        // Agregar evento de clic al álbum
        albumDiv.click(function() {
            var albumId = album.collectionId;
            redirectToAlbumDetailsPage(albumId);
        });

        var albumTitle = $('<h2>').text(album.collectionName).addClass('albumTitle');
        albumDiv.append(albumTitle);

        var albumImage = $('<img>').attr('src', album.artworkUrl100).attr('alt', album.collectionName);
        albumDiv.append(albumImage);

        var albumPrice = $('<p>').text('Precio: ' + album.collectionPrice + ' ' + album.currency);
        albumDiv.append(albumPrice);

        albumsContainer.append(albumDiv);
    });
}

// Función para mostrar los detalles del álbum
function displayAlbumDetails(album, tracks) {
    var albumDetailsContainer = $('#albumDetails');
    albumDetailsContainer.empty(); // Limpiar el contenedor de detalles del álbum

    var albumTitle = $('<h2>').text(album.collectionName);
    albumDetailsContainer.append(albumTitle);

    var albumImage = $('<img>').attr('src', album.artworkUrl100).attr('alt', album.collectionName);
    albumDetailsContainer.append(albumImage);

    var artistName = $('<p>').html('<strong>Artista:</strong> ' + album.artistName);
    albumDetailsContainer.append(artistName);

    var releaseDate = new Date(album.releaseDate);
    var formattedReleaseDate = releaseDate.toLocaleDateString();
    var albumReleaseDate = $('<p>').html('<strong>Fecha de lanzamiento:</strong> ' + formattedReleaseDate);
    albumDetailsContainer.append(albumReleaseDate);

    var albumGenre = $('<p>').html('<strong>Género:</strong> ' + album.primaryGenreName);
    albumDetailsContainer.append(albumGenre);

    var albumDescription = $('<p>').text(album.collectionDescription);
    albumDetailsContainer.append(albumDescription);

    var tracklistTitle = $('<h3>').text('TRACK LIST');
    albumDetailsContainer.append(tracklistTitle);

    if (tracks.length > 0) {
        var tracksContainer = $('<div>').addClass('track-list');
        tracks.forEach(function(track) {
            var trackItem = $('<p>').text(track.trackName);
            tracksContainer.append(trackItem);
        });
        albumDetailsContainer.append(tracksContainer);
    } else {
        var noTracksMessage = $('<p>').text('No se encontraron canciones para este álbum.');
        albumDetailsContainer.append(noTracksMessage);
    }

    // Agregar el botón para ver en iTunes
    var itunesButton = $('<a>').text('Ver en iTunes')
                                .attr('href', album.collectionViewUrl)
                                .attr('target', '_blank')
                                .addClass('itunes-button');
    albumDetailsContainer.append(itunesButton);
}

// Función para redirigir a la página de detalles del álbum
function redirectToAlbumDetailsPage(albumId) {
    window.location.href = 'album-details.html?id=' + albumId;
}

// Función para mostrar un mensaje de error en la página
function displayError(message) {
    var resultsDiv = $('#searchResults');
    resultsDiv.html('<p>' + message + '</p>');
}

// Función para ordenar los álbumes por precio y cambiar el texto del botón
function sortAlbumsByPrice() {
    if (albums.length === 0) {
        return;
    }

    var sortButton = $('#sortPriceButton');

    albums.sort((a, b) => parseFloat(a.collectionPrice) - parseFloat(b.collectionPrice));

    // Cambiar el texto del botón
    if (sortButton.text() === 'Ordenar por precio ') {
        sortButton.text('Ordenar por precio ');
    } else {
        sortButton.text('Ordenar por precio');
        // Invertir el orden de los álbumes si ya estaban ordenados de forma descendente
        albums.reverse();
    }

    displayAlbums(albums);
}

// Evento de clic para el botón de búsqueda
$('#searchButton').click(function() {
    searchArtist();
});

// Evento de clic para el botón de ordenar por precio
$('#sortPriceButton').click(function() {
    sortAlbumsByPrice();
});