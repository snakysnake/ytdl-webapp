<template>
  <div class="">
    <button
      type="button"
      class="btn btn-danger"
      data-bs-toggle="modal"
      data-bs-target="#downloadModal"
    >
      Download
    </button>
    <div
      class="modal fade"
      id="downloadModal"
      tabindex="-1"
      aria-labelledby="downloadModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <form class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="downloadModalLabel">
              Song runterladen
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="downloadInput" class="form-label"
                >Download Link</label
              >
              <input
                type="url"
                class="form-control"
                id="downloadInput"
                aria-describedby="songHelp"
                v-model="song_link"
              />
              <div id="songHelp" class="form-text">
                {{ ui_download_request_response }}
              </div>
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
              @click="submitDownloadSong()"
              class="btn btn-danger"
            >
              Download
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DownloadSong",
  components: {
  },
  data() {
    return {
      song_link: "",
      ui_download_request_response: "",
    };
  },
  created() {
    this.ui_download_request_response = "Das bleibt unser kleines Geheimnis";
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    submitDownloadSong() {
      if (this.song_link === "") {
        this.ui_download_request_response =
          "Wie wärs wenn du versuchst was einzutippen?";
      } else {
        axios
          .post(process.env.VUE_APP_EXPRESS_SERVER + "download", {
            link: this.song_link,
          })
          .then((res) => this.respondToDownloadRequest(res.data))
          .catch((err) => console.log(err));
      }
    },
    async respondToDownloadRequest(response) {
      if (response === "0") {
        this.ui_download_request_response = "Das hat leider nicht geklappt";
      } else {
        this.ui_download_request_response =
          "Erfolgreich Song zum Download freigegeben!";
        this.song_link = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  background-color: #242424 !important;
}
</style>