import React                from "react";
import { connect }          from "react-redux";
import axios                from "axios";
import Auth                 from "../auth";
import AddBook              from "../components/addBook";
import Book                from "../components/book";
import * as userActions     from "../actions/userActions";

class MyBooks extends React.Component {
    
    constructor(props){
        super(props);
        
        this.handleNewBook = this.handleNewBook.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        
        // this.axiosInstance = axios.create({
        //     headers: {'authorization': Auth.Token()}
        // });
    }
    
    handleNewBook(book){
        //send the new book to server
        Auth.getAxiosInstance().post('/mybooks', { bookId: book.bookId })
        .then((response) => {
            console.log("adding: ", response.data);
            const book = response.data;
            if(book){
                this.props.dispatch(userActions.addNewBook(book));
                let bookURL = `https://www.googleapis.com/books/v1/volumes/${book.bookId}?key=${Auth.ApiKey()}&projection=lite`;
                axios.get(bookURL)
                .then((response) => {
                    this.props.dispatch(userActions.fetchBookInfo(this.props.myBooks.length - 1, response.data));
                })
                .catch((response) => {
                    console.log("error: ", response);
                });
            }
            
            //the server will response with the updated list of books
            //post the action (Books_updated) to redux 
            //in order to trigger the update of the UI list.
            
        })
        .catch((response) => {
            console.log("error: ", response);
        });
        
        
        //Map the UI list to query (async) for book info (front image and title).
    }
    
    handleDeleteBook(idx, book){
        console.log("deleting: ", idx, book);
        Auth.getAxiosInstance().delete('/mybooks/' + encodeURIComponent(book._id))
        .then((response) => {
            console.log("deleted... ");
            this.props.dispatch(userActions.deleteBook(idx));
        })
        .catch((response) => {
            console.log("error: ", response);
        });
    }
    
    componentWillMount(){
        Auth.isAuthorized()
        .then(res => {
            Auth.getAxiosInstance().get('/mybooks')
            .then((response) => {
                if(response.data){
                    this.props.dispatch((dispatch) => {
                        const myBooks = response.data.myBooks;
                        dispatch(userActions.fetchMyBooks(myBooks));
                        myBooks.map((book, idx) => {
                            let bookURL = `https://www.googleapis.com/books/v1/volumes/${book.bookId}?key=${Auth.ApiKey()}&projection=lite`;
                            axios.get(bookURL)
                            .then((response) => {
                                dispatch(userActions.fetchBookInfo(idx, response.data));
                            })
                            .catch((response) => {
                                console.log("error: ", response);
                            });
                        });
                    });
                }
            })
            .catch((response) => {
                console.log("error: ", response);
            });
        })
        .catch((res) => {
            Auth.logOut();
            location.href = '/auth/signin';
        });
    }
    
    render(){
        return(
            <div>
                <h2>My Books</h2>
                <AddBook onNewBook={this.handleNewBook}/>
                
                <div className="row">
                    {this.props.myBooks.map((book, idx) => 
                        <Book key={idx} index={idx} bookId={book.bookId}
                            title={book.title} imageURL={book.imageURL} book={book}
                            onDelete={this.handleDeleteBook.bind(this)}/>
                    )}
                </div>
            </div> 
        ); 
    }
    
}

export default connect((state) => {
    return {
      myBooks: state.user.myBooks || []
    };
})(MyBooks);