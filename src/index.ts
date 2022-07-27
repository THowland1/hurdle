import './components/progress-bar';
import './components/play-button';
import { getSong } from './functions/get-song';

var audiotag = document.querySelector('audio')!;

const playlist = document.getElementById('playlist')!;

getSong().then((data) => {
  const track = data.items[0].track;
  playlist.innerText = JSON.stringify(data, null, 2);
  playlist.innerHTML = /* html */ `<div>
        <div>${track.name}</div>
        <div>${track.artists.map((o) => o.name).join(', ')}</div>
        <div>${track.album.name}</div>
        <img src="${
          track.album.images[track.album.images.length - 1].url
        }" alt="album cover">
</div>
    `;
  const url = data.items[0].track.preview_url;
  audiotag.src = url;
});
