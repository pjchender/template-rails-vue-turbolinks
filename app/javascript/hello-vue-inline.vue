<script>
export default {
  props: ['obj', 'arr', 'num', 'str'],
  data: function () {
    return {
      message: 'Hello, Vue in inline-template.'
    }
  }
}
</script>

<style scoped>
h4 {
  font-size: 2em;
  text-align: center;
  color: purple;
}
</style>