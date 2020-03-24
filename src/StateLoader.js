export class StateLoader {
    loadState() {
        try{
            let serializedState = localStorage.getItem('react-state');
            if(serializedState === null) {
                return this.initializeState();
            }
            return JSON.parse(serializedState);
        }catch(err) {
            return this.initializeState();
        }
    }
    saveState(state) {
        try {
            let serializedState = JSON.stringify(state);
            localStorage.setItem('react-state', serializedState);
        }catch(err) {
            
        }
    }
    initializeState() {
        return {
            token: null,
            email: null,
            fullname: '',
            isActive: null,
            isAdmin: false,
            id: '',
        };
    }
}