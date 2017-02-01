import React    from "react";

class OnTradeBook extends React.Component{
    
    handleAcceptTrade(e){
        e.preventDefault();
        this.props.onAcceptTrade(this.props.index, this.props.book);
    }
    
    handleRejectTrade(e){
        e.preventDefault();
        this.props.onRejectTrade(this.props.index, this.props.book);
    }
    
    render(){
        let red = { color: 'red' },
            green = { color: 'green' };
            
        let acceptElement = this.props.onAcceptTrade ? <a onClick={this.handleAcceptTrade.bind(this)} href="#" title="Accept Trade">
                                <i className="fa fa-check" aria-hidden="true" style={green}></i>
                            </a> : null;
                            
        let rejectElement = this.props.onRejectTrade ? <a onClick={this.handleRejectTrade.bind(this)} href="#" title="Reject Trade">
                              <i className="fa fa-times" aria-hidden="true" style={red}></i>
                            </a> : null;
                            
        let splitElement = acceptElement && rejectElement ? String.fromCharCode(160) + String.fromCharCode(124) + String.fromCharCode(160) : null;
        
        return (
          <div className="col-xs-6 col-md-3">
            <div className="thumbnail">
                <div className="caption">
                    <span>
                    <h5 className="book-title">
                        {this.props.title}
                    </h5>
                    &nbsp;
                    {acceptElement}
                    {splitElement}
                    {rejectElement}
                    </span>
                </div>
            </div>
          </div>
        );
    }
}

export default OnTradeBook;