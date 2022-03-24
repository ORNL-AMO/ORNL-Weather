# ORNL-Weather


# NCEI/NOAA Local Climatological Data Retrieval
### About

This program is for requesting weather data from National Centers for Environmental Information (NCEI). Same as the [NCEI LCD Website](https://www.ncei.noaa.gov/maps/lcd/) this program will give the user the option to select a weather station they wish to receive data from, choose the dataset elements, the timeframe over which they need their data and will give the user the ability to download the csv for that selected data. This program will give the user the ability to instantly receive this data rather then waiting for the NCEI Website to send it to them.


## Dependencies
- [Node.js v17.3.0 or higher](https://nodejs.org/en/)
- [Angular CLI](https://github.com/angular/angular-cli)

## Bugs/Non-Working Features
- Please report bugs to `bkemp42@tntech.edu`

## Installation - Local
- To install as a Windows program, download and run ORNL-Weather-Setup executable from latest release [here](https://github.com/ORNL-AMO/ORNL-Weather/releases/) and follow installation wizard
- To run without installing, download ORNL-Weather zip from latest release [here](https://github.com/ORNL-AMO/ORNL-Weather/releases/), unzip folder, then run ORNL-Weather.exe

## Installation - Server
- First download and install node.js from above link.
- Run `npm install -g @angular/cli` to install angular.
- Run `npm install` to install all the packages required for the program.
- Open a command line and navigate to the product folder.
- Run command `ng build --base-href /weather/`, replacing "weather" with desired subdirectory name.
- Place contents of dist/ornl-weather/ directory into new folder in html server folder (ex. /var/www/html/)

**Example (Ubuntu, Apache2)**
```
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm install node
wget https://github.com/ORNL-AMO/ORNL-Weather/archive/refs/tags/1.0.0.tar.gz
tar -xf 1.0.0.tar.gz
cd ORNL-Weather-1.0.0/
npm install
npm install -g @angular/cli
npm update
ng build --base-href /weather/
sudo mv ./dist/ornl-weather /var/www/html/weather
sudo systemctl restart apache2
```

## For Developers
### Build Local Installer, Executable
- To install all required packages:
- First download and install Node.js from above link.
- Run `npm install -g @angular/cli` to install angular.
- Run `npm install` to install all the packages required for the program.
- Open a command line and navigate to the product folder.
- Run command `npm run dist` to build project
- Installer will be found at ../output/ORNL-Weather-Setup-\*.\*.\*.exe
- Folder containing Windows executable can be found at ../output/win-unpacked/

### Build Development Server
- To install all required packages:
- First download and install Node.js from above link.
- Run `npm install -g @angular/cli` to install angular.
- Run `npm install` to install all the packages required for the program.
- Open a command line and navigate to the product folder.
- Finally run `ng serve` to run dev server and navigate to `http://localhost:4200/`
- Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

- Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

- For more information, see [the angular docs](https://docs.angularjs.org/guide/component)


### Special Information
This program has been made by senior Computer Science students from Tennessee Technological University for our Capstone Project. We would like to give our thanks to the Oak Ridge National Labs Team that worked with us on this project and giving us great experience for our future careers and working in an Agile environment and team.

### Tennessee Tech University Team Members
- Tavian Dodd
- Chandler Hendrick
- Brian Kemp
- Bryce McDonald
- Grant Qualls

### Sources
 - Zip Code data compiled from data provided by [GeoNames](https://download.geonames.org/export/zip/) and [The United States Census Bureau](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html)
 - City information provided by [kelvins/US-Cities-Database](https://github.com/kelvins/US-Cities-Database)
 - Stations information provided by [National Climatic Data Center](https://www.ncei.noaa.gov/pub/data/noaa/)
 - Local Climatological Data provided by [National Centers for Environmental Information](https://www.ncei.noaa.gov/data/local-climatological-data/)
 - Additional information regarding the Local Climatological Data dataset can be found [here](https://www.ncei.noaa.gov/data/local-climatological-data/doc/LCD_documentation.pdf)
