<template>
  <div class="container">
    <div class="row">
        <table class="table caption-top">
        <caption>{{Label}}</caption>
        <thead>
            <tr>
                <th scope="col">
                    <span>{{Head.GroupName}}</span>
                    <a @click="openAddNewProjectGroup"
                    data-toggle="modal" 
                    v-bind:data-target="'#DnbP_projectGroupModal_Edit' + IdPopup"
                    class="btn"><strong>+</strong></a>
                </th>
                <th scope="col">{{Head.ProjectName}}</th>
                <th scope="col">{{Head.Owner}}</th>
                <th scope="col">{{Head.CreatedDate}}</th>
                <th scope="col">{{Head.ModifiedDate}}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="project in ProjectsView" :key="'projectgroup' + project.ProjectGroupId + 'project' + project.Id">
                <td v-bind:rowspan="project.RowSpan"
                    v-if="project.RowSpan">
                    <div class="d-inline-flex">
                        <div>{{project.ProjectGroupName}}</div>
                        <div class="btn-group">
                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" 
                            aria-haspopup="true" aria-expanded="false"></button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a @click="(e) => { openModelEditProjectGroup(project.ProjectGroupId) }"
                                    v-bind:data-target="'#DnbP_projectGroupModal_Edit' + IdPopup"
                                    data-toggle="modal" class="dropdown-item" href="#" >{{Menu.Edit}}</a>
                                <a @click="(e) => { openModelDeleteProjectGroup(project.ProjectGroupId) }"
                                    v-bind:data-target="'#DnbP_projectGroupModal_Edit' + IdPopup"
                                    data-toggle="modal" class="dropdown-item" href="#">{{Menu.Delete}}</a>
                                <a class="dropdown-item" href="#">{{Menu.NewProject}}</a>
                            </div>
                        </div>
                    </div>
                </td>
                <th scope="row">
                    <div class="d-inline-flex">
                        <div>{{project.Name}}</div>
                        <div v-if="project.Name" class="btn-group">
                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" 
                            aria-haspopup="true" aria-expanded="false"></button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a @click="(e) => { openModelEditProject(project.Id) }"
                                    v-bind:data-target="'#DnbP_projectModal_Edit' + IdPopup"
                                    data-toggle="modal" class="dropdown-item" href="#">{{Menu.Edit}}</a>
                                <a class="dropdown-item" href="#">{{Menu.Delete}}</a>
                            </div>
                        </div>
                    </div>
                </th>
                <td>{{project.PriorityGroupName}}</td>
                <td>{{project.CreatedDate}}</td>
                <td>{{project.ModifiedDate}}</td>
            </tr>
        </tbody>
        </table>
    </div>
    <ProjectGroupEdit v-bind:id="'DnbP_projectGroupModal_Edit' + IdPopup"
        @onCloseProjectGroupEdit="onCloseProjectGroupEdit"
        :item="ProjectGroupModel.Data" />
    <ProjectEdit v-bind:id="'DnbP_projectModal_Edit' + IdPopup"
        @onCloseProjectEdit="closeModelEditProject"
        :item="ProjectModel.Data"/>
  </div>
</template>

<script>
import $ from "jquery";
import ProjectGroupEdit from './ProjectGroupEdit.vue'
import ProjectEdit from './ProjectEdit.vue'
import { getProjectGroups, getProjects, deleteProjectGroup,
        createProjectGroup, editProjectGroup } from '../../services/ProjectService';
import { getDate, toString } from '../../common/global';

export default {
  name: 'ProjectOverview',
  components: {
    ProjectGroupEdit, ProjectEdit
  },
  data() {
    return {
        LstProjectGroup: [],
        LstProject: [],
        ProjectGroupModel: { Id: -1, Data: {}},
        ProjectModel: { Id: -1, Data: {}},
    }
  },
  mounted () {
    this.getDataApi()
  },
  computed: {
      Menu(){
          return {
              Edit: 'Edit', Delete: 'Delete', NewProject: 'Create new Project'
          }
      },
      Label(){ return 'Project overview'},
      Head() {
            const groupName = 'Group name'
            const projectName = 'Project name'
            const owner = 'Owner'
            const createdDate = 'Date created'
            const modifiedDate = 'Date modified'
            return {
                GroupName: groupName, ProjectName: projectName, Owner: owner, CreatedDate: createdDate, ModifiedDate: modifiedDate
            }
        },
        ProjectsView() {
            const rowSpans = []
            const lstProject = this.LstProject;
            const lstProjectGroup = this.LstProjectGroup;
            lstProjectGroup.filter(pg => {
                const countP = lstProject.filter(p => { return p.ProjectGroupId == pg.Id }).length;
                rowSpans.push({
                    ProjectGroupId: pg.Id, ProjectGroupName: pg.Name,
                    RowSpan: countP
                })
                return true;
            })

            var fIndexPg = -1;
            const Projects = [];
            lstProject.filter((p) => {
                const p2 = JSON.parse(JSON.stringify(p));
                if(fIndexPg != p.ProjectGroupId) {
                    fIndexPg = p.ProjectGroupId;
                    const r2 = rowSpans.find(r => r.ProjectGroupId == p.ProjectGroupId)
                    if(r2) {
                        p2.RowSpan = r2.RowSpan;
                        p2.ProjectGroupName = r2.ProjectGroupName;
                        p2.ProjectGroupId = fIndexPg
                    }
                }
                Projects.push(p2);
                return true
            })
            rowSpans.filter(r => r.RowSpan < 1).forEach(rs => {
                const p = lstProjectGroup.find(pg => rs.ProjectGroupId == pg.Id);
                if(p) {
                    const name = p.Name;
                    const p2 = JSON.parse(JSON.stringify(p))
                    p2.ProjectGroupName = name;
                    p2.Name = undefined;
                    p2.RowSpan = 1;
                    p2.ProjectGroupId = p.Id;
                    p2.Id = 0;
                    Projects.push(p2);
                }
            })

            return Projects;
        },
        IdPopup(){
            return Date.now()
        }
  },
  methods: {
      getDataApi(){
            const thisRef = this;
            getProjectGroups().then(response => {
                response.data.forEach(pg => {
                    var d = pg.CreatedDate
                    d = getDate(d)
                    pg.CreatedDate = toString(d, 'dd-MM-YYYY')
                    
                    d = pg.ModifiedDate
                    d = getDate(d, true)
                    pg.ModifiedDate = toString(d, 'dd-MM-YYYY')
                })
                thisRef.LstProjectGroup = response.data
            })
            getProjects().then(response => {
                response.data.forEach(p => {
                    var d = p.CreatedDate
                    d = getDate(d)
                    p.CreatedDate = toString(d)

                    d = p.ModifiedDate
                    d = getDate(d, true)
                    p.ModifiedDate = toString(d, 'dd-MM-YYYY')
                })
                thisRef.LstProject = response.data
            })
      },
      openModelEditProjectGroup(projectGroupId) {
          this.ProjectGroupModel.Id = projectGroupId
          this.ProjectGroupModel.Data = this.getProjectGroup(projectGroupId)
      },
      openModelDeleteProjectGroup(projectGroupId) {
          this.ProjectGroupModel.Id = projectGroupId
          const pg = this.getProjectGroup(projectGroupId)
          this.ProjectGroupModel.Data = { Id: -1, Name: pg.Name }
      },
      getProjectGroup(projectGroupId) {
          return this.LstProjectGroup.find(pg => pg.Id == projectGroupId)
      },
      onCloseProjectGroupEdit(data) {
          $(`#DnbP_projectGroupModal_Edit${this.IdPopup}`).modal('hide')
          if(data != undefined) {       // save and update (saveAndClose)
          const pg = this.LstProjectGroup.find(_pg => _pg.Id == data.Id);
          const thisRef = this
            if(this.ProjectGroupModel.Id > 0 && !pg){       // DELETE
                deleteProjectGroup(this.ProjectGroupModel.Id).then(resp => {
                    console.log('deleteProjectGroup: ', resp)
                    if(resp.data.Status == 1)       // global.DbStatus.Success
                        thisRef.getDataApi()
                })
            } else {
                if(pg) {                                    // EDIT
                    pg.ModifiedBy = 1             // hardcode
                    pg.Name = data.Name
                    editProjectGroup(pg)
                } else {                                    // CREATE
                    data.CreatedBy = 1             // hardcode
                    data.Id = 0                    // hardcode
                    createProjectGroup(data).then((rs) => {
                        console.log('createProjectGroup: ', rs)
                        if(rs.data.Status == 1)       // global.DbStatus.Success
                            thisRef.getDataApi()
                    })
                }
            }
          }
          this.ProjectGroupModel.Id = -1
          this.ProjectGroupModel.Data = {}
      },
      openModelEditProject(projectId) {
          this.ProjectModel.Id = projectId
          this.ProjectModel.Data = this.getProject(projectId)
      },
      getProject(projectId) {
          return this.LstProject.find(p => p.Id == projectId)
      },
      closeModelEditProject(data) {
            this.ProjectModel.Id = -1
            $(`#DnbP_projectModal_Edit${this.IdPopup}`).modal('hide')
            if(typeof data == 'object') {
                const p = this.LstProject.find(_p => _p.Id == data.Id)
                if(p) {
                    p.Name = data.Name
                    p.ModifiedDate = new Date().toUTCString()
                }
            }
            this.ProjectModel.Data = {}
      },
      openAddNewProjectGroup() {
            this.ProjectGroupModel.Id = 0
            this.ProjectGroupModel.Data = {Name: '', Id: 0}
      },
  },
}
</script>