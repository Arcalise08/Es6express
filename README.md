# ES6 Node Express Boilerplate


### Comes with all the bells and whistles of ES6 modules in a fast and easy to use package



#### !!! This is configured for use with MongoDB & Mongoose !!!

- [Considerations](https://github.com/Arcalise08/Es6express#considerations)
- [Setup](https://github.com/Arcalise08/Es6express#setup)
- [Usage](https://github.com/Arcalise08/Es6express#usage)



## Considerations

- This project is set-up using swagger for documentation and swagger-jsdoc for automatic documentation. Swagger is extremely customizable and have tons of options. You can review the code to see its basic usage or learn more about it [here](https://swagger.io/).
- We're using bcrypt for crypto functions.(hashing passwords is all its used for atm)
- Passport is used for all authentication. The project is preconfigured for JWT and local strategies but you can check [here](http://www.passportjs.org/packages/) for configurations for over 500 different authentication strategies.
- This comes with GridFS already setup. Check [here](https://www.freecodecamp.org/news/gridfs-making-file-uploading-to-mongodb) for more documentation on how to use that.



## Setup

1. Install node v15.11.0(For access to the latest ES6 features, It may work on later or newer versions but i make no promises.)
2. Install npm v7.6.0
3. ``` npm i nodemon -g```
4. Rename ***env_template*** to ***.env***
5. open ***.env*** and replace details with your own
6. ``` npm i && npm start ```

## Usage
This project isn't meant to be used on its own. Its a boilerplate and should be added to. If your looking for a full fledged express server, look elsewhere. If you're looking for a great starting point for your own express server(And you use mongodb) this is likely for you!
