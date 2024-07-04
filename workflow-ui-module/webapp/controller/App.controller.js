sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "jquery.sap.global"
  ],
  function (BaseController, JSONModel, MessageToast) {
    "use strict";

    return BaseController.extend("Task.workflowuimodule.controller.App", {
      onInit: function () { 
        this._context = this.getView().getModel("context");
        var code = this._context.getProperty("/newText");

        console.log("This is the value of it-",code);

        if(code==="M1"){
          this.loadData("data1");
        } else{
          this.loadData("data2");
        }
      },
      loadData: function (mission) {
        // Path to the JSON file
        var sPath = jQuery.sap.getModulePath("Task.workflowuimodule", `/model/${mission}.json`);

        // Create new JSON model
        var oModel = new JSONModel();

        // Set model to the view
        this.getView().setModel(oModel, "questionsModel");

        var oTitleModel = new JSONModel({ title: mission === "data1" ? "Mission 1" : "Mission 2" });
        this.getView().setModel(oTitleModel, "titleModel");

        oModel.attachRequestCompleted(function () {
          var data = oModel.getData();
          if (Array.isArray(data)) {
            var shuffled = data.sort(() => 0.5 - Math.random());
            // Select the first 3 questions
            var selected = shuffled.slice(0, 5);
            selected.forEach((question, index) => {
              question.index = index;
              question.selected = null; // Initialize selected property
            });
            // Set the selected questions back to the model with key "questions"
            oModel.setData({ questions: selected });
          } else {
            console.error("Invalid JSON data"); // for error 
          }
        });

        // Attach a request failed handler to log errors
        oModel.attachRequestFailed(function (oEvent) {
          console.error("Error loading JSON data: ", oEvent.getParameter("message"));
        });

        // Load JSON data from the file
        oModel.loadData(sPath);
      },

      onMissionChange: function (oEvent) {
        var sSelectedMission = oEvent.getParameter("selectedItem").getKey();
        console.log(sSelectedMission);
        if(sSelectedMission==="Mission 2"){
          this.loadData("data2");
        };
        if(sSelectedMission==="Mission 1"){
          this.loadData("data1");
        };
        
      },

      onSelect: function(oEvent) {
        console.log("triggered")
        var sSelectedKey;
        var oSource = oEvent.getSource();
        if (oSource instanceof sap.m.RadioButton) {
          sSelectedKey = oSource.getText();
        } else if (oSource instanceof sap.m.CheckBox) {
            sSelectedKey = oSource.getText();
        } else if (oSource instanceof sap.m.RadioButtonGroup) {
          var oSelectedItem = oSource.getSelectedButton();
          sSelectedKey = oSelectedItem.getText();
        } else {
            console.error("Unsupported control type.");
            return;
        }
        var oBindingContext = oSource.getBindingContext("questionsModel");
        var sPath = oBindingContext.getPath();
        var oModel = this.getView().getModel("questionsModel");
        var question = oModel.getProperty(sPath);

        if (question.type === "single") {
            // For single correct answer
            oModel.setProperty(sPath + "/selected", [sSelectedKey]);
        } else if (question.type === "multiple") {
            // For multiple correct answers
            var selectedOptions = question.selected || [];
            var index = selectedOptions.indexOf(sSelectedKey);
            if (index === -1) {
                selectedOptions.push(sSelectedKey);
            } else {
                selectedOptions.splice(index, 1);
            }
            oModel.setProperty(sPath + "/selected", selectedOptions);
        }
    },

      onSubmit: function () {
        var oModel = this.getView().getModel("questionsModel");
        var questions = oModel.getProperty("/questions");
        var score = 0;

        questions.forEach(function (question) {
          if (question.type === 'single') {
            console.log(question.selected[0]);
            if (question.selected && question.selected[0] === question.correctAnswer[0]) {
              score++;
              console.log(score);
            }
          } else if (question.type === 'multiple') {
            var selectedSorted = (question.selected || []).sort();
            var correctSorted = (question.correctAnswer || []).sort();
            console.log(selectedSorted,"...",correctSorted);
            if (JSON.stringify(selectedSorted) === JSON.stringify(correctSorted)) {
              score++;
              console.log("YES",score);
            }
          }
        });
        console.log("Score", score, typeof score);
        var oComponent = this.getOwnerComponent();
        oComponent.setScoreInContext(score);
        try {
          MessageToast.show("Your score is: " + score);
        } catch (error) {
            console.error("Error showing message toast:", error);
        }
      }
    });
  }
);
