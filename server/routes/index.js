var Account = require('./../models/account');

var routes = function(app, router, passport){
    
    var requireAuthenticate = passport.authenticate('jwt', { failureRedirect: '/home', session: false });
    
    /*--------------------------------------------
    *
    * HOME ROUTES
    *
    *---------------------------------------------*/
    
    router.get('/', requireAuthenticate, function(req, res) {
        console.log(req.user);
        res.render('app', { user: req.user });
    });
    
    router.get('/home', function(req, res) {
        res.render('index', { user: req.user });
    });
    
    /*--------------------------------------------
    *
    * ALL BOOKS ROUTES
    *
    *---------------------------------------------*/
    
    
    //Retrieve all books
    router.get('/allbooks', (req, res) => {
        //Get only user's books where mybooks is not an empty array
        Account.find( { myBooks: { $gt: [] } } ).select('_id profile.firstName myBooks').exec((err, result) => {
           if(err) return res.status(422).json({ error: err.message || 'unknown error getting all books' });
           
           res.status(200).json({
               users: result
           });
        });
    });
    
    /*--------------------------------------------
    *
    * MY BOOKS (SINGLE USER) ROUTES
    *
    *---------------------------------------------*/
    
    
    //Retrieve user's books
    router.get('/mybooks', requireAuthenticate, (req, res) => {
        Account.findById( req.user._id ).select('myBooks').exec((err, user) => {
           if(err) return res.status(422).json({ error: err.message || "unknown error getting user's books"});
           
           res.status(200).json(user);
        });
    });
    
    //Add a new book to mybooks collection
    router.post('/mybooks', requireAuthenticate, (req, res) => {
        
        const newBook = { bookId : req.body.bookId };
        
        Account.update( { _id: { $eq: req.user._id } },
            { $push: { myBooks: newBook } }, (err, result) => {
                if(err || result.ok === 0) return res.status(422).json({ error: "unknown error trying to add a new book"});
                if(result.nModified == 0) return res.status(422).json({ error: "book could not be added"});
                if(result.n == 0) return  res.status(422).json({ error: "user not found"});
                //return the given book
                res.status(200).json(newBook);
            });
        
    });
    
    router.delete('/mybooks/:id', requireAuthenticate, (req, res) => {
        
        var id = req.params.id;
        
        Account.update( { _id: { $eq: req.user._id } },
            {
                $pull: { "myBooks": { "_id": id } }
            },
            { 
                multi: true
            },
            (err, result) => {
                console.log(result);
                if(err || result.ok === 0) return res.status(422).json({ error: 'unknown error trying to remove a book'});
                if(result.nModified == 0) return res.status(422).json({ error: "book could not be removed"});
                if(result.n == 0) return res.status(422).json({ error: "user not found"});
                //return success without data
                return res.status(204).json();
            }
        );
    });
    
    /*--------------------------------------------
    *
    * REQUESTED BOOKS (TRADING)
    *
    *---------------------------------------------*/
    router.get('/reqbooks', requireAuthenticate, (req, res) => {
        Account.findById( req.user._id ).select('reqBooks').exec((err, user) => {
           if(err) return res.status(422).json({ error: err.message || "unknown error getting user's requested books"});
           
           res.status(200).json(user);
        });
    });
    
    router.post('/reqbooks', requireAuthenticate, (req, res) => {
        var book = req.body.book;
        var toUser = req.body.toUser;
        
        //Update current user's books requests
        Account.findById(req.user._id).exec((err, user) => {
            if(err) return res.status(422).json({ error: err.message || "unknown error getting user for trading"});
           
            if(user.reqBooks) user.reqBooks = [];
           
            var reqBook = {
                bookId: book.bookId,
                title: book.title,
                toUser: toUser._id,
                approved: false
            };
           
            user.reqBooks.push(reqBook);
           
            var tradeInfo = { requestedBy: user._id, approved: false };
           
            //Update target user (book's owner)
            Account.update({ _id: { $eq: toUser._id }, "myBooks._id": book._id },
            {
                $set: { "myBooks.$.requestedBy": tradeInfo.requestedBy, "myBooks.$.approved": tradeInfo.approved }
            },
            { 
                multi: true
            },
            (err, result) => {
                if(err || result.ok === 0) return res.status(422).json({ error: 'unknown error trying to update a user\'s book'});
                if(result.nModified == 0) return res.status(422).json({ error: "book could not be requested for trading"});
                if(result.n == 0) return res.status(422).json({ error: "user not found"});
                
                Account.update({ _id: user._id },
                {
                    $push: { 'reqBooks': reqBook }
                },
                (err, user) => {
                    if(err) return res.status(422).json({ error: err.message || "unknown error saving user book trade"});
                    
                    return res.status(200).json(tradeInfo);
                });
            });
           
        });
    });
    
    //Cancel request
    router.post('/reqbooks/request/cancel', requireAuthenticate, (req, res) => {
        //Update user (book's owner)
        var reqBook = req.body.reqBook;
        Account.update( { _id: req.user._id },
        {
            $pull: { 'reqBooks': { 'bookId': reqBook.bookId } }
        },
        {
            multi: true
        },
        (err, result) => {
            console.log("/reqbooks/request/cancel", "updating user's reqBooks", result);
            if(err || result.ok === 0) return res.status(422).json({ error: 'unknown error trying to update a user\'s book'});
            if(result.nModified == 0) return res.status(422).json({ error: "book could not be requested for trading"});
            if(result.n == 0) return res.status(422).json({ error: "user not found"});
            
            Account.update({ _id: { $eq: reqBook.toUser }, "myBooks.bookId": reqBook.bookId },  
            {
                $unset: { "myBooks.$.requestedBy": 1, "myBooks.$.approved": 1 }
            },
            {
                multi: true
            },
            (err, result) => {
                console.log("/reqbooks/request/cancel", "updating book's owner", result);
                if(err || result.ok === 0) return res.status(422).json({ error: 'unknown error trying to update a user\'s book'});
                if(result.nModified == 0) return res.status(422).json({ error: "book could not be requested for trading"});
                if(result.n == 0) return res.status(422).json({ error: "user not found"});
                
                return res.status(204).json();
            });
        });
    });
    
    //Accept an incomming request
    router.post('/reqbooks/incomming/accept', requireAuthenticate, (req, res) => {
        //Update user (book's owner)
        var myBook = req.body.myBook;
        var requestedBy = myBook.requestedBy;
        Account.update({ _id: { $eq: req.user._id }, "myBooks._id": myBook._id },  
        {
            $set: { "myBooks.$.approved": true }
        },
        {
            multi: true
        },
        (err, result) => {
            console.log("/reqbooks/incomming/accept", "updating user's myBooks", result);
            if(err || result.ok === 0) return res.status(422).json({ error: 'unknown error trying to update a user\'s book'});
            if(result.nModified == 0) return res.status(422).json({ error: "book could not be requested for trading"});
            if(result.n == 0) return res.status(422).json({ error: "user not found"});
            
            Account.update( { _id: requestedBy, "reqBooks.bookId": myBook.bookId },
            {
                $set: { "reqBooks.$.approved": true }
            },
            {
                multi: true
            },
            (err, result) => {
                console.log("/reqbooks/incomming/accept", "updating requesting user book's (reqBooks)", result);
                if(err || result.ok === 0) return res.status(422).json({ error: 'unknown error trying to update a user\'s requesting books'});
                if(result.nModified == 0) return res.status(422).json({ error: "book could not be requested for trading"});
                if(result.n == 0) return res.status(422).json({ error: "user not found"});
                
                return res.status(204).json();
            });
        });
    });
    
    //Reject an incomming request
    router.post('/reqbooks/incomming/reject', requireAuthenticate, (req, res) => {
        //Update user (book's owner)
        var myBook = req.body.myBook;
        var requestedBy = myBook.requestedBy;
        Account.update({ _id: { $eq: req.user._id }, "myBooks._id": myBook._id },  
        {
            $unset: { "myBooks.$.requestedBy": 1, "myBooks.$.approved": 1 }
        },
        {
            multi: true
        },
        (err, result) => {
            console.log("/reqbooks/incomming/reject", "updating user's myBooks", result);
            if(err || result.ok === 0) return res.status(422).json({ error: 'unknown error trying to update a user\'s book'});
            if(result.nModified == 0) return res.status(422).json({ error: "book could not be requested for trading"});
            if(result.n == 0) return res.status(422).json({ error: "user not found"});
            
            Account.update( { _id: requestedBy },
            {
                $pull: { 'reqBooks': { 'bookId': myBook.bookId } }
            },
            {
                multi: true
            },
            (err, result) => {
                console.log("/reqbooks/incomming/reject", "updating requesting user book's (reqBooks)", result);
                if(err || result.ok === 0) return res.status(422).json({ error: 'unknown error trying to update a user\'s requesting books'});
                if(result.nModified == 0) return res.status(422).json({ error: "book could not be requested for trading"});
                if(result.n == 0) return res.status(422).json({ error: "user not found"});
                
                return res.status(204).json();
            });
        });
    });
    
    return router;
};


module.exports = routes;