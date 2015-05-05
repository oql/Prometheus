-- create database prom character set utf8 collate utf8_general_ci;

create table user(
    email varchar(255) primary key,
    password varchar(255) not null,
    nickname varchar(255) not null unique,
    authed varchar(5) not null default 'false'
)character set utf8 collate utf8_general_ci;

create table documents(
    title varchar(255) primary key,
    text text
)character set utf8 collate utf8_general_ci;
