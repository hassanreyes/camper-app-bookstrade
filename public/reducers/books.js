import update   from "react-addons-update";

export default function reducer(state = {
    users: []
}, action) {
    switch (action.type) {
        case 'FETCH_ALLUSERS':
            return {...state, users: action.payload.users };
        case 'FETCH_USER_BOOKINFO':
            return update(state, {
                users: { 
                    [action.userIndex]: {
                        myBooks: {
                            [action.index]: {
                                title: {$set: action.payload.title},
                                imageURL: {$set: action.payload.imageURL}
                            }
                        }
                    }
                }
            });
        case 'FETCH_TRADE_INFO':
            return update(state, {
                users: { 
                    [action.userIndex]: {
                        myBooks: {
                            [action.index]: {
                                requestedBy: {$set: action.payload.requestedBy},
                                approved: {$set: action.payload.approved}
                            }
                        }
                    }
                }
            });
    }
    return state;
}