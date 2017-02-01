import update   from "react-addons-update";

export default function reducer(state = {
    profile: {},
    myBooks: [],
    reqBooks: []
}, action) {
    switch(action.type){
        case 'FETCH_PROFILE': 
            return {...state, profile: action.payload.profile };
        case 'ADD_NEW_BOOK':
            return {...state, myBooks: [...state.myBooks, action.payload.book]};
        case 'FETCH_MYBOOKS':
            return {...state, myBooks: action.payload.myBooks };
        case 'FETCH_BOOKINFO':
            return update(state, {
                myBooks: { 
                    [action.index]: {
                        title: {$set: action.payload.title},
                        imageURL: {$set: action.payload.imageURL}
                    }
                }
            });
        case 'DELETE_BOOK':
            return update(state, { myBooks: {$splice: [[action.index, 1]]}});
        /*----------------------------------------------------------------------
        * Trading User Actions
        *---------------------------------------------------------------------*/
        case 'FETCH_REQUESTED_BOOKS':
            return {...state, reqBooks: action.payload.reqBooks };
        case 'DELETE_REQBOOK':
            return update(state, { reqBooks: {$splice: [[action.index, 1]]}});
        case 'REJECT_BOOK_REQUEST':
            return update(state, {
                myBooks: { 
                    [action.index]: {
                        requestedBy: {$set: undefined},
                        approved: {$set: undefined}
                    }
                }
            });
        case 'ACCEPT_BOOK_REQUEST':
            return update(state, {
                myBooks: { 
                    [action.index]: {
                        approved: {$set: true}
                    }
                }
            });
    }
    return state;
}