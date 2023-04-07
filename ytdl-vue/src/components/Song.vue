<template>
  <div class="d-flex justify-content-center m-2">
    <div
      class="song-vue p-3 shadow rounded-1"
      :class="ui_active_class"
      @click="setCurrentSong(song)"
    >
      <Image class="m-2 shadow" :image_filename="song.image_filename"></Image>
      <div class="songinfo d-flex flex-column">
        <span class="name">{{ song.name }}</span>
        <span class="artist">{{ song.artist }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Image from "./Image.vue";

export default {
  name: "Song",
  props: ["song", "currentlyplaying"],
  components: {
    Image,
  },
  data() {
    return {
      ui_active_class: "",
    }
  },
  methods: {
    setCurrentSong(song) {
      this.$emit("changeCurrentSong", song);
    },
  },
  watch: {
    // whenever question changes, this function will run
    currentlyplaying: function (new_song_id) {
      if (new_song_id == this.song.id)
      {
        this.ui_active_class = "currentlyplaying";
      }
      else {
        this.ui_active_class = "";
      }
    }
  },
};
</script>

<style lang="scss">
.song-vue {
  background-color: #242424;
  cursor: pointer;
  max-width: 260px;
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

.currentlyplaying {
  color: #242424;
  background-color: #fff;
}
</style>