import React                from "react";
import { connect }          from "react-redux";
import axios                from "axios";
import Auth                 from "../auth";
import UserBooks            from "../components/userBooks";
import MyRequestedBooks     from "../components/myRequestedBooks";
import TradeRequests        from "../components/tradeRequests";
import * as bookActions     from "../actions/bookActions";
import * as userActions     from "../actions/userActions";

class AllBooks extends React.Component {
    
    constructor(props){
        super(props);
        
        this.componentWillMount = this.componentWillMount.bind(this);
    }
    
    handleBookInfo(userIdx, idx, info){
        this.props.dispatch(bookActions.fetchBookInfo(userIdx, idx, info));
    }
    
    handleTradeBook(user, idx){
        const userIdx = this.props.users.indexOf(user);
        const book = this.props.users[userIdx].myBooks[idx];
        //Request for trade
        Auth.getAxiosInstance().post('/reqbooks', { toUser: user, book: book})
        .then((response) => {
            const info = response.data;
            this.props.dispatch(bookActions.fetchBookTradeInfo(userIdx, idx, info));
            Auth.getAxiosInstance().get('/reqbooks')
            .then((response) => {
                if(response.data){
                    const reqBooks = response.data.reqBooks;
                    this.props.dispatch(userActions.fetchReqBooks(reqBooks));
                }
            })
            .catch((response) => {
                console.error("error: ", response.message);
            });
        })
        .catch((response) => {
            console.error(response.message);
        });
    }
    
    componentDidMount(){
        //Handle collapse in order to use panels mutually exclusive.
        //If one panel is shown the other will be hidden and vice versa
        $('#myRequests').on('show.bs.collapse', () => {
            $('#tradeRequests').collapse('hide');
        });
        
        $('#tradeRequests').on('show.bs.collapse', () => {
            $('#myRequests').collapse('hide');
        });
    }
    
    componentWillMount(){
        //request for all books from all users
        Auth.getAxiosInstance().get('/allbooks')
        .then((response) => {
            console.log(response);
            this.props.dispatch(bookActions.fetchAllBooks(response.data.users));
            
            this.props.users.map((user, userIdx) => {
                user.myBooks.map((book, idx) => {
                    let bookURL = `https://www.googleapis.com/books/v1/volumes/${book.bookId}?key=${Auth.ApiKey()}&projection=lite`;
                    axios.get(bookURL)
                    .then((response) => {
                        this.props.dispatch(bookActions.fetchBookInfo(userIdx, idx, response.data));
                    })
                    .catch((response) => {
                        console.error(response.message);
                    }); 
                });
            });
        })
        .catch((response) => {
            console.error(response.message);
        });
    }
    
    render() {
        return (
            <div className="row">
                <button className="btn btn-success" type="button" data-toggle="collapse" 
                    data-target="#myRequests" aria-expanded="false" aria-controls="myRequests">
                  Your trade requests <span className="badge">{this.props.myReqCount}</span>
                </button>
                &nbsp;
                <button className="btn btn-primary" type="button" data-toggle="collapse" 
                    data-target="#tradeRequests" aria-expanded="false" aria-controls="tradeRequests">
                  Trade requests for you <span className="badge">{this.props.tradeReqCount}</span>
                </button>
                <div id="myRequests" className="collapse">
                    <MyRequestedBooks />
                </div>
                <hr/>
                <div id="tradeRequests" className="collapse">
                    <TradeRequests />
                </div>
                <hr/>
                <div className="row">
                    {this.props.users.map((user, idx) => 
                        <UserBooks key={idx} index={idx} user={user} userIdx={idx}
                            onTrade={this.handleTradeBook.bind(this)}/>
                    )}
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    let tradeReqCount = [];
    if(state.user.myBooks && state.user.myBooks.length > 0) 
        tradeReqCount = state.user.myBooks.filter(book => book.requestedBy != undefined);
    return {
      users: state.books.users || [],
      myReqCount: state.user.reqBooks.length,
      tradeReqCount: tradeReqCount.length
    };
})(AllBooks);