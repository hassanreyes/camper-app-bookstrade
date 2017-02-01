import React                from "react";
import { connect }          from "react-redux";
import axios                from "axios";
import Auth                 from "../auth";
import OnTradeBook          from "../components/onTradeBook";
import * as userActions     from "../actions/userActions";

class TradeRequests extends React.Component {
    
    constructor(props){
        super(props);
        
        this.componentWillMount = this.componentWillMount.bind(this);
    }
    
    handleAcceptTrade(idx, book){
        Auth.getAxiosInstance().post('/reqbooks/incomming/accept', { myBook: book })
        .then((response) => {
            this.props.dispatch(userActions.acceptBookRequest(idx));
        })
        .catch((response) => {
            console.error(response.message);
        });
    }
    
    handleRejectTrade(idx, book){
        Auth.getAxiosInstance().post('/reqbooks/incomming/reject', { myBook: book })
        .then((response) => {
            this.props.dispatch(userActions.rejectBookRequest(idx));
        })
        .catch((response) => {
            console.error(response.message);
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
                console.log("error: ", response.message);
            });
        })
        .catch((res) => {
            Auth.logOut();
            location.href = '/auth/signin';
        });
    }
    
    render(){
        let mapBook = (book, idx) => {
                        return <OnTradeBook key={book._id} index={idx} bookId={book.bookId}
                            title={book.title} book={book} 
                            onAcceptTrade={this.handleAcceptTrade.bind(this)}
                            onRejectTrade={this.handleRejectTrade.bind(this)}/>;
                        };

        let reqBooks = this.props.myBooks.filter((book) => {
                            return book.requestedBy && !book.approved; 
                        }).map(mapBook);
        
        let approvedBooks = this.props.myBooks.filter((book) => {
                            return book.requestedBy && book.approved; 
                        }).map(mapBook);
        
        return (
            <div>
                <div className="row">
                    <h3>Requests from other users:</h3>
                    <hr/>
                    <div className="row">
                        {reqBooks}
                    </div>
                </div>
                <div className="row">
                    <h3>Approved requests:</h3>
                    <hr/>
                    <div className="row">
                        {approvedBooks}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
      myBooks: state.user.myBooks || []
    };
})(TradeRequests);