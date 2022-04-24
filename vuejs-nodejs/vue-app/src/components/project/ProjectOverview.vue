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
                    v-if="project.RowSpan">{{project.ProjectGroupName}}</td>
                <th scope="row">{{project.Name}}</th>
                <td>{{project.PriorityGroupName}}</td>
                <td>{{project.CreatedDate}}</td>
                <td>{{project.ModifiedDate}}</td>
            </tr>
        </tbody>
        </table>
    </div>
  </div>
</template>

<script>
import { getProjectGroups, getProjects } from '../../services/ProjectService';

export default {
  name: 'ProjectOverview',
  data() {
    return {
        LstProjectGroup: [],
        LstProject: [],
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
        }
  },
  methods: {
      addProjectGroup() {

      },
      getProjectsFrom(projectGroupId) {
          return this.LstProject.filter(p => p.ProjectGroupId == projectGroupId);
      }
  }
}
</script>