
export function fetchAllBooks(users){
    return {
        type: 'FETCH_ALLUSERS',
        payload: {
            users: users
        }
    };
}

export function fetchBookInfo(userIdx, idx, bookInfo){
    return {
        type: 'FETCH_USER_BOOKINFO',
        userIndex: userIdx,
        index: idx,
        payload: {
            title: bookInfo.volumeInfo.title,
            imageURL: bookInfo.volumeInfo.imageLinks.smallThumbnail
        }
    };
}

export function fetchBookTradeInfo(userIdx, idx, bookTradeInfo){
    return {
        type: 'FETCH_TRADE_INFO',
        userIndex: userIdx,
        index: idx,
        payload: {
            requestedBy: bookTradeInfo.requestedBy,
            approved: bookTradeInfo.approved
        }
    };
}


