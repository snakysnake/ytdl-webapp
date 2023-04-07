<template>
  <div id="app" class="d-flex flex-column h-100">
    <template v-if="ui_loggedIn">
      <Navbar v-on:changeSongs="updateSongs"></Navbar>
      <body class="">
        <div class="d-flex flex-column h-100">
          <h1>Youtube Bootleg</h1>
          <div class="d-flex justify-content-evenly">
            <button type="button" class="btn btn-danger" @click="shuffle(ui_songs)">
              Shuffle Songs
            </button>
            <DownloadSong class="mb-3"></DownloadSong>
          </div>
          <Songs :songs="ui_songs" v-on:changeCurrentSong="changeCurrentSong"></Songs>
        </div>
      </body>
      <Footer :song="ui_current_song"></Footer>
    </template>
    <template v-else>
      <Login v-on:toggleAuth="toggleAuth"></Login>
    </template>
    <Modal :id="ui_change_song_modal_id" :song="ui_current_song"> </Modal>
  </div>
</template>

<style></style>

//
<script>
import axios from "axios";
import Navbar from "./components/Navbar.vue";
import Songs from "./components/Songs.vue";
import DownloadSong from "./components/DownloadSong.vue";
import Footer from "./components/Footer.vue";
import Login from "./components/Login.vue";
import Modal from "./components/Modal.vue";
// import bootstrap from "./assets/js/bootstrap.bundle.min.js";

// require("./assets/js/bootstrap.bundle.min.js");

export default {
  name: "App",
  components: {
    Navbar,
    Songs,
    Footer,
    DownloadSong,
    Login,
    Modal,
  },
  data() {
    return {
      ui_songs: this.songs,
      ui_current_song: "",
      ui_loggedIn: false,
      background_click_count_for_same_song: 0,
      background_latest_clicked_songid: 0,
      ui_change_song_modal_id: "changeSongInfo",
    };
  },
  //   created() {
  //     this.initialize();
  //     document.title = "Bootleg";
  //   },
  methods: {
    setRandomSong() {
      this.setCurrentSong(this.ui_songs[0]);
    },
    setCurrentSong(song) {
      console.log(song);
      this.ui_current_song = song;
    },
    updateSongs(new_songs) {
      if (new_songs !== "0") {
        this.ui_songs = new_songs;
      }
    },
    // shuffle an array
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    initialize() {
      console.log("Initializing...");
      if (this.getCookie("publickey").length > 0) {
        console.log("Cookie found 🍪");
        // toggle login
        this.ui_loggedIn = true;
        axios
          .post(process.env.VUE_APP_EXPRESS_SERVER + "lookforsong", {
            publickey: this.getCookie("publickey"),
          })
          .then((res) => {
            if (res.data == "0") {
              // most likely cookie is outdated, delete it so the user has to login again
              document.cookie = "publickey=";
            } else {
              this.updateSongs(res.data);
            }
          })
          .catch((err) => console.log(err));

        return true;
      } else {
        console.log("Cookie not found");
        return false;
      }
    },
    changeCurrentSong(song) {
      console.log("Changing current song... to song " + song.id);
      document.title = song.name + " - " + song.artist;

      if (this.background_latest_clicked_songid !== song.id) {
        this.background_click_count_for_same_song = 0;
        this.background_latest_clicked_songid = song.id;
      }

      this.background_click_count_for_same_song++;

      if (this.background_click_count_for_same_song == 5) {
        // manually update song information
        // var myModal = new bootstrap.Modal(
        //   document.getElementById(this.ui_change_song_modal_id),
        //   {
        //     keyboard: false,
        //   }
        // );
        // myModal.show();
      }
      if (this.background_click_count_for_same_song == 15) {
        console.log(
          "Dadurch das du 7x auf denselben Song geklickt hast... :'Making (SongID: " +
            song.id +
            ") downloadable again!'"
        );
        this.makeSongDownloadableAgain(song.id);
      }
      this.ui_current_song = song;
    },
    // makeSongDownloadableAgain(songid) {
    //   axios
    //     .post(process.env.EXPRESS_SERVER + "makeSongAvailableForDownload", {
    //       id: songid,
    //     })
    //     .then(alert("Erfolgreich (SongID: " + songid + ") zum download freigegeben!"))
    //     .catch((err) => console.log(err));
    // },
    toggleAuth() {
      console.log("Toggle Auth called");
      this.ui_loggedIn = !this.ui_loggedIn;

      if (this.ui_loggedIn) {
        console.log("User logged in, loading UI");
        if (!this.initialize()) {
          console.log("Cookie not set, loading UI again");
          // location.reload();
        }
      }
    },
    getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      let n = 0;
      for (var c of ca) {
        n++;
        console.log("Inside a loop");
        while (c.charAt(0) == " ") {
          n++;
          if (n > 1000) {
            throw new Error("If there is a space inside this cookie, you'd be f**ked without this precaution haha.. i was there!");
          }
          console.log("Inside a loop, inside a loop");
          c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
  },
};
</script>

<style lang="scss">
@import "./scss/main.scss";
</style>
