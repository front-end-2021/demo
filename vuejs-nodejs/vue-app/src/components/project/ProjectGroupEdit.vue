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
                <div class="input-group mb-3" v-if="!Label.IsDelete">
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
// element nay duoc bind va khong bi destroy (do su dung model cua bootstrap5)
export default {
  name: 'ProjectGroupEdit',
  props: ['item'],
  data() {
      
    return {
        Data: {}
    }
  },
  computed: {
      Label(){
          var tlt = 'Create Project group'
          var lbl = `Name of project group`
          if(this.item.Id > 0) tlt = `Edit ${this.item.Name}`
          if(this.item.Id < 0) {
              tlt = 'Delete Project group'
              lbl = `Delete ${this.item.Name}?`
            }
          return {
              IsDelete: this.item.Id < 0,
              Title: tlt,
              Save: 'Save and Close',
              Name: lbl
          }
      },
      TagId(){
          const dateNow = Date.now();
          return {
              LabelName: `project-group-name_${dateNow}`,
              LabelTitle: `project-group-tlt_${dateNow}`
          }
      }
  },
  watch: {
    item(newItem) {         // dung ham nay vi item duoc set o ProjectOverview.vue
      const model = JSON.parse(JSON.stringify(newItem))
      this.Data = model     // can update lai Data de hien thi dung
    }
  },
  methods: {
      saveAndClose() {
        if(this.hasChanges() || this.Label.IsDelete)
            this.$emit('onCloseProjectGroupEdit', this.Data);
        else 
            this.onClose()
      },
      onClose() {
          this.$emit('onCloseProjectGroupEdit', undefined);
      },
      hasChanges(){
          const k1 = this.item;
          const k2 = this.Data;
          return JSON.stringify(k1) != JSON.stringify(k2);
      }
  }
}
</script>