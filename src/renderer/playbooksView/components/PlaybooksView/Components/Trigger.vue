<template lang="pug">
el-row.handle
  el-col
    .blockelem.create-flowy
      .blockin
        slot(name="icon")
          i.blockico.el-icon-menu
        .blocktext
          slot(name="title")
            .blocktitle {{ "New visitor" }}
          slot(name="desc")
            .blockdesc {{ "Triggers when somebody visits a specified page" }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Col, Row } from 'element-ui';

@Component({
  components: {
    'el-col': Col,
    'el-row': Row,
  },
})
export default class Trigger extends Vue {
}
</script>

<style lang="less" scoped>
@import '../../../css/flowy.min.css';
@import '../../../css/styles.css';

.handle {
  z-index: 9999;
}
</style>
