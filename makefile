all:
	jade index.jade
	livescript -cb index.ls
	sass index.sass index.css
