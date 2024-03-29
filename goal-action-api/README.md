**API**
1. Get all Maingoal: [get .../api/mains](http://localhost:8001/api/mains)
2. Get all Subgoal: [get .../api/allsub](http://localhost:8001/api/allsub)
3. Get all Action: [get .../api/allaction](http://localhost:8001/api/allaction)
4. Get Main by Id:[get .../api/main?id=](http://localhost:8001/api/main?id=uuid)
5. Get Sub: [get .../api/sub?id=](http://localhost:8001/api/sub?id=uuid)
6. Get Action: [get .../api/action?id=](http://localhost:8001/api/action?id=uuid)
7. Add new Maingoal: [post .../api/main](http://localhost:8001/api/main)
    - body: <code>{ <br/>
        &nbsp; "Name" : "Name Goal", <br/>
        &nbsp; ["Description: "Des ...",] <br/>
        &nbsp; ["Budget" : 100,] <br/>
        &nbsp; ["Start: "20-Feb-2023",] <br/>
        &nbsp; ["End: "20-Feb-2023"] <br/>
    }</code>
8. Add new Subgoal: [post .../api/sub](http://localhost:8001/api/sub)
    - body: <code>{<br/>
        &nbsp; "Name" : "Name Goal", <br/>
        &nbsp; "ParentId" : "(uuid Maingoal)", <br/>
        &nbsp; ["Description: "Des ...",] <br/>
        &nbsp; ["Budget" : 100,] <br/>
        &nbsp; ["Start: "20-Feb-2023",] <br/>
        &nbsp; ["End: "20-Feb-2023"] <br/>
    }</code>
9. Add new Action: [post .../api/action](http://localhost:8001/api/action)
    - body: <code>{ <br/>
        &nbsp; "Name" : "Name Action", <br/>
        &nbsp; "ParentId" : "(uuid Subgoal)", <br/>
        &nbsp; ["Description: "Des ...",] <br/>
        &nbsp; ["ExpectCost" : 100,] <br/>
        &nbsp; ["TrueCost" : 100,] <br/>
        &nbsp; ["Start: "20-Feb-2023",] <br/>
        &nbsp; ["End: "20-Feb-2023"] <br/>
    }</code>
10. Update Goal: [put .../api/goal/:id](http://localhost:8001/api/goal/uuid)
    - body: <code>{<br/>
       &nbsp; "Name" : "Name Goal update", <br/>
       &nbsp; ["Description: "Des update ..",] <br/>
       &nbsp; ["Budget" : 100,] <br/>
       &nbsp; ["Start: "20-Feb-2023",] <br/>
       &nbsp; ["End: "20-Feb-2023"] <br/>
    }
    </code>
11. Update Action: [put ...api/action/:id](http://localhost:8001/api/action/uuid)
    - body: <code>    {<br/>
       &nbsp; "Name" : "Name Action update", <br/>
       &nbsp; "ParentId" : "(uuid Subgoal)", <br/>
       &nbsp; ["Description: "Des update ...",] <br/>
       &nbsp; ["ExpectCost" : 100,] <br/>
       &nbsp; ["TrueCost" : 100,] <br/>
       &nbsp; ["Start: "20-Feb-2023",] <br/>
       &nbsp; ["End: "20-Feb-2023"] <br/>
    }    </code>
12. Get Actions by SubId: [get .../api/actions?subid=](http://localhost:8001/api/actions?subid=uuid)
13. Get Subs by MainId: [get .../api/subs?mainid=](http://localhost:8001/api/subs?mainid=uuid)
14. Duplicate Sub: [post .../api/copysub](http://localhost:8001/api/copysub)
    - body: <code>{<br/>
        &nbsp; "Name" : "Name Goal", <br/>
        &nbsp; "ParentId" : "(uuid Maingoal)", <br/>
        &nbsp; ["Description: "Des ...",] <br/>
        &nbsp; ["Budget" : 100,] <br/>
        &nbsp; ["Start: "20-Feb-2023",] <br/>
        &nbsp; ["End: "20-Feb-2023"] <br/>
    }</code>
15. Duplicate Action = Insert Action
16. Delete Main: [delete .../api/main/:id](http://localhost:8001/api/main/uuid)
17. Delete Sub: [delete .../api/sub/:id](http://localhost:8001/api/sub/uuid)
17. Delete Action: [delete .../api/action/:id](http://localhost:8001/api/action/uuid)

# Dockerlization
1. Existed: Dockerfile
2. Build image: ```docker build -t goal-action-api .```
3. Run container: ```docker run -dp 8001:8001 goal-action-api```

# Persist Data
1. Create volume: ```docker volume create marketing-db```
2. Run container: ```docker run -dp 8001:8001 --mount type=volume,src=marketing-db,target=/database goal-action-api```
3. meta info: ```docker volume inspect marketing-db```