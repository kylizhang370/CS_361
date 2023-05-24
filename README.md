echo "# CS_361" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:kylizhang370/CS_361.git
git push -u origin main


//git hub

A. The video is showing how I am going to REQUEST DATA, since it is not yet the final version, so the way I REQUEST data is by adding goal, and the goal will add to the database, what I am using for now is mySQL and I set up the database locally. When the data is submited then the home.html will automatically REQUEST DATA and print it on the website. 

B. Receive data is pretty much the same and it is done by the code automatically. Below are the process of the functions that I implemented so far.

The client sends an HTTP GET request to the data endpoint.
The server receives the request and queries the MySQL database to retrieve data.
The server sends the data to the client as a JSON response.
The client receives the data and displays it on an HTML page using JavaScript.

C. Below are the linked to the UML sequence diagram:
https://lucid.app/lucidchart/18ab2891-e5c7-46e2-9f7e-899d07af4215/edit?viewport_loc=-123%2C-4%2C1658%2C956%2C0_0&invitationId=inv_d407a495-f287-4019-900d-76c4392d8615



About the microservives, I am using node.js and mySQL to bulid up my database and having them runing in locally machine. 

Here is the code for my database:

CREATE DATABASE your_database;
USE your_database;

CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goal VARCHAR(255) NOT NULL,
    start_day DATE NOT NULL
);


The name of my own database is: my_database. If you want to run my code locally then the code would be:
CREATE DATABASE my_database;
USE my_database;

CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goal VARCHAR(255) NOT NULL,
    start_day DATE NOT NULL
);

