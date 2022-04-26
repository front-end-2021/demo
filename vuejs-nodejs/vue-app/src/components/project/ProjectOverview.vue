<template>
  <div class="container">
    <div class="row">
        <table class="table caption-top">
        <caption>{{Label}}</caption>
        <thead>
            <tr>
                <th scope="col">{{Head.GroupName}}</th>
                <th scope="col">{{Head.ProjectName}}</th>
                <th scope="col">{{Head.Owner}}</th>
                <th scope="col">{{Head.CreatedDate}}</th>
                <th scope="col">{{Head.ModifiedDate}}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="project in ProjectsView" :key="project.Id">
                <td v-bind:rowspan="project.RowSpan"
                    v-if="project.RowSpan">
                    <div class="d-inline-flex">
                        <div>{{project.ProjectGroupName}}</div>
                        <div class="btn-group">
                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" 
                            aria-haspopup="true" aria-expanded="false"></button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a @click="(e) => { openModelEditProjectGroup(project.ProjectGroupId) }"
                                    data-toggle="modal" v-bind:data-target="'#DnbP_projectGroupModal_Edit' + IdPopup"
                                    class="dropdown-item" href="#" >{{Menu.Edit}}</a>
                                <a class="dropdown-item" href="#">{{Menu.Delete}}</a>
                                <a class="dropdown-item" href="#">{{Menu.NewProject}}</a>
                            </div>
                        </div>
                    </div>
                </td>
                <th scope="row">
                    <div class="d-inline-flex">
                        <div>{{project.Name}}</div>
                        <div class="btn-group">
                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" 
                            aria-haspopup="true" aria-expanded="false"></button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a @click="(e) => { openModelEditProject(project.Id) }"
                                    data-toggle="modal" v-bind:data-target="'#DnbP_projectModal_Edit' + IdPopup"
                                    class="dropdown-item" href="#">{{Menu.Edit}}</a>
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
        @onCloseProjectGroupEdit="closeModelEditProjectGroup"
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
import { getProjectGroups, getProjects } from '../../services/ProjectService';

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
    const thisRef = this;
    getProjectGroups().then(response => {
        thisRef.LstProjectGroup = response.data;
    })
    getProjects().then(response => {
        thisRef.LstProject = response.data;
    })
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
            this.LstProjectGroup.filter(pg => {
                const countP = lstProject.filter(p => { return p.ProjectGroupId == pg.Id }).length;
                rowSpans.push({
                    ProjectGroupId: pg.Id, ProjectGroupName: pg.Name,
                    RowSpan: countP
                })
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
                    }
                }
                Projects.push(p2);
                return true
            })
            return Projects;
        },
        IdPopup(){
            return Date.now()
        }
  },
  methods: {
      openModelEditProjectGroup(projectGroupId) {
          this.ProjectGroupModel.Id = projectGroupId;
          this.ProjectGroupModel.Data = this.getProjectGroup(projectGroupId);
      },
      getProjectGroup(projectGroupId) {
          return this.LstProjectGroup.find(pg => pg.Id == projectGroupId);
      },
     closeModelEditProjectGroup(data) {
          this.ProjectGroupModel.Id = -1;
          $(`#DnbP_projectGroupModal_Edit${this.IdPopup}`).modal('hide')
          if(data != undefined) {     // save and update
            const pg = this.LstProjectGroup.find(_pg => _pg.Id == data.Id);
            if(pg) {
                pg.Name = data.Name;
                pg.ModifiedDate = new Date().toUTCString()
            }
          }
          this.ProjectGroupModel.Data = {}
      },
      openModelEditProject(projectId) {
          this.ProjectModel.Id = projectId;
          this.ProjectModel.Data = this.getProject(projectId);
      },
      getProject(projectId){
          return this.LstProject.find(p => p.Id == projectId)
      },
      closeModelEditProject(data) {
            this.ProjectModel.Id = -1;
            $(`#DnbP_projectModal_Edit${this.IdPopup}`).modal('hide')
            if(typeof data == 'object') {
                const p = this.LstProject.find(_p => _p.Id == data.Id)
                if(p) {
                    p.Name = data.Name;
                    p.ModifiedDate = new Date().toUTCString()
                }
            }
            this.ProjectModel.Data = {}
      },
  },
}
</script>