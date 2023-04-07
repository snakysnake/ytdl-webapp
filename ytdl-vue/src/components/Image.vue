<template>
  <div class="d-flex justify-content-center">
    <div class="vue-image d-flex justify-content-center">
      <img v-bind:src="loadImage(image_filename)" alt="Bild Song" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.vue-image {
  width: 200px;
  height: 200px;
  overflow: hidden;

  img {
    text-align: center;
    width: auto;
    height: 100%;
  }
}
</style>

<script>
export default {
  name: "Image",
  props: ["image_filename"],
  methods: {
    loadImage(image) {
      try {
        // for debugging: return require("@/assets/music_thumbnails/" + image);
        return process.env.VUE_APP_EXPRESS_SERVER +  "music_thumbnails/" + image;
      } catch (e) {
        console.log("Bild nicht gefunden");
      }
    },
  },
};
</script>