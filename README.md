# Participation Marker

The Participation Marker project is designed to help track the participation of UQ students. It provides a convenient way to mark participation and keep a record of participation data.

## Features
Can provide:

1. Accepts entry format `DFXXXXXXX`
2. Automatic entry after ID card scan complete and refocus on entry field
3. Automatic details lookup using student ID number
4. Automatic date and time of scan added `YYYY-MM-DD HH:MM:SS`
5. Ability to view scanned students on the fly
6. Ability to name and download an excel sheet of the students scanned

## Installation

To install the Participation Marker project, please follow these steps:

1. Ensure that you have Python 3 installed on your system. If not, you can download and install it from the official Python website (https://www.python.org).

2. Download the project files from the GitHub repository.

3. Open a terminal or command prompt and navigate to the project directory.

4. Install the required dependencies by running the following command:

    ```shell
    pip install -r requirements.txt
    ```

    This will install all the necessary packages specified in the requirements.txt file.

## Usage

Once the installation is complete, you can use the Participation Marker project by:

0) On top level of the project, provide `students.xlsx` with table headers `Last Name|First Name|ID`
1) On a terminal, run 
    ```python3 app.py```
    at the top level of the project

2) On a browser, go to
http://127.0.0.1:5000/ to load the app
