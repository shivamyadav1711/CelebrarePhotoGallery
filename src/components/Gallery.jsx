
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos';

const FAVOURITES_KEY = 'celebrare-photo-gallery-favourites';

function favouritesReducer(favourites, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE':
      if (favourites.includes(action.photoId)) {
        return favourites.filter((id) => id !== action.photoId);
      }

      return [...favourites, action.photoId];

    default:
      return favourites;
  }
}

function loadSavedFavourites() {
  try {
    const savedFavourites = localStorage.getItem(FAVOURITES_KEY);

    if (!savedFavourites) {
      return [];
    }

    const parsedFavourites = JSON.parse(savedFavourites);

    if (!Array.isArray(parsedFavourites)) {
      return [];
    }

    return parsedFavourites.filter(
      (id) => typeof id === 'string' || typeof id === 'number'
    );
  } catch {
    return [];
  }
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [searchTerm, setSearchTerm] = useState('');

  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    loadSavedFavourites
  );

  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
    } catch (error) {
      console.error('Unable to save favourites:', error);
    }
  }, [favourites]);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    const searchText = searchTerm.trim().toLowerCase();

    if (!searchText) {
      return photos;
    }

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(searchText)
    );
  }, [photos, searchTerm]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div
          role="status"
          aria-label="Loading photos"
          className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
        />

        <p className="text-slate-600">Loading photos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <p role="alert" className="text-center text-red-600">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Photo Gallery
          </h1>

          <p className="mt-2 text-slate-600">
            Discover photos shared by photographers around the world.
          </p>

          <div className="mt-6">
            <label
              htmlFor="photo-search"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Search by author
            </label>

            <input
              id="photo-search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Enter an author's name..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </header>

        {filteredPhotos.length === 0 ? (
          <p className="py-10 text-center text-slate-600">
            No photos found for "{searchTerm}".
          </p>
        ) : (
          <section
            aria-label="Photo gallery"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {filteredPhotos.map((photo) => {
              const isFavourite = favourites.includes(photo.id);

              return (
                <article
                  key={photo.id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <div className="relative">
                    <img
                      src={photo.download_url}
                      alt={`Photo by ${photo.author}`}
                      loading="lazy"
                      className="h-64 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: 'TOGGLE_FAVOURITE',
                          photoId: photo.id,
                        })
                      }
                      aria-label={
                        isFavourite
                          ? `Remove ${photo.author} from favourites`
                          : `Add ${photo.author} to favourites`
                      }
                      aria-pressed={isFavourite}
                      title={
                        isFavourite
                          ? 'Remove from favourites'
                          : 'Add to favourites'
                      }
                      className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl shadow-md transition hover:scale-105 ${
                        isFavourite ? 'text-red-500' : 'text-slate-500'
                      }`}
                    >
                      {isFavourite ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="font-medium text-slate-800">
                      {photo.author}
                    </p>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
