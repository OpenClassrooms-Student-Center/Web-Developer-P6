# sng

A lightweight launcher for a PHP/Nginx development server

## Why?

To give the possibility to a user without admin privileges to easily launch a PHP development server.

## Requirements?

 * PHP in CGI mode: php-cgi -v must returns php-fcgi in output
 * Nginx server
 
On Ubuntu systems:

    sudo apt-get install nginx-full php5-cgi

On archlinux:
	
	pacman nginx php-cgi

## Install

To install sng locally : 

    npm install sng
    
To install globally in system use:

    npm install sng -g

## Usage
    Options:
      -n, --nginx-base        Default binding NGinx wil be listening on            [default: "127.0.0.1:8000"]
      -p, --php-bind          Default binding address for php-cgi                  [default: "127.0.0.1:9000"]
      -b, --behavior          Changes behavior. Avialable are: "standard", "zend"  [default: "standard"]
      -x, --extra-directives  Extra directives file for the NGinx server 

## Configuration files

You can directly store the configuration file in the root folder of the server. sng will look for .sng.conf.tpl files in the root folder. A very basic configuration file would look like that : 

	location / {
	    if ($uri ~ "\.php") {
	        fastcgi_pass {{ php_bind }};
	    }
	    access_log  {{ tmpdir }}/access.log mine;
	}

Warning : The {{ php_bind }} represents the ip and port on which php-cgi is running, for exemple 127.0.0.1:80 is the default binding.
