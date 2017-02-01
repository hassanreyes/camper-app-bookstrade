
export function fetchProfile(profile){
    return {
      type: 'FETCH_PROFILE',
      payload: {
        profile: profile
      }
    };
}

export function addNewBook(book){
  return {
    type: 'ADD_NEW_BOOK',
    payload: {
      book: book
    }
  };
}

export function fetchMyBooks(books){
  return {
    type: 'FETCH_MYBOOKS',
    payload: {
      myBooks: books
    }
  };
}

export function fetchBookInfo(idx, bookInfo){
  return {
    type: 'FETCH_BOOKINFO',
    index: idx,
    payload: {
      title: bookInfo.volumeInfo.title,
      imageURL: bookInfo.volumeInfo.imageLinks.smallThumbnail
    }
  };
}

export function deleteBook(idx){
  return {
    type: 'DELETE_BOOK',
    index: idx
  };
}

/*----------------------------------------------
*
* Trading User Actions
*
*----------------------------------------------*/
export function fetchReqBooks(reqBooks){
  return {
    type: 'FETCH_REQUESTED_BOOKS',
    payload: {
      reqBooks: reqBooks
    }
  };
}

//Cancel Request
export function deleteReqBook(idx){
  return {
    type: 'DELETE_REQBOOK',
    index: idx
  };
}

//Reject incomming request
export function rejectBookRequest(idx){
  return {
    type: 'REJECT_BOOK_REQUEST',
    index: idx
  };
}

//Accept incomming request
export function acceptBookRequest(idx){
  return {
    type: 'ACCEPT_BOOK_REQUEST',
    index: idx
  };
}