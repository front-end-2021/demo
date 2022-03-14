const msRoadmap = {
    getService: function(){
        function getMaingoals () {
            return [
                {Id: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea5', TypeId: 1, Name: 'Main goal 1'},
                {Id: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea9', TypeId: 1, Name: 'Main goal 2'}
            ];
        }
        function getSubgoals () {
            return [
                {Id: '1ee4e327-9c06-4bbb-9c72-86cc0f95954d', TypeId: 2, Name: 'Main 1 / Sub goal 1', ParentId: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea5'},
                {Id: '1ee4e327-9c06-4bbb-9c72-86cc0f9595fd', TypeId: 2, Name: 'Main 1 /Sub goal 2', ParentId: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea5'}
            ];
        }
        function getActions () {
            return [
                {Id: 'e24ef4fb-b166-4afa-95e5-37ade8cea728', TypeId: 3, Name: 'Main 1 / Sub goal 1 / Action 1', ParentId: '1ee4e327-9c06-4bbb-9c72-86cc0f95954d'},
                {Id: 'ecfc2c7a-b096-4fb0-977a-8152b1d1661a', TypeId: 3, Name: 'Main 1 / Sub goal 2 / Action 2', ParentId: '1ee4e327-9c06-4bbb-9c72-86cc0f9595fd'}
            ];
        }

        return {
            getMaingoals: getMaingoals, getSubgoals: getSubgoals, getActions: getActions
        }
    }
}