<template>
  <div>
    <h4>{{ message }}</h4>
    <ul>
      <li>Object: {{ obj }} </li>
      <li>Number: {{ num }} </li>
      <li>Array: {{ arr }} </li>
      <li>String: {{ str }} </li>
    </ul>
    </div>
</template>

<script>
export default {
  props: ['obj', 'arr', 'num', 'str'],
  data: function () {
    return {
      message: 'Hello, Vue and Turbolinks'
    }
  }
}
</script>

<style scoped>
h4 {
  font-size: 2em;
  text-align: center;
  color: steelblue;
}
</style>