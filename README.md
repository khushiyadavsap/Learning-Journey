
# Learning Journey: workflow-ui-module

A workflow task UI application


## Introduction

This project is a SAPUI5 application designed to create an interactive Self-test for users after completing Missions. The quiz consists of multiple questions depending on which mission the user has completed, each having either single or multiple answers. Users can select their answers and submit the quiz, after which their score is calculated and displayed. 
The project can be integrated in the SAP Build Process Automation Learing Journey workflow and also includes functionality to complete tasks and update the inbox in a workflow scenario.

## Table of Contents

- [Project Structure](#project-structure)
- [Components](#components)
- [Enhancements](#enhancements)
- [API](#api)
- [Application Details](#application-details)

## Project Structure
- **webapp/**
  - **controller/**: Contains the controller files for the views.
  - **model/**: Contains the data models.
  - **view/**: Contains the XML views.
  - **Component.js**: The main component file for the SAPUI5 application.
  - **manifest.json**: Configuration file for the SAPUI5 application.
  - **index.html**: Entry point for the application.
 

## Components

### Controller (App.controller.js)

- **onInit**: Reads the input passed to the UI5 task.
- **loadData**: Initializes the model and loads the quiz data from a JSON file depending on the input.
- **onSelect**: Handles the selection of answers for both single and multiple choice questions.
- **onSubmit**: Calculates the score based on the user's answers and displays it.

### View (App.view.xml)

- **List**: Displays the quiz questions.
- **RadioButtonGroup**: For single choice questions.
- **CheckBox**: For multiple choice questions.
- **Button**: To submit the quiz and calculate the score.

### JSON Model (data1.json, data2.json)

- **questions**: Contains an array of quiz questions, each with the question text, type (single/multiple), options, correct answer(s) and points.

### Component (Component.js)

- **setTaskModels**: Sets up the task and context models.
- **completeTask**: Completes the task and updates the context.
- **_patchTaskInstance**: Patches the task instance with the new context and marks it as completed.
- **_fetchToken**: Fetches the CSRF token for secure communication.
- **_refreshTaskList**: Refreshes the task list in the inbox.

## Enhancements

### 1. Dynamic Question Loading
Questions are now dynamically loaded from a JSON file (`data1.json` or `data2.json`) based on the value of a context property (`code`). If `code` is "M1" indicating that Mission-1 has been completed then, `data1.json` is loaded; otherwise, `data2.json` is loaded. This allows for different sets of questions to be presented based on specific conditions.

### 2. Improved Question Shuffling
Questions are shuffled randomly to ensure a unique quiz experience each time the quiz is taken. The first five questions from the shuffled list are selected for the quiz.

### 3. Automatic Score Calculation
The application now automatically calculates and displays the user's score upon submission. The score is compared against the correct answers stored in the JSON file.

### 4. Support for Single and Multiple Answer Questions
The quiz supports both single-answer and multiple-answer question types. Users can select one option for single-answer questions or multiple options for multiple-answer questions. The score calculation logic has been updated accordingly to handle both types of questions.

### 5. Enhanced User Interface
The user interface has been improved to provide a more interactive experience. The questions and options are presented using dynamic bindings, and the user's selections are tracked and updated in real-time.

## API

### Endpoints

- **/context**: Endpoint to fetch and update the task context.

### Methods

- **GET**: Fetch the current task context.
- **PATCH**: Update the task context and mark the task as completed.


## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>TBA (Coordinated Universal Time)|
|**App Generator**<br>@sap/generator-fiori-freestyle|
|**App Generator Version**<br>1.8.4|
|**Generation Platform**<br>SAP Business Application Studio|
|**Template Used**<br>simple|
|**Service Type**<br>None|
|**Service URL**<br>N/A
|**Module Name**<br>workflow-ui-module|
|**Application Title**<br>Task UI app title|
|**Namespace**<br>com.sap.demo.ui5barcode|
|**UI5 Theme**<br>sap_fiori_3|
|**UI5 Version**<br>1.82.2|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|
