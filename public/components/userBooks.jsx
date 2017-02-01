import React                from "react";
import Book                 from "./book";

export default class UserBooks extends React.Component {
    
    constructor(props){
        super(props);
    }
    
    handleTradeBook(book){
        if(this.props.onTrade) this.props.onTrade(this.props.user, this.props.user.myBooks.indexOf(book));
    }
    
    render () {
        return (
            <div>
                <hr/>
                <h2>{this.props.user.profile.firstName}'s Books</h2>
                <div className="row">
                    {this.props.user.myBooks.map((book, idx) => 
                        <Book key={idx} index={idx} bookId={book.bookId}
                            title={book.title} imageURL={book.imageURL} 
                            book={book} onTrade={this.handleTradeBook.bind(this)}/>
                    )}
                </div>
            </div>   
        );
    }
}