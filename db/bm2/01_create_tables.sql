create table bookmark_users (
    id serial primary key unique not null ,
    f_name varchar(40) not null,
    l_name varchar(40) not null,
    username varchar(40) not null unique ,
    email_address varchar(60) not null unique
                   );