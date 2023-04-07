<template>
  <footer class="footer mt-auto py-3 w-100">
    <div class="container-lg">
      <Musicplayer :song="song"></Musicplayer>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  position: fixed;
  bottom: 0;
  z-index: 9;
  color: white;
  background-color: #242424;
}
</style>

<script>
import Musicplayer from "./Musicplayer";

export default {
  name: "Footer",
  props: ["song"],
  components: {
    Musicplayer,
  },
};
</script>