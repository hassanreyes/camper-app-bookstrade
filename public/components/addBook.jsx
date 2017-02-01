import React                from "react";
import axios                from "axios";
import Auth                 from "../auth";

export default class AddBook extends React.Component {
    
    constructor(props){
        super(props);
        
        this.handleNewBook = this.handleNewBook.bind(this);
        
        this.state = { error: '' };
    }
    
    handleNewBook(e){
        e.preventDefault();
        const value = this.refs.newName.value;
        if(value && value.trim().length > 0){
            //search for book with google api
            let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(value)}&key=${Auth.ApiKey()}&maxResults=1`;
            axios.get(url)
                .then((response) => {
                    if(!response.data || response.data.totalItems === 0) {
                        return this.setState( { error: 'No book found' } );
                    }
                    
                    const book = { bookId: response.data.items[0].id };
                    
                     //bubble up the new book event    
                    this.props.onNewBook(book);
                })
                .catch((error) => {
                    this.setState( { error: error.message || error } );
                });
            
            e.target.val = '';
        }
    }
  
    render(){
      
      return(
        <div className="form-group custom">
            <form onSubmit={this.handleNewBook}>
                <label htmlFor="new-name">Add Book</label>
                <div className="input-group">
                    <input type="text" className="form-control" id="new-name" placeholder="Enter a book name" ref="newName"/>
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="submit">Add</button>
                    </span>
                </div>
                <p className="bg-warning"><small>{this.state.error}</small></p>
            </form>
        </div>
      );
    }
    
}

AddBook.propTypes = {
    onNewBook: React.PropTypes.func
};