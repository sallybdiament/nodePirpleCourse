# RESTful API with Node.js (no external libs)

### Requirements:
1) RESTful API to listen on a port and accepts incoming HTTP requests for POST, GET, PUT, DELETE and HEAD.
2) API to allow a client to connect, then create a new user, then edit and delete that user.
3) API to allow users to 'sign in' which gives them a token that they can use for subsequent authenticated requests.
4) User can 'sign out'and invalid the token.
5) API allows signed-in users to use their token to create new 'check' (to check if an URL is 'up' or 'down' and what means 'up' or 'down').
6) API allows signed-in users to edit or delete any of their checks.
7) In the background, workers perform all the 'checks' at the appropriate time (for exemple, every minute) and send alerts to the users when a 'check' changes it state from 'up' to 'down', or vice-versa.

This API is build in the Node.js course at Pirple.
