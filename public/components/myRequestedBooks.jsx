import React                from "react";
import { connect }          from "react-redux";
import Auth                 from "../auth";
import OnTradeBook          from "../components/onTradeBook";
import * as userActions     from "../actions/userActions";

class MyRequestedBooks extends React.Component {
    
    constructor(props){
        super(props);
        
        this.componentWillMount = this.componentWillMount.bind(this);
    }
    
    handleCancelRequest(idx, book){
        Auth.getAxiosInstance().post('/reqbooks/request/cancel', { reqBook: book })
            .then((response) => {
                this.props.dispatch(userActions.deleteReqBook(idx));
            })
            .catch((response) => {
                console.error(response.message);
            });
    }
    
    componentWillMount(){
        Auth.isAuthorized()
        .then(res => {
            Auth.getAxiosInstance().get('/reqbooks')
            .then((response) => {
                if(response.data){
                    console.log(response.data);
                    const reqBooks = response.data.reqBooks;
                    this.props.dispatch(userActions.fetchReqBooks(reqBooks));
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
                            onRejectTrade={this.handleCancelRequest.bind(this)}/>;
                        };
        
        let reqBooks = this.props.reqBooks.filter((book) => {
                            return !book.approved; 
                        }).map(mapBook);
        
        let approvedBooks = this.props.reqBooks.filter((book) => {
                            return book.approved; 
                        }).map(mapBook);
        
        return (
            <div>
                <div className="row">
                    <h3>Your outstanding requests:</h3>
                    <hr/>
                    <div className="row">
                        {reqBooks}
                    </div>
                </div>
                <div className="row">
                    <h3>Your trade request was approved:</h3>
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
      reqBooks: state.user.reqBooks || []
    };
})(MyRequestedBooks);