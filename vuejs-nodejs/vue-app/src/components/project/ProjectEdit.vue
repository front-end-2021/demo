<template>
    <div class="modal fade" tabindex="-1" role="dialog" 
    v-bind:aria-labelledby="Label.Title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" v-bind:id="TagId.LabelTitle">{{Label.Title}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" @click="onClose">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label v-bind:for="TagId.LabelName">{{Label.Name}}</label>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" 
                        v-model="Data.Name"
                        v-bind:id="TagId.LabelName" 
                        aria-describedby="basic-addon3">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary"
                    @click="saveAndClose">{{Label.Save}}</button>
            </div>
        </div>
    </div>
    </div>
</template>

<script>

export default {
  name: 'ProjectEdit',
  props: ['item'],
  data() {
    return { Data: {} }
  },
  computed: {
      Label(){
          const pgName = this.item.Name ? `Edit ${this.item.Name}` : '';
          return {
              Title: pgName,
              Save: 'Save and Close',
              Name: `Name of project`
          }
      },
      TagId(){
          const dateNow = Date.now();
          return {
              LabelName: `project-name_${dateNow}`,
              LabelTitle: `project-tlt_${dateNow}`
          }
      }
  },
  watch: {
    item(newItem) {
      const model = JSON.parse(JSON.stringify(newItem))
      this.Data = model;
    }
  },
  methods: {
      saveAndClose() {
        if(this.hasChanges() && this.Data.Name.trim() != '')
            this.$emit('onCloseProjectEdit', this.Data);
        else 
            this.onClose()
      },
      onClose() {
          this.$emit('onCloseProjectEdit', undefined);
      },
      hasChanges(){
          const k1 = this.item;
          const k2 = this.Data;
          return JSON.stringify(k1) != JSON.stringify(k2);
      }
  }
}
</script>