List of Apis used

post /signup
post /login
post /logout

## Profile
get /profile
patch /profile/edit
post /profile/edit/password
delete /profile

status : ignore,interested,accpted,rejected

post /request/send/interested/:id <!--rightswipe  -->
 post /request/send/ignored/:id  <!--leftswipe  -->
/request/review/accepted/:requestid
/request/review/rejected/:requestid

get /connections
get /requests/received
get /feed  <!--gets you other user profiles  -->

/send connection