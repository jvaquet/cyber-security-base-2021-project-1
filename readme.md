# The best Social Network
This is a simple web application implementing a very rudementary social network. Horrific things were done to this app to open up a vareiety of security vulnerabilities. *Please do not try this at home!*

This App was developed for the Cyber Security Base 2021 online course at the University of Helsinki.

## How to install and run
1. You need to have the newest LTS versions of nodejs, npm, and python3 installed.
2. In the project root directory execute `npm run install_build`.
3. In the project root directory run `npm start`.
4. You now should be able to open the app on http://localhost:3000

## Usage
On the first start the app generates a database with the user:password combinations:
* admin:1337
* user1:6969
* user2:1234

If you break the database for example by SQL injection, just deleting the `database.db` file and restarting the app resets the database.
Some example messages that exploit vulnerabilities are provided in the file `exploits.txt`.