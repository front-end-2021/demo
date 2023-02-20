**API**
1. Get all Maingoal: http://localhost:8001/api/mains
2. Get all Subgoal: http://localhost:8001/api/subs
3. Get all Action: http://localhost:8001/api/actions
4. Get Main: http://localhost:8001/api/main?id=uuid
5. Get Sub: http://localhost:8001/api/sub?id=uuid
6. Get Action: http://localhost:8001/api/action?id=uuid
7. Add new Maingoal: http://localhost:8001/api/main
    - body: {
        "Name" : "Name Goal",
        ["Description: "Des ...",]
        ["Budget" : 100,]
        ["Start: "20-Feb-2023",]
        ["End: "20-Feb-2023"]
    }
8. Add new Subgoal: http://localhost:8001/api/main
    - body: {
        "Name" : "Name Goal",
        "ParentId" : "(uuid Maingoal)",
        ["Description: "Des ...",]
        ["Budget" : 100,]
        ["Start: "20-Feb-2023",]
        ["End: "20-Feb-2023"]
    }
9. Add new Action: http://localhost:8001/api/action
    - body: {
        "Name" : "Name Action",
        "ParentId" : "(uuid Subgoal)",
        ["Description: "Des ...",]
        ["ExpectCost" : 100,]
        ["TrueCost" : 100,]
        ["Start: "20-Feb-2023",]
        ["End: "20-Feb-2023"]
    }
10. Update Goal: http://localhost:8001/api/goal/(uuid goal)
    - body: {
        "Name" : "Name Goal update",
        ["Description: "Des update ..",]
        ["Budget" : 100,]
        ["Start: "20-Feb-2023",]
        ["End: "20-Feb-2023"]
    }
11. Add new Action: http://localhost:8001/api/action/(uuid action)
    - body: {
        "Name" : "Name Action update",
        "ParentId" : "(uuid Subgoal)",
        ["Description: "Des update ...",]
        ["ExpectCost" : 100,]
        ["TrueCost" : 100,]
        ["Start: "20-Feb-2023",]
        ["End: "20-Feb-2023"]
    }