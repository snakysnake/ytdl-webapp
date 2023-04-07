<template>
  <form class="d-flex my-2" @submit.prevent="searchSongs">
    <input
      class="form-control me-2"
      type="search"
      placeholder="Musik durchsuchen"
      aria-label="Suchen"
      autocomplete="off"
      @change="searchSongs()"
      v-model="song_search_input"
    />
    <input
      type="button"
      class="btn btn-outline-white"
      @click="searchSongsButtonClick"
      :value="ui_button_text"
    />
  </form>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import axios from "axios";

export default {
  name: "SearchSong",
  data() {
    return {
      song_search_input: "",
      ui_button_text: "Suchen",
    };
  },
  methods: {
    searchSongsButtonClick() {
      if (this.song_search_input.length > 0) {
        this.searchSongs(true);
        this.song_search_input = "";
      }
    },
    searchSongs(fakeSearch = false) {
      console.log("Searching songs that match: " + this.song_search_input);
      if (!fakeSearch) {
        console.log("Not a fake search");
        axios
          .post(process.env.VUE_APP_EXPRESS_SERVER + "lookforsong", {
            name: this.song_search_input,
            publickey: this.getCookie("publickey"),
          })
          .then((res) => this.changeSongs(res.data))
          .catch((err) => console.log(err));
      } else {
        console.log("Fake search");
        axios
          .post(process.env.VUE_APP_EXPRESS_SERVER + "lookforsong", {
            publickey: this.getCookie("publickey"),
          })
          .then((res) => this.changeSongs(res.data))
          .catch((err) => console.log(err));
      }
    },
    changeSongs(songs) {
      this.$emit("changeSongs", songs);
    },
    getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (var c of ca) {
        while (c.charAt(0) == " ") {
          c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
  },
  watch: {
    song_search_input(newVal, oldVal) {
      console.log("New: " + newVal + "// Old: " + oldVal);
      if (newVal.length > 0) {
        this.ui_button_text = "Reset";
      } else {
        this.ui_button_text = "Suchen";
      }
      this.searchSongs();
    },
  },
};
</script>

<style lang="scss"></style>
