<template>
  <a-modal :visible="visible">
    <a-carousel autoplay>
      <img v-for="item in dataListPre" :key="item.url" :src="item.url" :alt="item.url" />
    </a-carousel>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  }
}
</script>

<style>
</style>
