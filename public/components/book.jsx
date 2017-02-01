import React    from "react";

class Book extends React.Component{
    
    handleDeleteBook(e){
        e.preventDefault();
        this.props.onDelete(this.props.index, this.props.book);
    }
    
    handleTradeBook(e){
        e.preventDefault();
        this.props.onTrade(this.props.book);
    }
    
    render(){
        
        let imageURL = this.props.imageURL ? this.props.imageURL.replace(/http:\/\//, 'https://') : this.props.imageURL;
        
        let bookElement = this.props.onDelete ? 
                <a onClick={this.handleDeleteBook.bind(this)} href="#" title="Delete Book">
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </a>
                :
                null
                ;
                
        let tradeElement = null;
                
        if(this.props.book.requestedBy){
            tradeElement = <small>on trade</small>;
        }else if(this.props.onTrade){
            tradeElement =  <a onClick={this.handleTradeBook.bind(this)} href="#" title="Request a Trade">
                              <i className="fa fa-exchange" aria-hidden="true"></i>
                            </a>;
        }
                    
        return (
          <div className="col-xs-6 col-md-3">
            <div className="thumbnail">
                <img src={imageURL} alt={this.props.title} title={this.props.title}/>
                <div className="caption">
                <h4 className="book-title">{this.props.title}</h4>
                { bookElement }
                <span className="trade-block">{ tradeElement }</span>
                </div>
            </div>
          </div>
        );
    }
}

export default Book;