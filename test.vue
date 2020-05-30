<template>
  <a-select
    label-in-value
    :default-value="{ key: 'lucy' }"
    style="width: 120px"
    @change="handleChange"
  >
    <a-select-option value="jack">
      Jack (100)
    </a-select-option>
    <a-select-option value="lucy">
      Lucy (101)
    </a-select-option>
  </a-select>
</template>
<script>
export default {
  methods: {
    handleChange(value) {
      console.log(value); // { key: "lucy", label: "Lucy (101)" }
    },
  },
};
</script>
