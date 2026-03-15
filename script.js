
 let songs;
 let current;
 let currs;
 
//  let currentsong;
 let currentsong = new Audio();
//  let audio;

const prev = document.getElementById("prev");
const play = document.getElementById("play");
const next = document.getElementById("next");
const volumeSlider = document.getElementById("volumeSlider");
const muteBtn = document.getElementById("muteBtn");
const volumeIcon = document.getElementById("volumeIcon");

let previousVolume = 0.5;

const updateMuteUI = (muted) => {
    if (muteBtn) {
        muteBtn.textContent = muted ? "🔇" : "🔊";
    }
    if (volumeIcon) {
        volumeIcon.src = muted ? "SVG/volume-off.svg" : "SVG/volume.svg";
    }
};

if (volumeSlider) {
    const startVol = Math.max(0, Math.min(100, volumeSlider.value));
    currentsong.volume = startVol / 100;
    updateMuteUI(startVol === 0);

    volumeSlider.addEventListener("input", (e) => {
        const newVolume = e.target.value / 100;
        if (newVolume > 0) {
            previousVolume = newVolume;
        }
        currentsong.volume = newVolume;
        updateMuteUI(newVolume === 0);
    });
}

if (muteBtn) {
    muteBtn.addEventListener("click", () => {
        const currentlyMuted = currentsong.volume === 0;
        if (currentlyMuted) {
            currentsong.volume = previousVolume || 0.5;
            if (volumeSlider) volumeSlider.value = Math.round(currentsong.volume * 100);
            updateMuteUI(false);
        } else {
            previousVolume = currentsong.volume;
            currentsong.volume = 0;
            if (volumeSlider) volumeSlider.value = 0;
            updateMuteUI(true);
        }
    });
}

const setPlayIcon = (isPlaying) => {
    if (play) {
        play.src = isPlaying ? "SVG/pause.svg" : "SVG/play1.svg";
    }
};

currentsong.addEventListener("play", () => setPlayIcon(true));
currentsong.addEventListener("pause", () => setPlayIcon(false));
currentsong.addEventListener("ended", () => setPlayIcon(false));
 async function getSongs() {

    let response = await fetch("/songs/");
    let text = await response.text();

    let div = document.createElement("div");
    div.innerHTML = text;

    let links = div.getElementsByTagName("a");
     songs = [];

    for (let i = 0; i < links.length; i++) {

        const link = links[i];

        if (link.href.endsWith(".mp3")) {
            songs.push(link.href);
        }
    }

    return songs;

}
getSongs(); 
async function loadSongs() {
    songs = await getSongs();

}

loadSongs();

     const playSong = (track) =>{
    currentsong.src = track;
    currentsong.play();    
    document.querySelector(".song-name").innerHTML = `<h4>${track.split("%5Csong%5C").pop().replaceAll("%5C", " ").replaceAll("%20", " ")}</h4>`;
}
async function main(){
    songs = await getSongs();
    let ul = document.querySelector(".cardlist");
    console.log(songs);
    songs.forEach(song => {
        ul.innerHTML += `<div onClick="playSong('${song}')" class="card">
        <div id="playi" class="play">
        <img src="SVG/play.svg" alt="Play">
        </div>
                        <img src="SVG/music.svg" alt="Music">
                        <div> 
                        
                        
                        <h5>${decodeURIComponent(song).split('/').pop()}</h5>
                        <h6>Artist</h6>
                        </div>
                        </div>`;
                        
                    })

                    prev.addEventListener("click", (e)=>{
                        let index = songs.indexOf(currentsong.src);
                        if(index > 0){
                            playSong(songs[index - 1]);
                        }
                    });
                    next.addEventListener("click", (e)=>{
                        let index= songs.indexOf(currentsong.src); 
                        if(index < songs.length - 1){
                            playSong(songs[index + 1]);
                }});
                    
                play.addEventListener("click", (e)=>{
                    if(!currentsong.paused){
                        currentsong.pause();
                    } else {
                        currentsong.play();
                    }
                });
                
                if (songs && songs.length > 0) {
                    const firstSong = songs[0];
                    currentsong.src = firstSong;
                    document.querySelector(".song-name").innerHTML = `<h4>${firstSong.split("%5Csong%5C").pop().replaceAll("%5C", " ").replaceAll("%20", " ")}</h4>`;
                    setPlayIcon(false);
                }
                hamburger.addEventListener("click", ()=>{
                    document.querySelector(".left").style.left = "0";
                });
                const close = document.querySelector(".close");
                close.addEventListener("click", ()=>{
                    document.querySelector(".left").style.left = "-100%";
                });

               
            }

main();
