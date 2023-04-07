<template>
  <div class="container-sm h-100 align-items-center">
    <form class="" @submit="sendIt" @submit.prevent="onSubmit">
      <img class="mb-4" src="./../assets/logo.png" alt="" width="72" height="72" />
      <div v-if="mode == 'login'">
        <button class="btn btn-danger mb-3" type="button" @click="mode = 'reg'">
          To Register
        </button>
        <h1 class="h3 mb-3 fw-normal">To Login</h1>
      </div>
      <div v-else>
        <button class="btn btn-danger mb-3" @click="mode = 'login'">Login</button>
        <h1 class="h3 mb-3 fw-normal">Register</h1>
      </div>
      <div class="form-floating m-2">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="ui_username"
        />
        <label for="floatingInput">Username</label>
      </div>
      <div class="form-floating m-2">
        <input
          type="password"
          class="form-control"
          id="floatingPassword"
          placeholder="Password"
          v-model="ui_password"
        />
        <label for="floatingPassword">Password</label>
      </div>
      <div v-if="mode == 'reg'" class="form-floating m-2">
        <input
          type="text"
          class="form-control"
          id="floatingInputx"
          placeholder="your_secret"
          v-model="secret"
        />
        <label for="floatingInputx">Creation Secret</label>
      </div>
      <div v-if="mode == 'reg'" class="form-floating m-2">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="myemail@gmail.com"
          v-model="email"
        />
        <label for="email">Email</label>
      </div>

      <div class="checkbox mb-3">
        <label class="text-white mx-2">
          <input type="checkbox" class="m-2" value="remember-me" required />I look fresh
        </label>
      </div>
      <div class="p-2 w-100">
        <button class="w-100 btn btn-lg btn-danger" type="submit">Lets go</button>
      </div>
      <p class="mt-5 mb-3 text-muted">© Copy & Paste Inc 2k22</p>
    </form>
  </div>
</template>

<style lang="scss" scoped>
label {
  color: #242424;
}
</style>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      mode: "login",
      ui_password: "",
      ui_username: "",
      secret: "",
      email: "",
    };
  },
  methods: {
    sendIt() {
      if (this.mode == "reg") {
        this.register();
      } else {
        this.login();
      }
    },
    login() {
      axios
        .post(process.env.VUE_APP_EXPRESS_SERVER + "login", {
          name: this.ui_username,
          password: this.ui_password,
        })
        .then((res) => this.setLoginCredentials(res.data))
        .catch((err) => {
          console.log(err);
          alert("Login did not work, unfortunately..");
        });
    },
    register() {
      axios
        .post(process.env.VUE_APP_EXPRESS_SERVER + "createuser", {
          name: this.ui_username,
          password: this.ui_password,
          email: this.email,
          keytocreateuser: this.secret,
        })
        .then((res) => {
          console.log(res);
          alert("Should work. Please press Ok.");
          this.mode = "login";
          this.login();
        })
        .catch((err) => {
          console.log(err);
          alert(
            "Unfortunately this did not work. Most likely your Creation Secret is incorrect."
          );
        });
    },
    setLoginCredentials(res) {
      if (res === "0") {
        console.log("Nope das hat nicht geklappt");
      } else {
        document.cookie = "publickey=" + res;
        this.$emit("toggleAuth");
      }
    },
  },
};
</script>
