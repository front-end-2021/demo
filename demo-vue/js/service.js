const msRoadmap = {
    getService: function(){
        function getMaingoals () {
            return [
                {Id: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea5', TypeId: 1, Name: 'Main goal 1', MIndex: 1},
                {Id: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea9', TypeId: 1, Name: 'Main goal 2', MIndex: 2},
                {Id: '5cab2f37-f50e-1b3e-8c3f-a88a75284ea9', TypeId: 1, Name: 'Main goal 3', MIndex: 3},
                {Id: '5cab2f37-f50e-2b3e-8c2f-a88a75284ea9', TypeId: 1, Name: 'Main goal 4', MIndex: 4},
                {Id: '5cab2f37-f50e-3b3e-8c1f-a88a75284ea9', TypeId: 1, Name: 'Main goal 5', MIndex: 5}
            ];
        }
        function getSubgoals () {
            return [
                {Id: '1ee4e327-9c06-4bbb-9c72-86cc0f95954d', TypeId: 2, Name: 'Main 1 / Sub goal 1', MIndex: 1, ParentId: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea5'},
                {Id: '1ee4e327-9c06-4bbb-9c72-86cc0f9595fd', TypeId: 2, Name: 'Main 1 /Sub goal 2', MIndex: 2, ParentId: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea5'},
                {Id: '1ee4e327-9c06-3bbb-9c72-86cc0f9595fd', TypeId: 2, Name: 'Main 5 /Sub goal 3', MIndex: 3, ParentId: '5cab2f37-f50e-3b3e-8c1f-a88a75284ea9'}
            ];
        }
        function getActions () {
            return [
                {Id: 'e24ef4fb-b166-4afa-95e5-37ade8cea728', TypeId: 3, Name: 'Main 1 / Sub goal 1 / Action 1', MIndex: 1, ParentId: '1ee4e327-9c06-4bbb-9c72-86cc0f95954d'},
                {Id: 'ecfc2c7a-b096-4fb0-977a-8152b1d1661a', TypeId: 3, Name: 'Main 1 / Sub goal 2 / Action 2', MIndex: 2, ParentId: '1ee4e327-9c06-4bbb-9c72-86cc0f9595fd'}
            ];
        }

        return {
            getMaingoals: getMaingoals, getSubgoals: getSubgoals, getActions: getActions
        }
    }
}