import React from "react"

const MainContainer = {
    IsExpand: true,
    ExpectCost: 0,
    TrueCost: 0,
    ListChild: [],
    NewChild: null
}
const MainItem = {
    Id: '',
    Name: '',
    Description: '',
    IsDone: false,
    Start: null,
    End: null,
    Budget: 0,

    OpenCost: 0 // = Budget - ExpectCost    
}