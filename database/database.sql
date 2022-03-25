create database answers_community;

use answers_community;

create table users (
    id int primary key auto_increment,
    username varchar(100),
    fullname varchar(100),
    email varchar(100),
    password varchar(255),
);