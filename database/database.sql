create database answers_community;

use answers_community;

create table users (
    id int primary key auto_increment,
    username varchar(100),
    fullname varchar(100),
    email varchar(100),
    password varchar(255),
);

create table categories (
    id int primary key auto_increment,
    category varchar(50)
);

insert into categories values
(null, 'javascript'),
(null, 'reactjs'),
(null, 'c++'),
(null, 'c#'),
(null, 'java'),
(null, 'nodejs'),
(null, 'php'),
(null, 'html'),
(null, 'python'),
(null, 'jquery'),
(null, 'android'),
(null, 'sql'),
(null, 'mysql'),
(null, 'base-de-datos'),
(null, 'css'),
(null, 'laravel'),
(null, 'bootstrap');

create table questions (
    id int primary key auto_increment,
    fk_user int,
    question varchar(100),
    description TEXT,
    views int,
    fk_category int,
    foreign key(fk_user)references users(id),
    foreign key(fk_category)references categories(id)
);

create table answers (
    id int primary key auto_increment,
    fk_user int,
    fk_question int,
    answer TEXT,
    votes int,
    foreign key(fk_user)references users(id),
    foreign key(fk_question)references questions(id)
);