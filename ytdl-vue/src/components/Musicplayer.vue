<template>
  <div
    class="d-flex align-items-center flex-column justify-content-center musicplayer-vue"
  >
    <div class="d-flex">
      <div class="songinfo d-flex flex-column mb-2">
        <span class="name">{{ song.name }}</span>
        <span class="artist">{{ song.artist }}</span>
      </div>
    </div>
    <audio
      id="myplayer"
      :src="loadSong(song.filename)"
      controls
      class="w-100"
      preload
      autoplay
    ></audio>
  </div>
</template>

<style lang="scss" scoped>
audio {
  border-radius: 50px;
  border-right: 4px solid #ff4136;
  border-left: 4px solid #ff4136;
}

audio::-webkit-media-controls-current-time-display,
audio::-webkit-media-controls-time-remaining-display {
  color: #fff;
}
audio::-webkit-media-controls-panel {
  background-color: #242424;
}
audio::-webkit-media-controls-play-button {
  background-color: #ff4136;
  border-radius: 20px;
}

.songinfo {
  .name {
    font-weight: bold;
  }
  .artist {
    font-size: 11px;
    font-style: italic;
  }
}
</style>

<script>
export default {
  name: "Musicplayer",
  components: {},
  props: ["song"],
  methods: {
    loadSong(filename) {
      try {
        // for debugging: return require("@/assets/music/" + filename);
        return process.env.VUE_APP_EXPRESS_SERVER + "music/" + filename;
      } catch (e) {
        console.log("Song nicht gefunden");
      }
    },
    loadImage(image) {
      try {
        // for debugging: return require("@/assets/music_thumbnails/" + image);
        return process.env.VUE_APP_EXPRESS_SERVER + "music_thumbnails/" + image;
      } catch (e) {
        console.log("Bild nicht gefunden");
      }
    },
  },
};
</script>
