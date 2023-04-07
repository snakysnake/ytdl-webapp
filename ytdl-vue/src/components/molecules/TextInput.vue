<template>
  <div class="my-3">
    <label class="form-label fw-bold" v-bind:for="inputId">{{ labelText }}</label>
    <input v-if="helpText"
      class="form-control text-center"
      v-bind:aria-describedby="describeId"
      v-bind:placeholder="inputPlaceholder"
      v-bind:type="inputType"
      v-bind:id="inputId"
    />
    <input v-else
      class="form-control text-center"
      v-bind:placeholder="inputPlaceholder"
      v-bind:type="inputType"
      v-bind:id="inputId"
    />
    <template v-if="helpText">
        <div class="form-text"
        v-bind:id="describeId" >
        {{ helpText }}
        </div>
    </template>
  </div>
</template>

<script>
// für die erstellung von unique ids
import uuid from 'uuid';

export default {
  name: 'TextInput',
  // hierauf kann das ui (html) zugreifen
  data() {
    return {
      inputId: this.inputId,
      describeId: this.describeId,
      inputType: this.inputType,
      inputPlaceholder: this.inputPlaceholder,
    };
  },
  // die props die das vue objekt annehmen kann
  props: ['type', 'labelText', 'helpText', 'provided_inputPlaceholder'],
  created() {
    // eine unique id erstellen um id's mit label zu verlinken
    this.inputId = uuid.v4();
    this.describeId = uuid.v4();

    // je nachdem, welcher typ das inputfeld sein soll
    if (this.type === 'email') {
      this.inputType = 'email';
      this.inputPlaceholder = 'email@gmail.com';
    } else if (this.type === 'text') {
      this.inputType = 'text';
      this.inputPlaceholder = 'Text';
    } else if (this.type === 'password') {
      this.inputType = 'password';
      this.inputPlaceholder = 'supersafepassword123';
    }

    // wenn ein inputplaceholder angegeben wird dann greifen wir auf diesen zu
    if (this.provided_inputPlaceholder !== undefined) {
      this.inputPlaceholder = this.provided_inputPlaceholder;
    }
  },
};
</script>
