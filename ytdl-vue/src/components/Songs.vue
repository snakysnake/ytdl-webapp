<template>
  <div class="m-3 songs-vue">
    <div class="d-flex flex-wrap justify-content-center">
      <div v-bind:key="song.id" v-for="song in songs">
        <Song :song="song" :currentlyplaying="currently_playing_id" v-on:changeCurrentSong="changeCurrentSong"></Song>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.songs-vue {
    padding-bottom: 120px;
}
</style>

<script>
import Song from "./Song.vue";

export default {
  name: "Songs",
  props: ["songs"],
  components: {
    Song,
  },
  data() {
    return {
      currently_playing_id: 0,
    };
  },
  methods: {
    updateSongs(songs) {
      this.ui_songs = songs;
    },
    changeCurrentSong(song) {
      this.currently_playing_id = song.id;
      this.$emit('changeCurrentSong', song);
    }
  },
};
</script>
