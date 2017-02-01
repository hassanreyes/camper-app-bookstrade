import React from "react";

export default class Home extends React.Component {
    
    render() {
        return (
            <div>
                <div className="jumbotron">
                    <h1>Books Trade App</h1>
                    <p>The best trading book application</p>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <div className="thumbnail">
                      <div className="caption">
                        <p><strong>Catalogue</strong> your books online</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <div className="thumbnail">
                      <div className="caption">
                        <p><strong>Easily Manage</strong> books and request from your dashboard</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <div className="thumbnail">
                      <div className="caption">
                        <p><strong>See all</strong> of the books our users own</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <div className="thumbnail">
                      <div className="caption">
                        <p><strong>Request</strong> to borrow other users' books</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        );
    }
}