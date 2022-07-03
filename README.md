# twitter-feed-sim

## Starting the Project

I created this and ran it via [yarn](https://yarnpkg.com/), one can run this via `npm`, if there is issues running it, delete [yarn.lock](./yarn.lock).

## Unit Testing 

I noticed that this solution does not work well with jest, due to jest not really supporting `process.argv`.

There is a way to test this, by creating a testing file per argument test case, ie, `node app.js` vs `node app.js user.pdf` vs `node app.js user.pdf tweet.pdf`, etc...
