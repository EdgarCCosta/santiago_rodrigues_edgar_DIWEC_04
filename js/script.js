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
            // Mostrar solo los primeros 5 álbumes
            displayAlbums(sortedAlbums);
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener los álbumes:', error);
        }
    });
}

// Función para mostrar los álbumes en la página
function displayAlbums(albums) {
    var albumsContainer = $('#albumsContainer');
    albumsContainer.empty(); // Limpiar el contenedor

    // Iterar sobre cada álbum y crear un elemento para mostrarlo en la página
    albums.forEach(function(album) {
        var albumDiv = $('<div>').addClass('album').attr('data-album-id', album.collectionId); // Agregar el ID del álbum como atributo de datos

        // Agregar evento de clic al álbum para redirigir a los detalles del álbum
        albumDiv.on('click', function() {
            var albumId = album.collectionId;
            redirectToAlbumDetailsPage(albumId);
        });

        // Crear elementos para el título, la imagen y el precio del álbum
        var albumTitle = $('<h2>').text(album.collectionName).addClass('albumTitle'); // Cambia 'albumtitle' a 'albumTitle'
        albumDiv.append(albumTitle);

        var albumImage = $('<img>').attr('src', album.artworkUrl100).attr('alt', album.collectionName);
        albumDiv.append(albumImage);

        var albumPrice = $('<p>').text('Precio: ' + album.collectionPrice + ' ' + album.currency);
        albumDiv.append(albumPrice);

        albumsContainer.append(albumDiv);
    });
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
