<template>
  <div
    class="modal fade"
    :id="id"
    tabindex="-1"
    :aria-labelledby="id + 'Label'"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <form class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="id + 'Label'">Song info ändern</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Hier kannst du einen falsch benannten Song updaten 😇</p>
          <div class="mb-3">
            <label for="new_song_name" class="form-label"
              >Name: </label
            >
            <input
              type="text"
              class="form-control"
              id="new_song_name"
              v-model="ui_new_song_name"
            />
          </div>
          <div>
            <label for="new_song_artist" class="form-label"
              >Artist: </label
            >
            <input
              type="text"
              class="form-control"
              id="new_song_artist"
              v-model="ui_new_song_artist"
            />
          </div>
          <div class="form-text">
            {{ ui_update_status }}
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Zurück
          </button>
          <button
            type="button"
            @click="updateSongInformation()"
            class="btn btn-danger"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-content {
  background-color: #242424 !important;
}
</style>

<script>
import axios from "axios";

export default {
  name: "Modal",
  components: {},
  data() {
    return {
      ui_new_song_name: "",
      ui_new_song_artist: "",
      ui_update_status: "Trau dich die Info zu ändern",
    };
  },
  props: ["id", "song"],
  methods: {
    // funktion um manuell song info an den server zu schicken, um es dort dann anzupassen
    updateSongInformation() {
      console.log(this.song.id, this.ui_new_song_name, this.ui_new_song_artist);
      axios
        .post(process.env("EXPRESS_SERVER") + "updatedownloadedsong", {
          id: this.song.id,
          name: this.ui_new_song_name,
          artist: this.ui_new_song_artist,
        })
        .then((res) => {
          if (res.data == "1") {
            this.ui_update_status = "Erfolgreich Song Informationen geändert!";
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>