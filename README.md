#Prometheus
Such a practical wiki which is great.
<br><br>
##Current Position

###Vertx2
Using vertx2 for serverside.
I will upgrade it when vertx3 is stabled and well documented.

###Signin and Signup
I made simple signin and signup index page. Willing to add ssl and smtp auth functions.

###Designing Main
designing main page suit for our wiki
<br><br>
##Required Functions

### Editing
Users are free to choose what to use edit document.
- First method is conventional `Markup` language.
- Second method is to use `wike-js`.

### Public Tag
Public tag is represented to classify documents by where it belongs.
The fact that user can suggest and commit the tag by mass discussion is the reason I call this `tag function` as `public tag function`.
It will help to organize document in practical, visual way. 

### Version Control
To protect document from **fucking vandalism** and to make document that watched by users stable it provides `Version Control` of document.
User who want to update document can make `branch` and people who read updated document can `confirm` that document.
Branch which get more than particular number of comfirm of people is updated to master document.

### Linking
By `Public Tag` function, server search correlation of document periodically and link them in the document.
It binds relevent documents strongly and provides `maybe interested` information to user.
