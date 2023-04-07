<template>
    <nav class="navbar shadow">
        <div class="container-sm justify-content-evenly">
            <a class="navbar-brand">
                <img src="./../assets/bootleg_logo.png" alt="Youtube Bootleg" width="145" height="30">
            </a>
            <SearchSongs v-on:changeSongs="sendToApp"></SearchSongs>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
.navbar {
  background-color: #242424;
}
</style>

<script>
import SearchSongs from './SearchSongs.vue';

export default {
  name: 'Navbar',
  components: {
    SearchSongs,
  },
  methods: {
    sendToApp(songs)
    {
      this.$emit('changeSongs', songs);
    }
  }
}
</script>